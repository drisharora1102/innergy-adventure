export type Screen = 'start' | 'playing' | 'results';

export type ItemKind = 'healthy' | 'bad' | 'power';

export type PowerKind = 'double' | 'shield' | 'freeze' | 'magnet' | 'rainbow';

export type FallingItem = {
  id: string;
  kind: ItemKind;
  key: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  power?: PowerKind;
};

export type CatchStats = Record<string, number>;

export type GameResult = {
  score: number;
  baseScore: number;
  lifeBonus: number;
  lives: number;
  healthyCaught: CatchStats;
  badCaught: CatchStats;
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  title: string;
  date: string;
};
