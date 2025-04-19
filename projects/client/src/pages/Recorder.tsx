import { Broom, Export } from '@phosphor-icons/react';
import { useParams } from 'react-router';
import IconButton from '../components/IconButton';
import PlayButton from '../components/PlayButton';

export default function Recorder() {
  const { url } = useParams();

  return (
    <>
      <iframe className="h-screen w-full" src={url}></iframe>
      <div className="flex gap-2 p-2 absolute bottom-4 right-4 bg-background rounded">
        <PlayButton isPlaying={false} />
        <IconButton icon={<Broom size={24} />} />
        <IconButton icon={<Export size={24} />} />
      </div>
    </>
  );
}
