import { Trophy } from 'lucide-react';
import type { LeaderboardEntry } from '../types';

type Props = {
  entries: LeaderboardEntry[];
  message?: string;
};

export function Leaderboard({ entries, message }: Props) {
  return (
    <section className="leaderboard">
      <h2>
        <Trophy size={21} />
        Top 10 Scorers
      </h2>
      {entries.length === 0 ? (
        <p className="muted-copy">{message || 'Your top 10 scores will appear here.'}</p>
      ) : (
        <ol>
          {entries.map((entry) => (
            <li key={entry.id}>
              <span>{entry.name}</span>
              <strong>{entry.score}</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
