'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="btn-primary mt-6">
          Try again
        </button>
      </div>
    </div>
  );
}