import { Pause, Play } from '@phosphor-icons/react';
import IconButton from './IconButton';

interface PlayButtonProps {
  isPlaying: boolean;
}

export default function PlayButton({ isPlaying }: PlayButtonProps) {
  return (
    <IconButton
      icon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    />
  );
}
