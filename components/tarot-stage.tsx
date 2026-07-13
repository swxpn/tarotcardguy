"use client";

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Copy, Sparkles, WandSparkles } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import type { ReadingRecord } from '@/lib/readings';
import {
  canDrawToday,
  createReadingCards,
  createReadingRecord,
  getRemainingDailyReads,
  getTodaysReadingCount,
} from '@/lib/readings';
import type { DrawnTarotCard } from '@/lib/tarot/engine';
import { TarotCardFace } from '@/components/tarot-card-face';
import { Throbber } from '@/components/throbber';

type TarotStageProps = {
  userId: string;
  initialReadingCount: number;
};

type ReadingResult = {
  reading: ReadingRecord;
  cards: DrawnTarotCard[];
};

function getNextUtcMidnight() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
}

function formatCountdown(targetTime: Date) {
  const remainingMs = Math.max(targetTime.getTime() - Date.now(), 0);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

export function TarotStage({ userId, initialReadingCount }: TarotStageProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [readingCount, setReadingCount] = useState(initialReadingCount);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCards, setDrawnCards] = useState<DrawnTarotCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [countdown, setCountdown] = useState(() => formatCountdown(getNextUtcMidnight()));

  const remaining = getRemainingDailyReads(readingCount);
  const canDraw = canDrawToday(readingCount);

  useEffect(() => {
    if (canDraw) return;

    const updateCountdown = () => setCountdown(formatCountdown(getNextUtcMidnight()));

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, [canDraw]);

  const handleDraw = async () => {
    setMessage(null);
    setResult(null);

    const latestCount = await getTodaysReadingCount(supabase, userId);
    setReadingCount(latestCount);

    if (!canDrawToday(latestCount)) {
      setMessage('The universe requires rest. Return tomorrow for further guidance.');
      return;
    }

    setIsDrawing(true);
    const cards = createReadingCards();
    setDrawnCards(cards);
    setRevealedCards([]);
    setMessage('The cards are gathering. Tap each one to reveal its thread.');

    const reading = await createReadingRecord(supabase, userId, cards);
    setReadingCount(latestCount + 1);
    setResult({ reading, cards });
    setIsDrawing(false);
  };

  const handleRevealCard = (cardId: string) => {
    setRevealedCards((current) => (current.includes(cardId) ? current : [...current, cardId]));
  };

  const shareReading = async () => {
    if (!result?.reading) return;

    const url = `${window.location.origin}/reading/${result.reading.id}`;
    await navigator.clipboard.writeText(url);
    setMessage('Share link copied to your clipboard.');
  };

  return (
    <section className="grid gap-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur lg:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">
              {canDraw ? 'The veil is open.' : 'The veil is closed.'}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              {canDraw
                ? 'Draw a three-card spread for Past, Present, and Future. Cards flip one by one when you tap them.'
                : `Next draw activates in ${countdown}.`}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-50">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-200/80">Today</p>
            <p className="mt-1 font-semibold">{remaining}/4 readings remaining</p>
            {!canDraw ? <p className="mt-1 text-xs uppercase tracking-[0.25em] text-rose-100/80">Next activation in {countdown}</p> : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDraw}
            disabled={!canDraw || isDrawing}
            className="inline-flex items-center gap-2 rounded-full border border-rose-300/40 bg-rose-200 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDrawing ? <Throbber /> : <WandSparkles className="h-4 w-4" />}
            {isDrawing ? 'Shuffling the stars...' : 'Draw Cards'}
          </button>

          {result ? (
            <button
              type="button"
              onClick={shareReading}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              <Copy className="h-4 w-4" />
              Share Reading
            </button>
          ) : null}
        </div>

        {message ? (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200">
            {canDraw ? <Sparkles className="h-4 w-4 text-rose-200" /> : <AlertTriangle className="h-4 w-4 text-rose-300" />}
            <span>{message}</span>
          </div>
        ) : null}

        <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          <AnimatePresence>
            {drawnCards.map((card, index) => {
              const isFaceUp = revealedCards.includes(card.id);

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  <TarotCardFace card={card} isFaceUp={isFaceUp} onClick={() => handleRevealCard(card.id)} />
                  {isFaceUp ? (
                    <div className="mt-3 space-y-1 text-center text-slate-300">
                      <p className="text-xs uppercase tracking-[0.35em] text-rose-100/80">{card.position}</p>
                      <p className="text-sm leading-6 text-slate-300">{card.description}</p>
                    </div>
                  ) : null}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {result ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-rose-200/80">Reading Interpretation</p>
                <h2 className="mt-2 text-2xl font-semibold">Past, Present, Future</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {result.cards.map((card) => {
                const isRevealed = revealedCards.includes(card.id);

                return (
                  <div key={card.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-rose-200/80">{card.position}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-50">
                      {isRevealed ? card.name : 'Reveal this card'}
                    </h3>
                    {isRevealed ? (
                      <div className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                        <p>{card.description}</p>
                        <p>{card.uprightMeaning}</p>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        The interpretation appears after you flip this card.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}