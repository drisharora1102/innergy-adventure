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

function playHooray(context: AudioContext) {
  const startTime = context.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((frequency, index) => {
    const noteStart = startTime + index * 0.14;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.type = index === notes.length - 1 ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, noteStart);
    gain.gain.setValueAtTime(0.001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.2, noteStart + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.34);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + 0.36);
  });
}

export function playTone(type: ToneType, muted: boolean) {
  if (muted) return;
  const context = getAudioContext();
  if (!context) return;

  const play = () => {
    if (type === 'finish') playHooray(context);
    else playSweep(context, type);
  };

  if (context.state === 'suspended') {
    void context.resume().then(play).catch(() => undefined);
  } else {
    play();
  }
}
