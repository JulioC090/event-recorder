import { Readable } from 'node:stream';

export type IProxyHandleResult = {
  body?: string;
  stream?: Readable;
};

export type IProxyHandle = (
  headers: { [key: string]: string },
  response: Response,
  targetURL: string,
) => Promise<IProxyHandleResult>;
