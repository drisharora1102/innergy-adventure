import { motion } from 'framer-motion';
import { Brain, Droplets, HeartPulse, Leaf, Music2, Play, Sun, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { InnergyLogo } from './InnergyLogo';

type Props = {
  muted: boolean;
  onToggleMute: () => void;
  onStart: (name: string) => void;
};

const floaters = [Brain, Droplets, Sun, HeartPulse, Leaf, Music2];

export function StartScreen({ muted, onToggleMute, onStart }: Props) {
  const [name, setName] = useState('');

  function submitName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onStart(name.trim() || 'Innergy Player');
  }

  return (
    <main className="screen start-screen">
      <div className="bubble-field" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
      </div>
      <div className="floating-icons" aria-hidden="true">
        {floaters.map((Icon, index) => (
          <motion.span
            key={Icon.displayName || index}
            animate={{ y: [0, -18, 0], rotate: [0, index % 2 ? -8 : 8, 0] }}
            transition={{ duration: 3 + index * 0.22, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon aria-hidden="true" />
          </motion.span>
        ))}
      </div>

      <form className="start-panel" onSubmit={submitName}>
        <button className="icon-button top-action" type="button" onClick={onToggleMute} aria-label={muted ? 'Turn sound on' : 'Mute sound'}>
          {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>
        <div className="start-intro">
          <InnergyLogo glowing />
          <p className="eyebrow">Innergy Wellness Game</p>
          <h1>Innergy Adventure</h1>
          <p className="hero-copy">Catch healthy habits. Avoid stress. Build your wellness score.</p>
        </div>
        <div className="start-actions">
          <label className="name-entry">
            <span>Enter your name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="First name"
              maxLength={18}
              autoComplete="given-name"
              aria-label="Enter your name"
            />
          </label>
          <button className="primary-button play-button" type="submit">
            <Play size={28} fill="currentColor" />
            Play
          </button>
        </div>
      </form>
    </main>
  );
}
