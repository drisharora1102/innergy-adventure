import type { PowerKind } from './types';

export const GAME_SECONDS = 30;
export const STARTING_LIVES = 5;
export const HEALTHY_POINTS = 100;
export const BAD_POINTS = -100;
export const LIFE_BONUS = 300;
export const LEADERBOARD_KEY = 'innergy-adventure-leaderboard';

export const HEALTHY_ITEMS = [
  { key: 'happy', label: 'Happiness', icon: '\u{1F60A}', recommendation: 'Keep mood check-ins glowing inside Innergy.' },
  { key: 'meditation', label: 'Meditation', icon: '\u{1F9D8}', recommendation: 'Explore guided meditations for a calmer reset.' },
  { key: 'exercise', label: 'Exercise', icon: '\u2764\uFE0F', recommendation: "Try today's workout and keep your energy moving." },
  { key: 'recipes', label: 'Healthy Recipes', icon: '\u{1F957}', recommendation: 'Open nutrition recipes for balanced, easy meals.' },
  { key: 'sunshine', label: 'Sunshine', icon: '\u{1F31E}', recommendation: 'Build a daily light and fresh air habit.' },
  { key: 'sleep', label: 'Good Sleep', icon: '\u{1F634}', recommendation: 'Improve sleep using bedtime routines.' },
  { key: 'darshan', label: 'Darshan', icon: '\u{1F64F}', recommendation: 'Make space for a peaceful spiritual connection.' },
  { key: 'reading', label: 'Reading', icon: '\u{1F4D6}', recommendation: 'Use reflection time to feed your mind gently.' },
  { key: 'nature', label: 'Nature', icon: '\u{1F333}', recommendation: 'Take a mindful nature break and log how you feel.' },
  { key: 'music', label: 'Relaxing Music', icon: '\u{1F3B5}', recommendation: 'Unwind with calming audio in your evening routine.' },
  { key: 'family', label: 'Family Fun', icon: '\u{1F46A}', recommendation: 'Enjoy meaningful time and laughter with family.' },
  { key: 'friendship', label: 'Friendship', icon: '\u{1F91D}', recommendation: 'Connect with a friend who helps you feel supported.' },
  { key: 'volunteering', label: 'Volunteering', icon: '\u{1F64C}', recommendation: 'Share your time and energy with your community.' }
];

export const BAD_ITEMS = [
  { key: 'junk', label: 'Junk Food', icon: '\u{1F35F}', recommendation: 'Healthy Nutrition Plans' },
  { key: 'scrolling', label: 'Doom Scrolling', icon: '\u{1F4F1}', recommendation: 'Digital Detox Challenge' },
  { key: 'stress', label: 'Stress', icon: '\u{1F62B}', recommendation: 'Stress Relief Meditation' },
  { key: 'anger', label: 'Anger', icon: '\u{1F621}', recommendation: 'Calming reflection prompts' },
  { key: 'burnout', label: 'Burnout', icon: '\u{1F4A5}', recommendation: 'Rest and recovery check-in' },
  { key: 'tv', label: 'Binge Watching', icon: '\u{1F4FA}', recommendation: 'Mindful screen-time goals' },
  { key: 'lazy', label: 'Laziness', icon: '\u{1F6CC}', recommendation: 'Gentle movement challenge' }
];

export const POWER_UPS: Array<{ key: PowerKind; label: string; icon: string; duration: number }> = [
  { key: 'double', label: 'Double Points', icon: '\u2B50', duration: 10 },
  { key: 'shield', label: 'Shield', icon: '\u{1F6E1}\uFE0F', duration: 0 },
  { key: 'freeze', label: 'Freeze Time', icon: '\u23F0', duration: 2 },
  { key: 'magnet', label: 'Magnet', icon: '\u{1F9F2}', duration: 6 },
  { key: 'rainbow', label: 'Rainbow Mode', icon: '\u2728', duration: 8 }
];
