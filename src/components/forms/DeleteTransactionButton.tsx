'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';

import { deleteTransactionAction } from '@/app/actions/transactions';

export function DeleteTransactionButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteTransactionAction(id);
      setIsOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-600"
        aria-label="Hapus transaksi"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-slate-950/35 p-4 backdrop-blur-[2px] sm:items-center sm:justify-center"
          role="presentation"
          onMouseDown={() => !isPending && setIsOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-50"
                aria-label="Tutup dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h2 id="delete-dialog-title" className="mt-4 text-lg font-bold">
              Hapus transaksi?
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              Transaksi ini akan dihapus permanen dari riwayat dan laporan kamu.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="h-11 rounded-xl border border-input bg-background text-sm font-semibold transition hover:bg-muted disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-red-500 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hapus transaksi'}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
