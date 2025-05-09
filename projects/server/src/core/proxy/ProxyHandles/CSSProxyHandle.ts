import { IProxyHandle, IProxyHandleResult } from '@/types/IProxyHandle';

export default class CSSProxyHandle implements IProxyHandle {
  constructor(private baseURL: string) {}

  public match(type: string): boolean {
    return type.includes('text/css');
  }

  public async execute(
    headers: { [key: string]: string },
    response: Response,
    targetURL: string,
  ): Promise<IProxyHandleResult> {
    let css = await response.text();

    // Replaces all occurrences of url(...) in the CSS that use relative paths (starting with '/')
    // with full URLs pointing to the proxy (BASE_URL + absolute URL based on targetURL).
    css = css.replace(/url\((['"]?\/[^"')]*['"]?)\)/g, (_, path) => {
      const fullUrl = new URL(path, targetURL).toString();
      return `url("${this.baseURL}/${fullUrl}")`;
    });

    return { body: css };
  }
}
