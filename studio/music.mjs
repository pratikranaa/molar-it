import { writeFile } from "node:fs/promises";

// Original, deterministic temporary score: soft electric-key tones and slow pads.
// No sampled performance, external music, voice synthesis, or reference audio.
export async function writeScore(path, seconds = 240) {
  const rate = 44100,
    n = Math.ceil(seconds * rate),
    pcm = Buffer.alloc(n * 4),
    bpm = 84,
    beat = 60 / bpm,
    bar = beat * 4;
  const chords = [
    [146.832, 184.997, 220, 277.183],
    [130.813, 164.814, 195.998, 246.942],
    [164.814, 195.998, 246.942, 293.665],
    [110, 146.832, 184.997, 220],
  ];
  const plucks = [0, 2, 1, 3, 2, 1, 0, 2];
  let peak = 0;
  for (let i = 0; i < n; i++) {
    const t = i / rate,
      block = Math.floor(t / (bar * 2)),
      chord = chords[block % 4],
      phase = t % (bar * 2),
      blend = Math.min(1, phase / 1.8),
      previous = chords[(block + 3) % 4];
    let l = 0,
      r = 0;
    for (let j = 0; j < 4; j++) {
      const f = chord[j],
        old = previous[j],
        a = 0.011 / (1 + j * 0.12);
      l +=
        a *
        ((1 - blend) * Math.sin(t * old * Math.PI * 2) +
          blend * Math.sin(t * f * Math.PI * 2));
      r +=
        a *
        ((1 - blend) * Math.sin(t * old * 1.0005 * Math.PI * 2) +
          blend * Math.sin(t * f * 1.0005 * Math.PI * 2));
    }
    const noteIndex = Math.floor(t / beat),
      age = t % beat,
      f = chord[plucks[noteIndex % 8]] * 2;
    const env = (1 - Math.exp(-age * 75)) * Math.exp(-age * 3.3);
    const tone =
      (Math.sin(age * f * Math.PI * 2) +
        0.14 * Math.sin(age * f * 2 * Math.PI * 2)) *
      env *
      0.065;
    const fade = Math.min(1, t / 2, Math.max(0, (seconds - t) / 3));
    l = (l + tone) * fade * 3;
    r = (r + tone * 0.9) * fade * 3;
    peak = Math.max(peak, Math.abs(l), Math.abs(r));
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, l)) * 32767), i * 4);
    pcm.writeInt16LE(
      Math.round(Math.max(-1, Math.min(1, r)) * 32767),
      i * 4 + 2,
    );
  }
  const h = Buffer.alloc(44);
  h.write("RIFF");
  h.writeUInt32LE(36 + pcm.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(2, 22);
  h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 4, 28);
  h.writeUInt16LE(4, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(pcm.length, 40);
  await writeFile(path, Buffer.concat([h, pcm]));
  return { seconds, sampleRate: rate, peakDb: 20 * Math.log10(peak) };
}
