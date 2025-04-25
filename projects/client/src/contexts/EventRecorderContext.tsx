import { createContext } from 'react';

interface EventRecorderContextType {
  isCapturing: boolean;
  toggleCapturing: () => void;
  clearCapturedEvents: () => void;
  exportCapturedEvents: (url?: string) => void;
  initializeEventCapture: (
    iframeRef: React.RefObject<HTMLIFrameElement | null>,
  ) => void;
}

export const EventRecorderContext = createContext<EventRecorderContextType>(
  {} as EventRecorderContextType,
);
