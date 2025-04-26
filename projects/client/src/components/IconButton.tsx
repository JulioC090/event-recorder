import { Slot } from '@radix-ui/react-slot';
import { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

export default function IconButton({ icon, ...rest }: IconButtonProps) {
  return (
    <button
      className="p-4 bg-foreground rounded outline-none border-2 border-border hover:bg-hover active:bg-hover-1 ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-focus"
      type="button"
      {...rest}
    >
      <Slot className="text-text">{icon}</Slot>
    </button>
  );
}
