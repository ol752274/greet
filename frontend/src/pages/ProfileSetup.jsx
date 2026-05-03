import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import s from './ProfileSetup.module.css';

export default function ProfileSetup() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  function handleFile(e) {
    const f = e.target.files[0]; if (!f) return;
    setAvatarFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', name.trim());
      if (avatarFile) fd.append('avatar', avatarFile);
      const data = await api.updateProfile(fd);
      setUser(data.user);
      navigate('/');
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className={s.screen}>
      <div className={s.card}>
        <div className={s.avatarBtn} onClick={() => fileRef.current.click()}>
          {preview ? <img src={preview} alt="avatar" className={s.img} /> : <span>📸</span>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFile} />
        <h2 className={s.title}>Set Up Your Profile</h2>
        <p className={s.sub}>Your name & photo appear on greetings</p>
        <input className={s.input} placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} />
        <button className={s.btn} onClick={handleSave} disabled={loading || !name.trim()}>
          {loading ? 'Saving…' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
