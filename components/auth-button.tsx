"use client";

import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

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
      className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300/40 bg-amber-200 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      Sign in with Google to Reveal Your Fate
    </button>
  );
}