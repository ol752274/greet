import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useTemplateStore from '../store/useTemplateStore';
import CategoryTabs from '../components/templates/CategoryTabs';
import TemplateGrid from '../components/templates/TemplateGrid';
import PreviewCanvas from '../components/canvas/PreviewCanvas';
import ShareSheet from '../components/share/ShareSheet';
import PremiumModal from '../components/premium/PremiumModal';
import s from './Home.module.css';

export default function Home() {
  const { user, setUser, logout } = useAuthStore();
  const { activeCategory, setCategory } = useTemplateStore();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [showPremium, setShowPremium] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customWish, setCustomWish] = useState('');
  const [fontSize, setFontSize] = useState(1);
  const [avatarError, setAvatarError] = useState(false);
  // Increment this to force TemplateGrid to re-fetch after premium upgrade
  const [refreshKey, setRefreshKey] = useState(0);
  const canvasRef = useRef();

  function openPreview(t) {
    setSelected(t);
    setCustomName(user?.name || '');
    setCustomWish(t.wish);
    setFontSize(1);
  }

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  function handlePremiumSuccess() {
    // Update user state to premium
    setUser({ ...user, isPremium: true });
    // Force template grid to re-fetch (templates will now be unlocked)
    setRefreshKey((k) => k + 1);
  }

  const avatarSrc = (user?.avatarUrl && !avatarError) ? user.avatarUrl : null;
  const initial = (user?.name || 'G')[0].toUpperCase();

  return (
    <div className={s.app}>
      <header className={s.topbar}>
        <div className={s.logo}>✨ Greet</div>
        <div className={s.right}>
          {!user?.isPremium && (
            <button className={s.premBadge} onClick={() => setShowPremium(true)}>⭐ Go Premium</button>
          )}
          {user?.isPremium && <span className={s.premTag}>⭐ Premium</span>}
          <div className={s.avatar} title="Click to logout" onClick={handleLogout}>
            {avatarSrc ? <img src={avatarSrc} alt="av" onError={() => setAvatarError(true)} /> : initial}
          </div>
        </div>
      </header>

      <main className={s.main}>
        <h1 className={s.heading}>Good day, <span>{user?.name || 'friend'}</span> 👋</h1>
        <p className={s.sub}>Pick a template and personalise it in seconds</p>
        <CategoryTabs />
        <TemplateGrid
          key={refreshKey}
          selectedId={selected?.id}
          onSelect={openPreview}
          onSelectLocked={() => setShowPremium(true)}
        />
      </main>

      {/* Preview Modal */}
      {selected && (
        <div className={s.overlay} onClick={() => setSelected(null)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.mHeader}>
              <h2 className={s.mTitle}>Live Preview</h2>
              <button className={s.closeBtn} onClick={() => setSelected(null)}>×</button>
            </div>
            <div className={s.layout}>
              <PreviewCanvas
                ref={canvasRef}
                template={selected}
                name={customName}
                wish={customWish}
                avatarSrc={avatarSrc}
                fontSize={fontSize}
              />
              <div className={s.controls}>
                <p className={s.cHeading}>Customise</p>

                <label className={s.lbl}>Name</label>
                <input className={s.inp} value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Your name" />

                <label className={s.lbl}>Wish</label>
                <input className={s.inp} value={customWish} onChange={e => setCustomWish(e.target.value)} placeholder="Your message" />

                <label className={s.lbl}>Font Size</label>
                <input type="range" min="0.7" max="1.6" step="0.05" value={fontSize} onChange={e => setFontSize(parseFloat(e.target.value))} className={s.slider} />

                <ShareSheet canvasRef={canvasRef} wish={customWish} templateId={selected.id} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showPremium && (
        <PremiumModal
          onClose={() => setShowPremium(false)}
          onSuccess={handlePremiumSuccess}
        />
      )}
    </div>
  );
}
