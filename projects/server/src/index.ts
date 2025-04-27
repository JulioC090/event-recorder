import express, { Request, Response } from 'express';
import { Readable } from 'node:stream';

const app = express();
const PORT = 3000;
const HOST = 'localhost';

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

    if (response.headers.get('content-type')?.includes('text/html')) {
      let body = await response.text();

      body = body.replace(
        /(src|href)=["'](http[^"']*)["']/g,
        (match, attr, path) => {
          return `${attr}="http://${HOST}:${PORT}/${path}"`;
        },
      );

      body = body.replace(
        /(<[^>]+\s(?:src|href|action)=["'])(\/[^"'>]+)/gi,
        (_, prefix, path) => {
          const fullUrl = new URL(path, targetURL).toString();
          return `${prefix}http://${HOST}:${PORT}/${fullUrl}`;
        },
      );

      body = body.replace(
        /(<[^>]+\s(?:src|href|action)=["'])(?!https?:\/\/|\/\/|data:|\/)([^"'>]+)/gi,
        (_, prefix, path) => {
          const fullUrl = new URL(path, targetURL).toString();
          return `${prefix}http://${HOST}:${PORT}/${fullUrl}`;
        },
      );

      body = body.replace(
        /<head[^>]*>/i,
        (match) => `${match}<base href="${targetURL}">`,
      );

      body = body.replace(
        /<head[^>]*>/i,
        (match) => `${match}<script>
          console.log('Reescrevendo fetch')
          const originalFetch = window.fetch;
          window.fetch = async (input, init) => {
            let url = typeof input === 'string' ? input : input.url;
            console.log(url);
  
            const proxyUrl = \`http://localhost:3000/\${url}\`;
  
            if (typeof input !== 'string') {
              input = new Request(proxyUrl, input);
            } else {
              input = proxyUrl;
            }
  
            return originalFetch(input, init);
          }

          console.log('Reescrevendo XMLHttpRequest');

          const originalOpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            // Verificando se a URL precisa ser reescrita
            if (!url.startsWith("http") && !url.startsWith("//")) {
              url = \`http://\${HOST}:\${PORT}/\${url}\`;
            }

            // Chama o método original com a URL reescrita
            return originalOpen.call(this, method, url, async, user, password);
          };
        </script>`,
      );
      res.send(body);
      return;
    }

    if (response.headers.get('content-type')?.includes('text/css')) {
      let body = await response.text();

      body = body.replace(/url\((['"]?\/[^"')]*['"]?)\)/g, (_, path) => {
        const fullUrl = new URL(path, targetURL).toString();
        return `url("http://${HOST}:${PORT}/${fullUrl}")`;
      });

      res.send(body);
      return;
    }

    if (
      response.headers.get('content-type')?.includes('image') &&
      response.body
    ) {
      Readable.from(response.body).pipe(res);
      return;
    }

    if (
      response.headers.get('content-type')?.includes('font') &&
      response.body
    ) {
      res.setHeader('connection', '');
      Readable.from(response.body).pipe(res);
      return;
    }

    console.log(response.headers.get('content-type'));

    const body = await response.text();
    res.send(body);
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando em http://localhost:${PORT}`);
});
