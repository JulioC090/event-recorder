import { ReactNode, useEffect, useState } from 'react';
import LoadingSetting from '../pages/LoadingSettings';
import { loadConfig } from '../services/ConfigService';
import { IServerConfig } from '../types/IServerConfig';
import { ConfigContext } from './ConfigContext';

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<IServerConfig>();

  useEffect(() => {
    loadConfig()
      .then(setConfig)
      .catch((err) => {
        console.error('Error:', err);
      });
  }, []);

  if (!config) return <LoadingSetting />;

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}
