import { BASE_URL } from '@/config/serverConfig';
import { IProxyHandleResult } from '@/types/IProxyHandle';

const injectClientScripts = () => `
  <script>
    console.log('Rewriting fetch and XMLHttpRequest');
    
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      let url = typeof input === 'string' ? input : input.url;
      const proxyUrl = '${BASE_URL}/' + url;
      input = typeof input === 'string' ? proxyUrl : new Request(proxyUrl, input);
      return originalFetch(input, init);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      if (!url.startsWith("http") && !url.startsWith("//")) {
        url = '${BASE_URL}/' + url;
      }
      return originalOpen.call(this, method, url, async, user, password);
    };
  </script>
`;

export default async function HTMLProxyHandle(
  headers: { [key: string]: string },
  response: Response,
  targetURL: string,
): Promise<IProxyHandleResult> {
  let html = await response.text();

  html = html
    // Rewrites absolute URLs (starting with http/https) in src or href attributes
    // to go through your proxy server.
    .replace(/(src|href)=["'](http[^"']*)["']/g, (match, attr, path) => {
      return `${attr}="${BASE_URL}/${path}"`;
    })
    // Rewrites *root-relative* paths (e.g., /images/logo.png) in src, href, or action attributes
    // to be absolute URLs based on the original `targetURL`, and prepends the proxy prefix.
    .replace(
      /(<[^>]+\s(?:src|href|action)=["'])(\/[^"'>]+)/gi,
      (_, prefix, path) => {
        const fullUrl = new URL(path, targetURL).toString();
        return `${prefix}${BASE_URL}/${fullUrl}`;
      },
    )
    // Rewrites *relative* paths (e.g., images/logo.png) that don’t start with /, http, data:, etc.
    // These are also converted into absolute URLs based on `targetURL`, then proxied.
    .replace(
      /(<[^>]+\s(?:src|href|action)=["'])(?!https?:\/\/|\/\/|data:|\/)([^"'>]+)/gi,
      (_, prefix, path) => {
        const fullUrl = new URL(path, targetURL).toString();
        return `${prefix}${BASE_URL}/${fullUrl}`;
      },
    )
    // Injects a <base> tag inside the <head> to help resolve relative paths correctly in the browser.
    .replace(/<head[^>]*>/i, (match) => `${match}<base href="${targetURL}">`)
    // Injects your client-side scripts (probably for rewriting or monitoring) after the <head> tag.
    .replace(/<head[^>]*>/i, (match) => `${match}${injectClientScripts()}`);

  return { body: html };
}
