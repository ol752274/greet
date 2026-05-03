import { useState } from 'react';
import { api } from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import { PLANS } from '../../utils/constants';
import s from './PremiumModal.module.css';

export default function PremiumModal({ onClose, onSuccess }) {
  const { user, setUser } = useAuthStore();
  const [plan, setPlan] = useState(PLANS[1]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubscribe() {
    setLoading(true);
    setError('');
    try {
      const res = await api.subscribe(plan.id);
      // Update user state with premium flag
      setUser({ ...user, isPremium: true });
      // Notify parent to refresh templates etc.
      onSuccess?.();
      onClose();
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <button className={s.closeX} onClick={onClose} aria-label="Close">×</button>
        <div className={s.crown}>👑</div>
        <h2 className={s.title}>Greet Premium</h2>
        <p className={s.sub}>Unlock all templates, HD export &amp; no watermark.</p>
        <div className={s.plans}>
          {PLANS.map((p) => (
            <div key={p.id} className={`${s.plan} ${plan.id === p.id ? s.selected : ''}`} onClick={() => setPlan(p)}>
              {p.best && <span className={s.bestBadge}>BEST VALUE</span>}
              <div className={s.price}>{p.price}</div>
              <div className={s.period}>{p.period}</div>
            </div>
          ))}
        </div>
        <ul className={s.perks}>
          {['All premium templates unlocked', 'HD PNG export (no watermark)', 'Priority new template drops'].map((p) => (
            <li key={p}><span className={s.tick}>✓</span> {p}</li>
          ))}
        </ul>
        {error && <p className={s.error}>{error}</p>}
        <button className={s.sub_btn} onClick={handleSubscribe} disabled={loading}>
          {loading ? 'Processing…' : `Subscribe — ${plan.price}${plan.period}`}
        </button>
        <button className={s.cancel} onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}
