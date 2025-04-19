import { useParams } from 'react-router';

export default function Recorder() {
  const { url } = useParams();

  return (
    <>
      <h1>Hello</h1>
      <p>I'm watching {url}</p>
    </>
  );
}
