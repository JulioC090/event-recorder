export default function resolveIFrameURL(port: string, url?: string) {
  if (!url) return '';

  if (import.meta.env.MODE === 'development') return url;

  return `http://localhost:${port}/${url}`;
}
