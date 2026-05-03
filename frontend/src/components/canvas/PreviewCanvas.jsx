import { forwardRef, useState, useEffect } from 'react';
import s from './PreviewCanvas.module.css';

/**
 * Convert an external image URL to a base64 data URL to avoid CORS issues with html2canvas.
 */
function useBase64Avatar(src) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    if (!src) { setDataUrl(null); return; }

    // If it's already a data URL or a local path, use as-is
    if (src.startsWith('data:') || src.startsWith('/uploads')) {
      setDataUrl(src);
      return;
    }

    // External URL (e.g. Google avatar) — convert to base64 to avoid CORS in html2canvas
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        setDataUrl(canvas.toDataURL('image/png'));
      } catch {
        // CORS blocked — fall back to original (will show in DOM but not in export)
        setDataUrl(src);
      }
    };
    img.onerror = () => setDataUrl(null);
    img.src = src;
  }, [src]);

  return dataUrl;
}

const PreviewCanvas = forwardRef(function PreviewCanvas(
  { template, name, wish, avatarSrc, fontSize = 1 }, ref
) {
  const resolvedAvatar = useBase64Avatar(avatarSrc);

  return (
    <div ref={ref} className={s.canvas} style={{ background: template.gradient }}>
      <div className={s.circle1} />
      <div className={s.circle2} />
      <div className={s.emojiWrap}><span className={s.emoji}>{template.emoji}</span></div>
      <div className={s.overlay}>
        <div className={s.avatarRing}>
          {resolvedAvatar
            ? <img src={resolvedAvatar} alt="avatar" className={s.avatarImg} />
            : <span className={s.initial}>{(name || 'U')[0].toUpperCase()}</span>
          }
        </div>
        <p className={s.name} style={{ fontSize: `${fontSize}rem` }}>{name || 'Your Name'}</p>
        <p className={s.wish}>{wish}</p>
      </div>
    </div>
  );
});

export default PreviewCanvas;
