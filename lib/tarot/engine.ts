import { TAROT_DECK, type TarotCard } from '@/lib/tarot/deck';

export type TarotSpreadPosition = 'Past' | 'Present' | 'Future';

export type DrawnTarotCard = TarotCard & {
  position: TarotSpreadPosition;
};

export function drawTarotSpread(): DrawnTarotCard[] {
  const deck = [...TAROT_DECK];
  const spreadPositions: TarotSpreadPosition[] = ['Past', 'Present', 'Future'];
  const drawnCards: DrawnTarotCard[] = [];

  for (const position of spreadPositions) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const [selectedCard] = deck.splice(randomIndex, 1);

    drawnCards.push({
      ...selectedCard,
      position
    });
  }

  return drawnCards;
}

export function getUtcStartOfDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
