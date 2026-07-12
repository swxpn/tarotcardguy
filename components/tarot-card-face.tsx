import type { DrawnTarotCard } from '@/lib/tarot/engine';
import { TarotCardArt } from '@/components/tarot-card-art';

type TarotCardFaceProps = {
  card: DrawnTarotCard;
  isFaceUp: boolean;
  onClick?: () => void;
};

export function TarotCardFace({ card, isFaceUp, onClick }: TarotCardFaceProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-[340px] w-full rounded-[2rem] outline-none"
      aria-label={`Flip ${card.position} card`}
    >
      <div className="relative h-full w-full [perspective:1200px]">
        <div
          className="absolute inset-0 rounded-[2rem] transition-transform duration-700 [transform-style:preserve-3d]"
          style={{ transform: isFaceUp ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <TarotCardArt card={card} variant="back" />
          </div>

          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <TarotCardArt card={card} variant="front" />
            <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-slate-900/10 bg-white/55 p-4 text-slate-700 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-800">Card Notes</p>
              <p className="mt-2 text-sm leading-6">{card.uprightMeaning}</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}