import html2canvas from 'html2canvas';

export async function exportElementAsBlob(element) {
  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: 2,
    backgroundColor: null,
    logging: false,
  });
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

export function downloadBlob(blob, filename = 'wishcraft-greeting.png') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
