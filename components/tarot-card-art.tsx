import Image from 'next/image';
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
  const imageFolder = card.suit ?? 'Trumps';
  const imagePath = `/tarot-cards/${imageFolder}/${encodeURIComponent(card.name)}.png`;

  if (variant === 'back') {
    return (
      <div className="relative h-full overflow-hidden border border-amber-200/20 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.22),transparent_45%),linear-gradient(145deg,#0f172a_0%,#020617_100%)] shadow-[0_0_40px_rgba(251,191,36,0.08)]">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(251,191,36,0.22) 1px, transparent 0)', backgroundSize: '18px 18px' }} />
        <div className="absolute inset-0 border border-amber-100/10" />
      </div>
    );
  }

  return (
    <div className={`relative h-full overflow-hidden border ${variant === 'public' ? 'border-white/10 bg-white/5 backdrop-blur' : 'border-white/10 bg-gradient-to-br from-amber-100 via-amber-50 to-orange-200 text-slate-950 shadow-[0_0_35px_rgba(255,255,255,0.18)]'}`}>
      <div className="absolute inset-0 opacity-100" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} blur-2xl`} style={{ opacity: glowOpacity }} />
      <div className="relative h-full w-full p-3 sm:p-4">
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={imagePath}
            alt={card.name}
            fill
            priority={variant === 'public'}
            sizes={compact ? '280px' : '360px'}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}