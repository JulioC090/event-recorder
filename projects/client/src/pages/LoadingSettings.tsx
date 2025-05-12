export default function LoadingSetting() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-text">
      <div className="text-center">
        <div className="mb-4 animate-spin rounded-full h-12 w-12 border-4 border-focus border-t-transparent mx-auto"></div>
        <p className="text-lg font-medium">Loading Settings...</p>
      </div>
    </div>
  );
}
