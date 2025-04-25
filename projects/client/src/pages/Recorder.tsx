import { Broom, Export } from '@phosphor-icons/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import IconButton from '../components/IconButton';
import PlayButton from '../components/PlayButton';

interface CapturedEvent {
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
}

const acceptEvents = ['click', 'mousemove', 'mouseenter', 'mouseout'];

export default function Recorder() {
  const { url } = useParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const capturedEvents = useRef<Array<CapturedEvent>>([]);
  const [capturing, setCapturing] = useState<boolean>(false);

  function toggleCapture() {
    setCapturing((prevCapturing) => !prevCapturing);
  }

  function clearCapturedEvents() {
    capturedEvents.current = [];
  }

  function exportCapturedEvents() {
    if (!iframeRef || !iframeRef.current) return;

    const iframeWindow = iframeRef.current.contentWindow;

    const exportData = {
      url: url,
      events: capturedEvents.current,
      viewport: {
        width: iframeWindow!.innerWidth,
        height: iframeWindow!.innerHeight,
      },
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `eventos-${Date.now()}.json`;
    a.click();
  }

  const logEvent = useCallback(
    (e: Event) => {
      if (!capturing) return;
      if (!acceptEvents.includes(e.type)) return;
      if (!iframeRef || !iframeRef.current || !iframeRef.current.contentWindow)
        return;

      const target = e.target as HTMLElement;

      if (target.nodeType !== 1) return;

      const style = iframeRef.current.contentWindow.getComputedStyle(target);
      const text = target.innerText?.slice(0, 100) || null;

      const eventInfo = {
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
      };

      capturedEvents.current.push(eventInfo);
    },
    [capturing],
  );

  useEffect(() => {
    if (!iframeRef || !iframeRef.current) return;

    try {
      const iframeWindow = iframeRef.current!.contentWindow;
      const iframeDocument =
        iframeRef.current!.contentDocument || iframeWindow!.document;

      acceptEvents.forEach((type) => {
        iframeDocument.addEventListener(type, logEvent, true);
      });

      return () => {
        acceptEvents.forEach((type) => {
          iframeDocument.removeEventListener(type, logEvent, true);
        });
      };
    } catch (err) {
      console.warn(
        '❌ Não foi possível acessar o conteúdo do iframe. Verifique se a URL é do mesmo domínio.',
        err,
      );
    }
  }, [iframeRef, logEvent]);

  return (
    <>
      <iframe ref={iframeRef} className="h-screen w-full" src={url} />
      <div className="flex gap-2 p-2 absolute bottom-4 right-4 bg-background rounded">
        <PlayButton onClick={toggleCapture} isPlaying={capturing} />
        <IconButton onClick={clearCapturedEvents} icon={<Broom size={24} />} />
        <IconButton
          onClick={exportCapturedEvents}
          icon={<Export size={24} />}
        />
      </div>
    </>
  );
}
