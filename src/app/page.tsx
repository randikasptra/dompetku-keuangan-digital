import { Loader2 } from 'lucide-react';

export default function Home() {
  // Redirect logic is handled by Proxy.
  // This loading state is only shown briefly while the redirect happens.
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Memuat aplikasi...</p>
      </div>
    </div>
  );
}
