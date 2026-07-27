'use client';

import { useActionState } from 'react';
import { CheckCircle2, Loader2, Save } from 'lucide-react';

import {
  type SettingsActionState,
  updateSettingsAction,
} from '@/app/actions/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialState: SettingsActionState = { success: false };

export function SettingsForm({
  name,
  currency,
  timezone,
}: {
  name: string;
  currency: string;
  timezone: string;
}) {
  const [state, action, pending] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama lengkap</Label>
        <Input id="name" name="name" defaultValue={name} required />
        {state.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="currency">Mata uang</Label>
          <select
            id="currency"
            name="currency"
            defaultValue={currency}
            className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="IDR">Rupiah (IDR)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Zona waktu</Label>
          <select
            id="timezone"
            name="timezone"
            defaultValue={timezone}
            className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Asia/Jakarta">WIB — Jakarta</option>
            <option value="Asia/Makassar">WITA — Makassar</option>
            <option value="Asia/Jayapura">WIT — Jayapura</option>
          </select>
        </div>
      </div>

      {state.message && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
            state.success
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {state.success && <CheckCircle2 className="h-4 w-4" />}
          {state.message}
        </div>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Simpan perubahan
      </Button>
    </form>
  );
}
