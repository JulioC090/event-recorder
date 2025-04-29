import { BASE_URL, HOST, PORT } from '@/config/serverConfig';
import IProxy, { IProxyResult } from '@/types/IProxy';
import { Readable } from 'node:stream';

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

function rewriteHTML(html: string, targetURL: string) {
  return html
    .replace(/(src|href)=["'](http[^"']*)["']/g, (match, attr, path) => {
      return `${attr}="http://${HOST}:${PORT}/${path}"`;
    })
    .replace(
      /(<[^>]+\s(?:src|href|action)=["'])(\/[^"'>]+)/gi,
      (_, prefix, path) => {
        const fullUrl = new URL(path, targetURL).toString();
        return `${prefix}http://${HOST}:${PORT}/${fullUrl}`;
      },
    )
    .replace(
      /(<[^>]+\s(?:src|href|action)=["'])(?!https?:\/\/|\/\/|data:|\/)([^"'>]+)/gi,
      (_, prefix, path) => {
        const fullUrl = new URL(path, targetURL).toString();
        return `${prefix}http://${HOST}:${PORT}/${fullUrl}`;
      },
    )
    .replace(/<head[^>]*>/i, (match) => `${match}<base href="${targetURL}">`)
    .replace(/<head[^>]*>/i, (match) => `${match}${injectClientScripts()}`);
}

function rewriteCSS(css: string, targetURL: string) {
  return css.replace(/url\((['"]?\/[^"')]*['"]?)\)/g, (_, path) => {
    const fullUrl = new URL(path, targetURL).toString();
    return `url("${BASE_URL}/${fullUrl}")`;
  });
}

export default class Proxy implements IProxy {
  async execute(destinationUrl: string): Promise<IProxyResult> {
    const response = await fetch(destinationUrl);

    const headers: { [key: string]: string } = {};
    response.headers.forEach((value, key) => {
      if (key === 'content-encoding') return;
      headers[key] = value;
    });

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {
      const body = await response.text();
      return {
        headers,
        body: rewriteHTML(body, destinationUrl),
        status: response.status,
      };
    }

    if (contentType.includes('text/css')) {
      const body = await response.text();
      return {
        headers,
        body: rewriteCSS(body, destinationUrl),
        status: response.status,
      };
    }

    if (contentType.includes('image') || contentType.includes('font')) {
      if (contentType.includes('font')) {
        headers['connection'] = '';
      }

      if (response.body) {
        return {
          headers,
          stream: Readable.from(response.body),
          status: response.status,
        };
      }
    }

    return { headers, body: await response.text(), status: response.status };
  }
}
