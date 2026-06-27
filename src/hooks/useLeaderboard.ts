import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { getFirebaseDatabase, isFirebaseConfigured } from '../utils/firebase';
import type { LeaderboardEntry } from '../types';

const COLLECTION_NAME = 'leaderboard';

function playerId(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'innergy-player';
}

function topTen(entries: LeaderboardEntry[]) {
  return [...entries].sort((a, b) => b.score - a.score).slice(0, 10);
}

export function isSharedLeaderboardConfigured() {
  return isFirebaseConfigured();
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const database = getFirebaseDatabase();
  if (!database) return [];

  const snapshot = await getDocs(query(collection(database, COLLECTION_NAME), orderBy('score', 'desc'), limit(10)));
  return snapshot.docs.map((entry) => {
    const data = entry.data();
    return {
      id: entry.id,
      name: String(data.name || 'Player'),
      score: Number(data.score || 0),
      title: String(data.title || ''),
      date: String(data.date || '')
    };
  });
}

export async function saveLeaderboardScore(entry: LeaderboardEntry) {
  const database = getFirebaseDatabase();
  if (!database) return [];

  const entryRef = doc(database, COLLECTION_NAME, playerId(entry.name));
  await runTransaction(database, async (transaction) => {
    const current = await transaction.get(entryRef);
    const currentScore = Number(current.data()?.score || 0);
    if (!current.exists() || entry.score > currentScore) {
      transaction.set(entryRef, {
        name: entry.name,
        score: entry.score,
        title: entry.title,
        date: entry.date,
        updatedAt: serverTimestamp()
      });
    }
  });

  return topTen(await fetchLeaderboard());
}
