import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCardById, getReadingById } from '@/lib/readings';
import { TarotCardArt } from '@/components/tarot-card-art';

type ReadingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReadingPage({ params }: ReadingPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  let reading;

  try {
    reading = await getReadingById(supabase, id);
  } catch {
    notFound();
  }

  if (!reading) {
    notFound();
  }

  const cards = reading.cards
    .map((cardId, index) => {
      const card = getCardById(cardId);

      if (!card) {
        return null;
      }

      return {
        ...card,
        position: ['Past', 'Present', 'Future'][index]
      };
    })
    .filter(Boolean);

  return (
    <main className="min-h-screen px-6 py-12 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Link
          href="/dashboard"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="flex items-center gap-2 text-amber-200/80">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm uppercase tracking-[0.35em]">Public Reading</p>
          </div>
          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">Your reading is revealed.</h1>
          <p className="mt-4 max-w-2xl text-slate-300">This public link shows the three-card spread as artwork.</p>
          <p className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-400">Shared reading</p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card?.id}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-3 backdrop-blur"
            >
              <div className="aspect-[1086/1810] overflow-hidden rounded-[1.5rem]">
                {card ? <TarotCardArt card={card} variant="public" compact /> : null}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}