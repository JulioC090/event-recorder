import { useNavigate } from 'react-router';
import LinkInput from '../components/LinkInput';

export default function Home() {
  const navigate = useNavigate();

  function handleSubmit(url: string) {
    navigate(`/recorder/${encodeURIComponent(url)}`);
  }

  return (
    <div className="relative h-screen w-full flex justify-center items-center flex-col gap-4">
      <h1 className="mb-6 text-2xl font-semibold text-text">
        Insert a link to start recorder
      </h1>
      <LinkInput onSubmit={handleSubmit} />
    </div>
  );
}
