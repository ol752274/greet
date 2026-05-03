import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import AuthGuard from './components/auth/AuthGuard';
import Auth from './pages/Auth';
import ProfileSetup from './pages/ProfileSetup';
import Home from './pages/Home';

export default function App() {
  const init = useAuthStore(s => s.init);
  useEffect(() => { init(); }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<AuthGuard><ProfileSetup /></AuthGuard>} />
        <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
