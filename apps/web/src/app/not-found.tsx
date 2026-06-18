import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h1 className="font-display text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found</p>
        <Link href="/" className="btn-primary mt-6 inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
}