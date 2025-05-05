import { Readable } from 'node:stream';

export interface IProxyResult {
  headers: { [key: string]: string };
  body?: unknown;
  stream?: Readable;
  status: number;
}

export default interface IProxy {
  execute(destinationUrl: string): Promise<IProxyResult>;
}
