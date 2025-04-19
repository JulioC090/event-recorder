import { MagnifyingGlass } from '@phosphor-icons/react';
import { useState } from 'react';

interface LinkInputProps {
  onSubmit(url: string): void;
}

export default function LinkInput({ onSubmit }: LinkInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-128">
      <div className="flex items-center gap-3 h-12 py-4 px-3 rounded bg-foreground focus-within:ring-2 ring-focus">
        <MagnifyingGlass size={24} className="text-slate-100" />
        <input
          type="text"
          placeholder="http://localhost:5173/"
          className="w-full outline-none text-text placeholder:text-placeholder"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </form>
  );
}
