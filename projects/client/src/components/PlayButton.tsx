import { Pause, Play } from '@phosphor-icons/react';
import { ButtonHTMLAttributes } from 'react';
import IconButton from './IconButton';

interface PlayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isPlaying: boolean;
}

export default function PlayButton({ isPlaying, ...rest }: PlayButtonProps) {
  return (
    <IconButton
      icon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      {...rest}
    />
  );
}
