import { Readable } from 'node:stream';

export default async function FontProxyHandle(
  headers: { [key: string]: string },
  response: Response,
) {
  headers['connection'] = '';

  if (!response.body) return {};

  return {
    stream: Readable.from(response.body),
  };
}
