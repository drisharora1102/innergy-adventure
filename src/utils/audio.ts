export function playTone(type: 'catch' | 'bad' | 'power' | 'finish', muted: boolean) {
  if (muted) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);

  const settings = {
    catch: { wave: 'sine', start: 560, end: 940, volume: 0.12 },
    bad: { wave: 'triangle', start: 190, end: 105, volume: 0.08 },
    power: { wave: 'sine', start: 420, end: 1180, volume: 0.1 },
    finish: { wave: 'sine', start: 660, end: 1320, volume: 0.12 }
  } as const;
  const next = settings[type];

  oscillator.type = next.wave;
  oscillator.frequency.setValueAtTime(next.start, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(next.end, context.currentTime + 0.2);
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(next.volume, context.currentTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.26);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.28);
}
