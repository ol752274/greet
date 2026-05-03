import { useState } from 'react';
import { exportElementAsBlob, downloadBlob } from '../../utils/canvasUtils';
import { shareImage, shareWhatsApp, shareInstagram, shareEmail, shareTwitter, copyText } from '../../utils/shareUtils';
import s from './ShareSheet.module.css';

export default function ShareSheet({ canvasRef, wish, templateId }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const blob = await exportElementAsBlob(canvasRef.current);
      downloadBlob(blob);
    } catch { alert('Export failed.'); }
    finally { setLoading(false); }
  }

  async function handleShareWithImage(fallbackFn) {
    setLoading(true);
    try {
      const blob = await exportElementAsBlob(canvasRef.current);
      const file = new File([blob], 'wishcraft.png', { type: 'image/png' });
      // Try native share with image
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'WishCraft Greeting ✨', text: wish, files: [file] });
      } else {
        // Can't share image natively — download it and open the text share link
        downloadBlob(blob);
        fallbackFn(wish);
      }
    } catch {
      // User cancelled or error — try text-only fallback
      fallbackFn(wish);
    } finally { setLoading(false); }
  }

  async function handleShare() {
    setLoading(true);
    try {
      const blob = await exportElementAsBlob(canvasRef.current);
      const ok = await shareImage(blob, wish);
      if (!ok) downloadBlob(blob);
    } catch { } finally { setLoading(false); }
  }

  async function handleCopy() {
    await copyText(`${window.location.origin}/share?t=${templateId}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={s.wrap}>
      <p className={s.label}>Share</p>
      <div className={s.row}>
        <button className={s.btn} onClick={() => handleShareWithImage(shareWhatsApp)} disabled={loading}>
          💬 WhatsApp
        </button>
        <button className={s.btn} onClick={() => handleShareWithImage(shareInstagram)} disabled={loading}>
          📸 Instagram
        </button>
      </div>
      <div className={s.row}>
        <button className={s.btn} onClick={() => handleShareWithImage((t) => shareEmail('WishCraft Greeting ✨', t))} disabled={loading}>
          📧 Email
        </button>
        <button className={s.btn} onClick={() => handleShareWithImage(shareTwitter)} disabled={loading}>
          🐦 Twitter
        </button>
      </div>
      <div className={s.row}>
        <button className={s.btn} onClick={handleCopy}>{copied ? '✅ Copied!' : '🔗 Copy Link'}</button>
        <button className={`${s.btn} ${s.primary}`} onClick={handleDownload} disabled={loading}>
          {loading ? '⏳…' : '⬇ Save PNG'}
        </button>
      </div>
      {navigator.share && (
        <button className={s.full} onClick={handleShare} disabled={loading}>📤 Share via…</button>
      )}
    </div>
  );
}
