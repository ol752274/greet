import { exportElementAsBlob, downloadBlob } from './canvasUtils';

export async function shareImage(blob, text) {
  const file = new File([blob], 'wishcraft.png', { type: 'image/png' });
  if (navigator.share && navigator.canShare({ files: [file] })) {
    await navigator.share({ title: 'WishCraft Greeting', text, files: [file] });
    return true;
  }
  return false;
}

/**
 * Try native share with image first; if unavailable, fall back to text-only link.
 */
export async function shareWithImage(canvasRef, text, fallbackFn) {
  try {
    const blob = await exportElementAsBlob(canvasRef.current);
    const file = new File([blob], 'wishcraft.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ title: 'WishCraft Greeting ✨', text, files: [file] });
      return;
    }
  } catch { /* native share unavailable or cancelled */ }
  // Fallback to text-only share
  fallbackFn(text);
}

export function shareWhatsApp(text) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

export function shareInstagram(text) {
  // Instagram doesn't have a direct web share URL for images,
  // but we can open Instagram's story share on mobile or redirect to Instagram
  // On mobile: users can share via the native share sheet (which includes Instagram)
  // On desktop: we open Instagram with the text
  window.open(`https://www.instagram.com/`, '_blank');
}

export function shareEmail(subject, body) {
  window.open(
    `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    '_self'
  );
}

export function shareTwitter(text) {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' #WishCraft')}`, '_blank');
}

export async function copyText(text) {
  await navigator.clipboard.writeText(text);
}
