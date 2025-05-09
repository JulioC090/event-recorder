import { IServerConfig } from '../types/IServerConfig';

export async function loadConfig(): Promise<IServerConfig> {
  const configUrl =
    import.meta.env.MODE === 'development' ? '/config.dev.json' : '/config';

  const res = await fetch(configUrl);
  if (!res.ok) throw new Error('Error: Failed to load configuration');
  return res.json();
}
