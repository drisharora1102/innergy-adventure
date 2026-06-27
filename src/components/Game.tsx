import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BAD_ITEMS, BAD_POINTS, GAME_SECONDS, HEALTHY_ITEMS, HEALTHY_POINTS, LIFE_BONUS, POWER_UPS, STARTING_LIVES } from '../constants';
import { playTone, unlockAudio } from '../utils/audio';
import { Basket } from './Basket';
import { FallingObject } from './FallingObject';
import { HUD } from './HUD';
import { ResultScreen } from './ResultScreen';
import { StartScreen } from './StartScreen';
import type { CatchStats, FallingItem, GameResult, PowerKind, Screen } from '../types';

type Popup = {
  id: string;
  x: number;
  y: number;
  text: string;
  good: boolean;
};

const BASKET_WIDTH = 150;
const BASKET_HEIGHT = 70;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeStats(): CatchStats {
  return {};
}

function bump(stats: CatchStats, key: string) {
  return { ...stats, [key]: (stats[key] || 0) + 1 };
}

export function Game() {
  const [screen, setScreen] = useState<Screen>('start');
  const [muted, setMuted] = useState(false);
  const [playerName, setPlayerName] = useState('Innergy Player');
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [basketX, setBasketX] = useState(420);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [healthyCaught, setHealthyCaught] = useState<CatchStats>(() => makeStats());
  const [badCaught, setBadCaught] = useState<CatchStats>(() => makeStats());
  const [powerTimers, setPowerTimers] = useState<Partial<Record<PowerKind, number>>>({});
  const [shield, setShield] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const playAreaRef = useRef<HTMLDivElement | null>(null);
  const lastFrame = useRef(0);
  const lastHudUpdate = useRef(0);
  const spawnTimer = useRef(0);
  const elapsedRef = useRef(0);
  const timeLeftRef = useRef(GAME_SECONDS);
  const scoreRef = useRef(0);
  const livesRef = useRef(STARTING_LIVES);
  const basketXRef = useRef(420);
  const basketFrameRef = useRef(0);
  const healthyRef = useRef<CatchStats>({});
  const badRef = useRef<CatchStats>({});
  const powerRef = useRef<Partial<Record<PowerKind, number>>>({});
  const shieldRef = useRef(0);
  const endedRef = useRef(false);

  const basketWidth = Math.min(BASKET_WIDTH, Math.max(116, window.innerWidth * 0.14));

  const endGame = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    const lifeBonus = livesRef.current * LIFE_BONUS;
    const finalScore = Math.max(0, scoreRef.current + lifeBonus);
    playTone('finish', muted);
    setResult({
      score: finalScore,
      baseScore: scoreRef.current,
      lifeBonus,
      lives: livesRef.current,
      healthyCaught: healthyRef.current,
      badCaught: badRef.current
    });
    setScreen('results');
  }, [muted]);

  function resetGame() {
    const width = playAreaRef.current?.clientWidth || window.innerWidth;
    setItems([]);
    setScore(0);
    setLives(STARTING_LIVES);
    setTimeLeft(GAME_SECONDS);
    timeLeftRef.current = GAME_SECONDS;
    setBasketX(width / 2);
    basketXRef.current = width / 2;
    setPopups([]);
    setHealthyCaught({});
    setBadCaught({});
    setPowerTimers({});
    setShield(0);
    setResult(null);
    scoreRef.current = 0;
    livesRef.current = STARTING_LIVES;
    healthyRef.current = {};
    badRef.current = {};
    powerRef.current = {};
    shieldRef.current = 0;
    elapsedRef.current = 0;
    lastHudUpdate.current = 0;
    spawnTimer.current = 0;
    endedRef.current = false;
    lastFrame.current = performance.now();
  }

  function startGame(name = playerName) {
    void unlockAudio();
    setPlayerName(name.trim() || 'Innergy Player');
    resetGame();
    setScreen('playing');
  }

  function toggleSound() {
    if (muted) {
      void unlockAudio().then((unlocked) => {
        if (unlocked) playTone('power', false);
      });
    }
    setMuted((value) => !value);
  }

  const spawnItem = useCallback(() => {
    const area = playAreaRef.current;
    const width = area?.clientWidth || window.innerWidth;
    const phase = elapsedRef.current < 10 ? 0 : elapsedRef.current < 20 ? 1 : 2;
    const badChance = phase === 0 ? 0.24 : phase === 1 ? 0.33 : 0.45;
    const powerChance = 0.08;
    const id = crypto.randomUUID();
    const size = randomBetween(58, 82);

    if (Math.random() < powerChance) {
      const power = POWER_UPS[Math.floor(Math.random() * POWER_UPS.length)];
      return {
        id,
        kind: 'power' as const,
        key: power.key,
        label: power.label,
        icon: power.icon,
        power: power.key,
        x: randomBetween(8, Math.max(12, width - size - 8)),
        y: -size,
        speed: randomBetween(150, 210) + phase * 34,
        size
      };
    }

    const pool = Math.random() < badChance ? BAD_ITEMS : HEALTHY_ITEMS;
    const item = pool[Math.floor(Math.random() * pool.length)];
    return {
      id,
      kind: pool === BAD_ITEMS ? 'bad' as const : 'healthy' as const,
      key: item.key,
      label: item.label,
      icon: item.icon,
      x: randomBetween(8, Math.max(12, width - size - 8)),
      y: -size,
      speed: randomBetween(135, 220) + phase * 55,
      size
    };
  }, []);

  const catchItem = useCallback((item: FallingItem) => {
    const multiplier = powerRef.current.double || powerRef.current.rainbow ? 2 : 1;
    const popup = (text: string, good: boolean) => {
      const next = { id: crypto.randomUUID(), x: item.x + item.size / 2, y: item.y, text, good };
      setPopups((current) => [...current, next]);
      window.setTimeout(() => setPopups((current) => current.filter((entry) => entry.id !== next.id)), 700);
    };

    if (item.kind === 'healthy') {
      const points = HEALTHY_POINTS * multiplier;
      scoreRef.current += points;
      setScore(scoreRef.current);
      healthyRef.current = bump(healthyRef.current, item.key);
      setHealthyCaught(healthyRef.current);
      playTone('catch', muted);
      popup(`+${points}`, true);
      return;
    }

    if (item.kind === 'power' && item.power) {
      playTone('power', muted);
      popup(item.label, true);
      if (item.power === 'shield') {
        shieldRef.current += 1;
        setShield(shieldRef.current);
      } else {
        const duration = POWER_UPS.find((power) => power.key === item.power)?.duration || 5;
        powerRef.current = { ...powerRef.current, [item.power]: duration };
        setPowerTimers(powerRef.current);
      }
      return;
    }

    badRef.current = bump(badRef.current, item.key);
    setBadCaught(badRef.current);
    if (shieldRef.current > 0) {
      shieldRef.current -= 1;
      setShield(shieldRef.current);
      playTone('power', muted);
      popup('Blocked', true);
      return;
    }

    scoreRef.current = Math.max(0, scoreRef.current + BAD_POINTS);
    livesRef.current = Math.max(0, livesRef.current - 1);
    setScore(scoreRef.current);
    setLives(livesRef.current);
    setShake(true);
    setFlash(true);
    playTone('bad', muted);
    popup(`${BAD_POINTS}`, false);
    window.setTimeout(() => setShake(false), 420);
    window.setTimeout(() => setFlash(false), 180);
    if (livesRef.current <= 0) window.setTimeout(endGame, 250);
  }, [endGame, muted]);

  useEffect(() => {
    if (screen !== 'playing') return;
    let frame = 0;

    function tick(now: number) {
      const dt = Math.min(0.033, (now - lastFrame.current) / 1000 || 0);
      lastFrame.current = now;
      const frozen = Boolean(powerRef.current.freeze);

      elapsedRef.current += frozen ? 0 : dt;
      const nextTimeLeft = Math.max(0, GAME_SECONDS - Math.floor(elapsedRef.current));
      if (nextTimeLeft !== timeLeftRef.current) {
        timeLeftRef.current = nextTimeLeft;
        setTimeLeft(nextTimeLeft);
      }

      const nextTimers: Partial<Record<PowerKind, number>> = {};
      (Object.entries(powerRef.current) as Array<[PowerKind, number]>).forEach(([key, value]) => {
        const next = Math.max(0, value - dt);
        if (next > 0) nextTimers[key] = next;
      });
      powerRef.current = nextTimers;
      if (now - lastHudUpdate.current > 180) {
        lastHudUpdate.current = now;
        setPowerTimers(nextTimers);
      }

      spawnTimer.current += dt;
      const phase = elapsedRef.current < 10 ? 0 : elapsedRef.current < 20 ? 1 : 2;
      const spawnEvery = phase === 0 ? 0.52 : phase === 1 ? 0.42 : 0.34;
      let shouldSpawn = false;
      if (spawnTimer.current >= spawnEvery) {
        spawnTimer.current = 0;
        shouldSpawn = true;
      }

      const area = playAreaRef.current;
      const height = area?.clientHeight || window.innerHeight;
      const basketTop = height - BASKET_HEIGHT - 18;
      const liveBasketX = basketXRef.current;
      const basketLeft = liveBasketX - basketWidth / 2;
      const basketRight = liveBasketX + basketWidth / 2;

      setItems((current) => {
        const survivors: FallingItem[] = [];
        current.forEach((item) => {
          let nextX = item.x;
          let nextY = item.y + item.speed * dt;
          if (powerRef.current.magnet && item.kind === 'healthy') {
            const center = item.x + item.size / 2;
            nextX += (liveBasketX - center) * Math.min(1, dt * 3.8);
          }
          const itemCenter = nextX + item.size / 2;
          const caught = nextY + item.size >= basketTop && nextY <= basketTop + BASKET_HEIGHT && itemCenter >= basketLeft && itemCenter <= basketRight;
          if (caught) {
            catchItem({ ...item, x: nextX, y: nextY });
          } else if (nextY < height + item.size) {
            survivors.push({ ...item, x: nextX, y: nextY });
          }
        });
        if (shouldSpawn) survivors.push(spawnItem());
        return survivors;
      });

      if (elapsedRef.current >= GAME_SECONDS && screen === 'playing') {
        endGame();
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [basketWidth, catchItem, endGame, screen, spawnItem]);

  function moveBasket(clientX: number) {
    const rect = playAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const min = basketWidth / 2 + 8;
    const max = rect.width - basketWidth / 2 - 8;
    const next = Math.min(max, Math.max(min, clientX - rect.left));
    basketXRef.current = next;
    if (!basketFrameRef.current) {
      basketFrameRef.current = window.requestAnimationFrame(() => {
        basketFrameRef.current = 0;
        setBasketX(basketXRef.current);
      });
    }
  }

  const backgroundClass = useMemo(() => {
    if (powerTimers.rainbow) return 'rainbow-mode';
    if (flash) return 'danger-flash';
    return '';
  }, [flash, powerTimers.rainbow]);

  if (screen === 'start') {
    return <StartScreen muted={muted} onToggleMute={toggleSound} onStart={startGame} />;
  }

  if (screen === 'results' && result) {
    return <ResultScreen result={result} onPlayAgain={() => setScreen('start')} />;
  }

  return (
    <main
      className={`screen play-screen ${backgroundClass}`}
      ref={playAreaRef}
      onPointerMove={(event) => moveBasket(event.clientX)}
      onPointerDown={(event) => moveBasket(event.clientX)}
    >
      <div className="cloud-field" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <HUD
        score={score}
        timeLeft={timeLeft}
        lives={lives}
        muted={muted}
        powerTimers={powerTimers}
        shield={shield}
        onToggleMute={toggleSound}
      />
      <div className="fall-layer">
        {items.map((item) => <FallingObject key={item.id} item={item} />)}
        {popups.map((popup) => (
          <span
            key={popup.id}
            className={`score-popup ${popup.good ? 'score-popup--good' : 'score-popup--bad'}`}
            style={{ left: popup.x, top: popup.y }}
          >
            {popup.text}
          </span>
        ))}
      </div>
      <Basket x={basketX} width={basketWidth} shaking={shake} />
    </main>
  );
}
