import { Readable } from 'node:stream';

export default async function ImageProxyHandle(
  headers: { [key: string]: string },
  response: Response,
) {
  if (!response.body) return {};

  return {
    stream: Readable.from(response.body),
  };
}
