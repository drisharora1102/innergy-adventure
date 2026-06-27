import { motion } from 'framer-motion';
import { QrCode, RefreshCw } from 'lucide-react';
import { getScoreMessage, getWellnessLevel, getWellnessTitle } from '../utils/scoring';
import { InnergyLogo } from './InnergyLogo';
import type { GameResult } from '../types';

type Props = {
  result: GameResult;
  onPlayAgain: () => void;
};

export function ResultScreen({ result, onPlayAgain }: Props) {
  const title = getWellnessTitle(result);
  const level = getWellnessLevel(result.score);
  const message = getScoreMessage(result.score);

  return (
    <main className="screen result-screen">
      <div className="bubble-field" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
      </div>
      {result.score > 1500 && <Confetti />}
      <section className="result-grid">
        <article className="result-main">
          <InnergyLogo glowing />
          <p className="eyebrow">{message}</p>
          <h1>Your Wellness Score</h1>
          <motion.div
            className="score-number"
            initial={{ scale: 0.72, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12 }}
          >
            {result.score}
          </motion.div>
          <div className="title-badge">{title}</div>
          <p className="level-line">{level}</p>
        </article>
        <aside className="journey-panel">
          <div className="qr-card">
            <QrCode size={98} />
            <div className="qr-grid" aria-hidden="true">
              {Array.from({ length: 49 }, (_, index) => (
                <i key={index} className={index % 3 === 0 || index % 7 === 0 ? 'on' : ''} />
              ))}
            </div>
          </div>
          <h2>Ready to continue your wellness journey?</h2>
          <p>Download Innergy</p>
          <button className="primary-button" onClick={onPlayAgain}>
            <RefreshCw size={21} />
            Next Player
          </button>
        </aside>
      </section>
    </main>
  );
}

function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 90 }, (_, index) => (
        <i
          key={index}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.8}s`,
            animationDuration: `${2.2 + Math.random() * 2.4}s`,
            background: ['#D99A2B', '#71D99E', '#38BDF8', '#F472B6', '#008C96'][index % 5]
          }}
        />
      ))}
    </div>
  );
}
