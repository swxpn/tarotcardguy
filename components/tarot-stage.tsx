"use client";

import { useMemo, useState } from 'react';
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
  getRecentReadings
} from '@/lib/readings';
import type { DrawnTarotCard } from '@/lib/tarot/engine';
import { TarotCardFace } from '@/components/tarot-card-face';
import { ReadingHistory } from '@/components/reading-history';

type TarotStageProps = {
  userId: string;
  initialReadingCount: number;
  initialReadings: ReadingRecord[];
};

type ReadingResult = {
  reading: ReadingRecord;
  cards: DrawnTarotCard[];
};

export function TarotStage({ userId, initialReadingCount, initialReadings }: TarotStageProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [readingCount, setReadingCount] = useState(initialReadingCount);
  const [readings, setReadings] = useState(initialReadings);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCards, setDrawnCards] = useState<DrawnTarotCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ReadingResult | null>(null);

  const remaining = getRemainingDailyReads(readingCount);
  const canDraw = canDrawToday(readingCount);

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
    setReadings((current) => [reading, ...current].slice(0, 5));
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
    <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">Tarot Engine</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">The veil is open.</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Draw a three-card spread for Past, Present, and Future. Cards flip one by one when you tap them.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-50">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Today</p>
            <p className="mt-1 font-semibold">{remaining}/4 readings remaining</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDraw}
            disabled={!canDraw || isDrawing}
            className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-200 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <WandSparkles className="h-4 w-4" />
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
            {canDraw ? <Sparkles className="h-4 w-4 text-amber-200" /> : <AlertTriangle className="h-4 w-4 text-amber-300" />}
            <span>{message}</span>
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
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
                  <div className="mt-3 text-center text-sm uppercase tracking-[0.35em] text-amber-100/80">
                    {card.position}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {result ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">Reading Interpretation</p>
                <h2 className="mt-2 text-2xl font-semibold">Past, Present, Future</h2>
              </div>
              <p className="text-sm text-slate-400">Tap a card to reveal its meaning.</p>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {result.cards.map((card) => (
                <div key={card.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">{card.position}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-50">{card.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{card.uprightMeaning}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">Daily Boundaries</p>
          <h2 className="mt-2 text-2xl font-semibold">Keep the channel clear</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            You may draw up to four readings per UTC day. Once the limit is reached, the draw button stays
            disabled until the next cycle begins.
          </p>
        </div>

        <ReadingHistory readings={readings} />
      </div>
    </section>
  );
}