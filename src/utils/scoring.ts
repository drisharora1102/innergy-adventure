import { BAD_ITEMS, HEALTHY_ITEMS } from '../constants';
import type { CatchStats, GameResult } from '../types';

function topKey(stats: CatchStats) {
  return Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0];
}

export function getScoreMessage(score: number) {
  if (score > 2000) return '🌟 Amazing!';
  if (score >= 1200) return '😊 Great Job!';
  return '🌱 Keep Practicing!';
}

export function getWellnessLevel(score: number) {
  if (score < 1000) return 'Needs Balance';
  if (score < 1800) return 'Growing Strong';
  if (score < 2500) return 'Wellness Champion';
  return 'Innergy Luminary';
}

export function getWellnessTitle(result: GameResult) {
  const key = topKey(result.healthyCaught);
  if (key === 'meditation') return '🧘 Mindful Master';
  if (key === 'water') return '💧 Hydration Hero';
  if (key === 'exercise') return '❤️ Fitness Fanatic';
  if (key === 'nature' || key === 'sunshine') return '🌱 Nature Nurturer';
  return '🌈 Balanced Soul';
}

export function getRecommendations(result: GameResult) {
  const healthyTop = topKey(result.healthyCaught);
  const badTop = topKey(result.badCaught);
  const recs = new Set<string>();
  const healthy = HEALTHY_ITEMS.find((item) => item.key === healthyTop);
  const bad = BAD_ITEMS.find((item) => item.key === badTop);

  if (healthy) recs.add(healthy.recommendation);
  if (bad) recs.add(bad.recommendation);
  if (!healthy && !bad) recs.add('Start with a mood check-in and choose one tiny wellness habit.');
  recs.add('Scan to start your real wellness journey with Innergy.');

  return Array.from(recs).slice(0, 3);
}
