import { IProxyHandle, IProxyHandleResult } from '@/types/IProxyHandle';
import { Readable } from 'node:stream';

export default class ImageProxyHandle implements IProxyHandle {
  public match(type: string): boolean {
    return type.includes('image');
  }

  public async execute(
    headers: { [key: string]: string },
    response: Response,
  ): Promise<IProxyHandleResult> {
    if (!response.body) return {};

    return {
      stream: Readable.from(response.body),
    };
  }
}
