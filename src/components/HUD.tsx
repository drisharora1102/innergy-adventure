import { Heart, Shield, Snowflake, Star, Timer, Volume2, VolumeX, Zap } from 'lucide-react';
import { STARTING_LIVES } from '../constants';
import type { PowerKind } from '../types';

type Props = {
  score: number;
  timeLeft: number;
  lives: number;
  muted: boolean;
  powerTimers: Partial<Record<PowerKind, number>>;
  shield: number;
  onToggleMute: () => void;
};

export function HUD({ score, timeLeft, lives, muted, powerTimers, shield, onToggleMute }: Props) {
  const active = [
    powerTimers.double ? { icon: <Star size={16} />, label: `${Math.ceil(powerTimers.double)}s` } : null,
    powerTimers.rainbow ? { icon: <Zap size={16} />, label: `${Math.ceil(powerTimers.rainbow)}s` } : null,
    powerTimers.freeze ? { icon: <Snowflake size={16} />, label: `${Math.ceil(powerTimers.freeze)}s` } : null,
    powerTimers.magnet ? { icon: <span>🧲</span>, label: `${Math.ceil(powerTimers.magnet)}s` } : null,
    shield ? { icon: <Shield size={16} />, label: `${shield}` } : null
  ].filter(Boolean);

  return (
    <header className="hud">
      <div className="hud-pill score-pill">
        <strong>Score</strong>
        <span>{score}</span>
      </div>
      <div className="timer-pill">
        <Timer size={24} />
        <strong>{timeLeft}</strong>
      </div>
      <div className="hud-right">
        <div className="life-row" aria-label={`${lives} lives remaining`}>
          {Array.from({ length: STARTING_LIVES }, (_, index) => (
            <Heart key={index} size={24} fill={index < lives ? 'currentColor' : 'none'} />
          ))}
        </div>
        <button className="icon-button" onClick={onToggleMute} aria-label={muted ? 'Turn sound on' : 'Mute sound'}>
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      {active.length > 0 && (
        <div className="power-strip">
          {active.map((item, index) => item && (
            <span key={index}>
              {item.icon}
              {item.label}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
