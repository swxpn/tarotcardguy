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
      className="group relative w-full aspect-[1086/1810] rounded-[2rem] outline-none"
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
          </div>
        </div>
      </div>
    </button>
  );
}