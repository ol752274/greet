import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { signInWithGoogle } from '../services/firebase';
import useAuthStore from '../store/useAuthStore';
import s from './Auth.module.css';

export default function Auth() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handle(fn) {
    setError(''); setLoading(true);
    try {
      const data = await fn();
      setAuth(data.token, data.user);
      // New user without name → profile setup; else → home
      navigate(data.user.name ? '/' : '/profile');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleGoogleSignIn() {
    setError(''); setLoading(true);
    try {
      // Step 1: Sign in with Google via Firebase popup
      const googleUser = await signInWithGoogle();
      // Step 2: Send Google profile to our backend to create/find user + get JWT
      const data = await api.googleAuth(googleUser);
      setAuth(data.token, data.user);
      navigate(data.user.name ? '/' : '/profile');
    } catch (e) {
      // User may have closed the popup
      if (e.code !== 'auth/popup-closed-by-user') {
        setError(e.message || 'Google sign-in failed');
      }
    } finally { setLoading(false); }
  }

  return (
    <div className={s.screen}>
      <div className={s.card}>
        <div className={s.logo}>✨ Greet</div>
        <p className={s.tagline}>Create & share beautiful greetings</p>

        <div className={s.tabs}>
          <button className={`${s.tab} ${isLogin ? s.active : ''}`} onClick={() => setIsLogin(true)}>Sign In</button>
          <button className={`${s.tab} ${!isLogin ? s.active : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>

        {!isLogin && (
          <input className={s.input} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        )}
        <input className={s.input} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
        <input className={s.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

        {error && <p className={s.error}>{error}</p>}

        <button
          className={s.primary}
          disabled={loading || !email || !password}
          onClick={() => handle(() => isLogin ? api.login(email, password) : api.register(email, password, name))}
        >
          {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
        </button>

        <div className={s.divider}>or</div>

        <button className={s.googleBtn} onClick={handleGoogleSignIn} disabled={loading}>
          <svg className={s.googleIcon} viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <button className={s.ghost} onClick={() => handle(() => api.guest())} disabled={loading}>
          👋 Continue as Guest
        </button>
      </div>
    </div>
  );
}
