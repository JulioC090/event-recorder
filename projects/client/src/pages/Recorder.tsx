import { Broom, Export } from '@phosphor-icons/react';
import { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import IconButton from '../components/IconButton';
import PlayButton from '../components/PlayButton';
import { ConfigContext } from '../contexts/ConfigContext';
import { EventRecorderContext } from '../contexts/EventRecorderContext';
import resolveIFrameURL from '../utils/resolveIFrameURL';

export default function Recorder() {
  const { url } = useParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const {
    isCapturing,
    toggleCapturing,
    clearCapturedEvents,
    exportCapturedEvents,
    initializeEventCapture,
  } = useContext(EventRecorderContext);

  const { port } = useContext(ConfigContext);

  useEffect(() => {
    return initializeEventCapture(iframeRef);
  }, [initializeEventCapture, iframeRef]);

  return (
    <>
      <iframe
        ref={iframeRef}
        className="h-screen w-full"
        src={resolveIFrameURL(port.toString(), url)}
      />
      <div className="flex gap-2 p-2 absolute bottom-4 right-4 bg-background rounded">
        <PlayButton onClick={toggleCapturing} isPlaying={isCapturing} />
        <IconButton onClick={clearCapturedEvents} icon={<Broom size={24} />} />
        <IconButton
          onClick={() => exportCapturedEvents(url)}
          icon={<Export size={24} />}
        />
      </div>
    </>
  );
}
