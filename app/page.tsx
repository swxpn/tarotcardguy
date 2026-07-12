import Link from 'next/link';
import { ArrowRight, Stars } from 'lucide-react';
import { AuthButton } from '@/components/auth-button';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    return (
      <main className="min-h-screen px-6 py-16 text-slate-100">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur">
            <p className="text-sm uppercase tracking-[0.4em] text-amber-200/80">Digital Tarot</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
              Your fate is waiting inside the dashboard.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
              You are signed in and ready to begin a reading.
            </p>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-200 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-100"
            >
              Enter the dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur">
          <div className="flex items-center gap-2 text-amber-200/80">
            <Stars className="h-5 w-5" />
            <p className="text-sm uppercase tracking-[0.4em]">Digital Tarot</p>
          </div>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
            A mystical tarot experience, built for modern readers.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
            Sign in with Google to unlock the protected dashboard and begin drawing cards.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AuthButton />
            <span className="text-sm text-slate-400">Your sessions are secured through Supabase Auth.</span>
          </div>
        </section>
      </div>
    </main>
  );
}