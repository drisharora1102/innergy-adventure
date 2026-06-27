type ToneType = 'catch' | 'bad' | 'power' | 'finish';

let sharedContext: AudioContext | null = null;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  sharedContext ||= new AudioContextClass();
  return sharedContext;
}

export async function unlockAudio() {
  const context = getAudioContext();
  if (!context) return false;
  if (context.state === 'suspended') await context.resume();
  return context.state === 'running';
}

function playSweep(context: AudioContext, type: Exclude<ToneType, 'finish'>) {
  const settings = {
    catch: { wave: 'sine', start: 560, end: 940, volume: 0.2 },
    bad: { wave: 'triangle', start: 190, end: 105, volume: 0.16 },
    power: { wave: 'sine', start: 420, end: 1180, volume: 0.2 }
  } as const;
  const next = settings[type];
  const startTime = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.type = next.wave;
  oscillator.frequency.setValueAtTime(next.start, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(next.end, startTime + 0.22);
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.exponentialRampToValueAtTime(next.volume, startTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.32);
}

function playCompletionChimes(context: AudioContext) {
  const startTime = context.currentTime;
  const notes = [659.25, 783.99, 987.77, 1318.51];

  notes.forEach((frequency, index) => {
    const noteStart = startTime + index * 0.16;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, noteStart);
    gain.gain.setValueAtTime(0.001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.18, noteStart + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.48);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + 0.5);
  });
}

export function playTone(type: ToneType, muted: boolean) {
  if (muted) return;
  const context = getAudioContext();
  if (!context) return;

  const play = () => {
    if (type === 'finish') playCompletionChimes(context);
    else playSweep(context, type);
  };

  if (context.state === 'suspended') {
    void context.resume().then(play).catch(() => undefined);
  } else {
    play();
  }
}

export function playResultChimes(muted: boolean) {
  if (muted) return;
  playTone('finish', false);
}
