"use client";

import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Throbber } from '@/components/throbber';

export function CopyReadingButton() {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    setIsCopying(true);
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setIsCopying(false);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full border border-rose-300/40 bg-rose-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-rose-100"
    >
      {isCopying ? <Throbber /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied' : isCopying ? 'Copying' : 'Copy'}
    </button>
  );
}