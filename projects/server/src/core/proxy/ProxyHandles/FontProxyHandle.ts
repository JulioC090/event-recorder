import { IProxyHandle, IProxyHandleResult } from '@/types/IProxyHandle';
import { Readable } from 'node:stream';

export default class FontProxyHandle implements IProxyHandle {
  public match(type: string): boolean {
    return type.includes('font');
  }

  public async execute(
    headers: { [key: string]: string },
    response: Response,
  ): Promise<IProxyHandleResult> {
    headers['connection'] = '';

    if (!response.body) return {};

    return {
      stream: Readable.from(response.body),
    };
  }
}
