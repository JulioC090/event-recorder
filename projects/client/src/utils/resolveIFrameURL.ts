export default function resolveIFrameURL(url?: string) {
  if (!url) return '';

  if (import.meta.env.MODE === 'development') return url;

  return `http://localhost:3000/${url}`;
}
