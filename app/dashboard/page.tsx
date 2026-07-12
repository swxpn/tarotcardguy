import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getRecentReadings, getTodaysReadingCount } from '@/lib/readings';
import { TarotStage } from '@/components/tarot-stage';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/');
  }

  const [readingCount, readings] = await Promise.all([
    getTodaysReadingCount(supabase, data.user.id),
    getRecentReadings(supabase, data.user.id)
  ]);

  return (
    <TarotStage userId={data.user.id} initialReadingCount={readingCount} initialReadings={readings} />
  );
}