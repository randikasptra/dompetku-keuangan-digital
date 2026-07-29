import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
      <Image
        src="/img/logo1.png"
        alt="Dompetku"
        width={56}
        height={56}
        className="h-14 w-14 object-contain"
        priority
      />
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        Memuat Dompetku...
      </div>
    </div>
  );
}
