import { Readable } from 'node:stream';

export type IProxyHandleResult = {
  body?: string;
  stream?: Readable;
};

export interface IProxyHandle {
  match(type: string): boolean;
  execute(
    headers: { [key: string]: string },
    response: Response,
    targetURL: string,
  ): Promise<IProxyHandleResult>;
}
