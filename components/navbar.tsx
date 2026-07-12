import Link from 'next/link';
import { UserCircle2 } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/logout-button';

export async function Navbar() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header className="border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200">
          Tarot Card Guy
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 md:flex">
                <UserCircle2 className="h-4 w-4 text-amber-200" />
                <span>{user.email}</span>
              </div>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/"
              className="rounded-full border border-amber-300/40 bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-100"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}