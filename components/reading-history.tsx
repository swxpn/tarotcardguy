import Link from 'next/link';
import type { ReadingRecord } from '@/lib/readings';

type ReadingHistoryProps = {
  readings: ReadingRecord[];
};

export function ReadingHistory({ readings }: ReadingHistoryProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">Reading History</p>
        <h2 className="mt-2 text-2xl font-semibold">Your past draws</h2>
      </div>

      <div className="mt-5 space-y-3">
        {readings.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-5 text-sm text-slate-300">
            No readings yet. Draw your first spread to begin.
          </p>
        ) : (
          readings.map((reading) => (
            <Link
              key={reading.id}
              href={`/reading/${reading.id}`}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-4 transition hover:border-amber-300/30 hover:bg-white/5"
            >
              <div>
                <p className="text-sm font-medium text-slate-100">Reading {reading.id.slice(0, 8)}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                  {new Date(reading.created_at).toLocaleString()}
                </p>
              </div>
              <span className="text-sm text-amber-200/90">View spread</span>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}