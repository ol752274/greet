import { useState } from 'react';
import s from './TemplateCard.module.css';

export default function TemplateCard({ template, isSelected, onClick, userName, userAvatar }) {
  const initial = (userName || 'U')[0].toUpperCase();
  const [imgError, setImgError] = useState(false);
  const showImg = userAvatar && !imgError;

  return (
    <div className={`${s.card} ${isSelected ? s.selected : ''}`} onClick={onClick}>
      <div className={s.bg} style={{ background: template.gradient }}>
        <span className={s.emoji}>{template.emoji}</span>

        {/* Live preview: user name & photo overlay */}
        <div className={s.previewOverlay}>
          <div className={s.previewAvatar}>
            {showImg
              ? <img src={userAvatar} alt="avatar" className={s.previewAvatarImg} crossOrigin="anonymous" onError={() => setImgError(true)} />
              : <span className={s.previewInitial}>{initial}</span>
            }
          </div>
          <span className={s.previewName}>{userName || 'Your Name'}</span>
        </div>

        <div className={s.label}>{template.label}</div>
        {template.premium && <span className={s.badge}>⭐ PRO</span>}
        {template.locked && <div className={s.lockOverlay}>🔒</div>}
      </div>
    </div>
  );
}
