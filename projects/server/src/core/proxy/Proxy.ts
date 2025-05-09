import { BASE_URL } from '@/config/serverConfig';
import CSSProxyHandle from '@/core/proxy/ProxyHandles/CSSProxyHandle';
import FontProxyHandle from '@/core/proxy/ProxyHandles/FontProxyHandle';
import HTMLProxyHandle from '@/core/proxy/ProxyHandles/HTMLProxyHandle';
import ImageProxyHandle from '@/core/proxy/ProxyHandles/ImageProxyHandle';
import IProxy, { IProxyResult } from '@/types/IProxy';
import { IProxyHandle } from '@/types/IProxyHandle';
import { Readable } from 'node:stream';

const handlers: Array<IProxyHandle> = [
  new HTMLProxyHandle(BASE_URL),
  new CSSProxyHandle(BASE_URL),
  new ImageProxyHandle(),
  new FontProxyHandle(),
];

export default class Proxy implements IProxy {
  async execute(destinationUrl: string): Promise<IProxyResult> {
    const response = await fetch(destinationUrl);

    const contentType = response.headers.get('content-type') || '';

    const headers: { [key: string]: string } = {};
    response.headers.forEach((value, key) => {
      if (key === 'content-encoding') return;
      headers[key] = value;
    });

    let body: string | undefined;
    let stream: Readable | undefined;

    for (const handle of handlers) {
      if (handle.match(contentType)) {
        const res = await handle.execute(headers, response, destinationUrl);

        body = res.body;
        stream = res.stream;
      }
    }

    // Default fallback
    if (!body && !stream)
      return { headers, body: await response.text(), status: response.status };

    return { headers, body, stream, status: response.status };
  }
}
