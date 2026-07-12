import type { SupabaseClient } from '@supabase/supabase-js';
import { drawTarotSpread, getUtcStartOfDay } from '@/lib/tarot/engine';
import type { DrawnTarotCard } from '@/lib/tarot/engine';
import { TAROT_DECK } from '@/lib/tarot/deck';

export type ReadingRecord = {
  id: string;
  user_id: string;
  cards: string[];
  created_at: string;
};

export async function getTodaysReadingCount(supabase: SupabaseClient, userId: string) {
  const startOfDay = getUtcStartOfDay().toISOString();

  const { count, error } = await supabase
    .from('readings')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfDay);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export function getRemainingDailyReads(readingCount: number) {
  return Math.max(4 - readingCount, 0);
}

export function canDrawToday(readingCount: number) {
  return readingCount < 4;
}

export function createReadingCards() {
  return drawTarotSpread().map((card, index) => ({
    ...card,
    order: index
  }));
}

export async function createReadingRecord(
  supabase: SupabaseClient,
  userId: string,
  cards: DrawnTarotCard[]
) {
  const { data, error } = await supabase
    .from('readings')
    .insert({
      user_id: userId,
      cards: cards.map((card) => card.id)
    })
    .select('id, user_id, cards, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data as ReadingRecord;
}

export async function getRecentReadings(supabase: SupabaseClient, userId: string, limit = 5) {
  const { data, error } = await supabase
    .from('readings')
    .select('id, user_id, cards, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []) as ReadingRecord[];
}

export async function getLatestReading(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('readings')
    .select('id, user_id, cards, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as ReadingRecord | null;
}

export async function getReadingById(supabase: SupabaseClient, readingId: string) {
  const { data, error } = await supabase
    .rpc('get_reading_by_id', { reading_id: readingId })
    .single();

  if (error) {
    throw error;
  }

  return data as ReadingRecord;
}

export function getCardById(cardId: string) {
  return TAROT_DECK.find((card) => card.id === cardId) ?? null;
}
