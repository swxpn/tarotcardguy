import type { TarotCard } from '@/lib/tarot/deck';

type TarotCardArtProps = {
  card: Pick<TarotCard, 'name' | 'arcana' | 'suit' | 'imagePlaceholder'>;
  variant: 'back' | 'front' | 'public';
  compact?: boolean;
};

const suitAccent: Record<string, string> = {
  Wands: 'from-amber-300 via-amber-200 to-orange-300',
  Cups: 'from-sky-300 via-cyan-200 to-blue-300',
  Swords: 'from-slate-300 via-stone-200 to-zinc-300',
  Pentacles: 'from-emerald-300 via-lime-200 to-green-300'
};

export function TarotCardArt({ card, variant, compact = false }: TarotCardArtProps) {
  const accent = card.suit ? suitAccent[card.suit] : 'from-amber-300 via-yellow-200 to-orange-300';
  const glowOpacity = variant === 'public' ? 0.1 : 0.15;

  if (variant === 'back') {
    return (
      <div className="relative h-full overflow-hidden rounded-[2rem] border border-amber-200/20 bg-slate-950 shadow-[0_0_40px_rgba(251,191,36,0.08)]">
        <div className="absolute inset-0 bg-[url('/card-back.png')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-slate-950/10" />
      </div>
    );
  }

  const typographyScale = compact ? 'text-xl' : 'text-2xl';

  return (
    <div className={`relative overflow-hidden rounded-[2rem] border p-6 ${variant === 'public' ? 'border-white/10 bg-white/5 backdrop-blur' : 'border-white/10 bg-gradient-to-br from-amber-100 via-amber-50 to-orange-200 text-slate-950 shadow-[0_0_35px_rgba(255,255,255,0.18)]'}`}>
      <div className="absolute inset-0 opacity-100" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} blur-2xl`} style={{ opacity: glowOpacity }} />
      <div className="relative flex h-full flex-col gap-4">
        <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-current/70">
          <span>{card.arcana}</span>
          <span>{card.suit ?? 'Oracle'}</span>
        </div>

        <div className="rounded-[1.5rem] border border-current/10 bg-current/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-current/60">{card.imagePlaceholder}</span>
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-[0.65rem] font-semibold text-slate-950`}>
              {card.suit ? card.suit.charAt(0) : 'M'}
            </span>
          </div>

          <div className={`mt-3 ${typographyScale} font-semibold leading-snug ${variant === 'public' ? 'text-slate-100' : 'text-slate-950'}`}>
            {card.name}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className={`h-px flex-1 bg-gradient-to-r ${accent}`} />
            <span className={`rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] ${variant === 'public' ? 'border-white/10 text-slate-300' : 'border-slate-900/10 text-slate-700'}`}>
              {card.suit ?? card.arcana}
            </span>
            <span className={`h-px flex-1 bg-gradient-to-r ${accent}`} />
          </div>
        </div>

        <div className={`rounded-[1.5rem] border p-4 ${variant === 'public' ? 'border-white/10 bg-black/20 text-slate-200' : 'border-slate-900/10 bg-white/55 text-slate-700'}`}>
          <p className="text-xs uppercase tracking-[0.35em] text-amber-800/80">Card</p>
          <p className="mt-2 text-sm leading-7">{variant === 'public' ? 'This card was revealed for a public reading.' : 'Reveal this card to uncover its role in the spread.'}</p>
        </div>
      </div>
    </div>
  );
}