import express, { Request, Response } from 'express';
import { Readable } from 'node:stream';

const app = express();
const PORT = 3000;
const HOST = 'localhost';
const BASE_URL = `http://${HOST}:${PORT}`;

const injectClientScripts = (targetURL: string) => `
  <base href="${targetURL}">
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
    .replace(
      /<head[^>]*>/i,
      (match) => `${match}${injectClientScripts(targetURL)}`,
    );
}

function rewriteCSS(css: string, targetURL: string) {
  return css.replace(/url\((['"]?\/[^"')]*['"]?)\)/g, (_, path) => {
    const fullUrl = new URL(path, targetURL).toString();
    return `url("${BASE_URL}/${fullUrl}")`;
  });
}

app.get('/{*url}', async (req: Request, res: Response): Promise<void> => {
  try {
    const targetURL = req.url.slice(1);

    const response = await fetch(targetURL);

    const headers: { [key: string]: string } = {};
    response.headers.forEach((value, key) => {
      if (key === 'content-encoding') return;
      headers[key] = value;
    });

    res.set(headers);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.status(response.status);

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {
      const body = await response.text();
      res.send(rewriteHTML(body, targetURL));
      return;
    }

    if (contentType.includes('text/css')) {
      const body = await response.text();
      res.send(rewriteCSS(body, targetURL));
      return;
    }

    if (contentType.includes('image') || contentType.includes('font')) {
      if (contentType.includes('font')) {
        res.setHeader('connection', '');
      }

      if (response.body) {
        Readable.from(response.body).pipe(res);
        return;
      }
    }

    const body = await response.text();
    res.send(body);
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando em ${BASE_URL}`);
});
