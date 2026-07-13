"use client";

import { useState } from 'react';
import { Copy } from 'lucide-react';

export function CopyReadingButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full border border-rose-300/40 bg-rose-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-rose-100"
    >
      <Copy className="h-4 w-4" />
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}