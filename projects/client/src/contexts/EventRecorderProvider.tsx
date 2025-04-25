import { ReactNode, useCallback, useRef, useState } from 'react';
import { ACCEPTED_EVENTS } from '../constants/acceptedEvents';
import { EventRecorderContext } from './EventRecorderContext';

type CapturedEvent = {
  type: string;
  target: {
    tag: string;
    id: string;
    class: string;
    text: string | null;
    style: string | null;
  };
  timestamp: number;
  pageX: number | null;
  pageY: number | null;
};

export function EventRecorderProvider({ children }: { children: ReactNode }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const capturedEvents = useRef<Array<CapturedEvent>>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleCapturing = () => setIsCapturing((prev) => !prev);
  const clearCapturedEvents = () => (capturedEvents.current = []);

  const exportCapturedEvents = (url?: string) => {
    if (!iframeRef || !iframeRef.current) return;

    const iframeWindow = iframeRef.current.contentWindow;

    const data = {
      url,
      events: capturedEvents.current,
      viewport: {
        width: iframeWindow!.innerWidth,
        height: iframeWindow!.innerHeight,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `eventos-${Date.now()}.json`;
    a.click();
  };

  const logEvent = useCallback(
    (e: Event) => {
      if (!isCapturing || !ACCEPTED_EVENTS.includes(e.type)) return;

      const target = e.target as HTMLElement;
      if (target.nodeType !== 1) return;

      const style = iframeRef.current?.contentWindow?.getComputedStyle(target);
      const text = target.innerText?.slice(0, 100) || null;

      capturedEvents.current.push({
        type: e.type,
        target: {
          tag: target.tagName,
          id: target.id,
          class: target.className,
          text,
          style: style?.cursor ?? null,
        },
        timestamp: Date.now(),
        pageX: (e as MouseEvent).pageX ?? null,
        pageY: (e as MouseEvent).pageY ?? null,
      });
    },
    [isCapturing],
  );

  const initializeEventCapture = useCallback(
    (iframe: React.RefObject<HTMLIFrameElement | null>) => {
      if (!iframe || !iframe.current) return;

      iframeRef.current = iframe.current;

      try {
        const doc =
          iframe.current.contentDocument ||
          iframe.current.contentWindow?.document;
        if (!doc) return;

        const handler = (e: Event) => logEvent(e);

        ACCEPTED_EVENTS.forEach((type) => {
          doc.addEventListener(type, handler, true);
        });

        return () => {
          ACCEPTED_EVENTS.forEach((type) => {
            doc.removeEventListener(type, handler, true);
          });
        };
      } catch (err) {
        console.warn('Erro ao acessar o iframe:', err);
      }
    },
    [logEvent],
  );

  return (
    <EventRecorderContext.Provider
      value={{
        isCapturing,
        toggleCapturing,
        clearCapturedEvents,
        exportCapturedEvents,
        initializeEventCapture,
      }}
    >
      {children}
    </EventRecorderContext.Provider>
  );
}
