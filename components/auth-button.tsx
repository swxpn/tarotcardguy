"use client";

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { Throbber } from '@/components/throbber';

export function AuthButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-300/40 bg-rose-200 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? <Throbber /> : null}
      Sign in with Google to Reveal Your Fate
    </button>
  );
}