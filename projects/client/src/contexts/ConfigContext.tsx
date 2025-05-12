import { createContext } from 'react';
import { IServerConfig } from '../types/IServerConfig';

export const ConfigContext = createContext<IServerConfig>({} as IServerConfig);
