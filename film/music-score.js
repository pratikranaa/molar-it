export const MUSIC_DURATION_SECONDS = 75;
export const BPM = 80;

export const MUSIC_SECTIONS = [
  { name: "human", start: 0, end: 15, gain: 0.34 },
  { name: "working", start: 15, end: 44, gain: 0.46 },
  { name: "failure", start: 44, end: 56, gain: 0.30 },
  { name: "resolution", start: 56, end: 70, gain: 0.48 },
  { name: "close", start: 70, end: 75, gain: 0.38 },
];

const chord = (start, duration, frequencies, gain = 0.16) =>
  frequencies.map((frequency, index) => ({
    type: "mallet",
    start: start + index * 0.035,
    duration,
    frequency,
    gain,
    pan: index % 2 ? 0.18 : -0.18,
  }));

const pulses = (start, end, frequency, every = 1.5) => {
  const events = [];
  for (let time = start; time < end; time += every) {
    events.push({ type: "pulse", start: time, duration: 0.42, frequency, gain: 0.075, pan: 0 });
  }
  return events;
};

export const NOTE_EVENTS = [
  ...chord(0, 6.0, [220.00, 261.63, 329.63], 0.13),
  ...chord(7.5, 5.5, [196.00, 246.94, 293.66], 0.12),
  ...chord(15, 7.0, [220.00, 261.63, 329.63], 0.15),
  ...pulses(15, 44, 110.00),
  ...chord(22.5, 7.0, [174.61, 220.00, 261.63], 0.15),
  ...chord(30, 7.0, [196.00, 246.94, 293.66], 0.15),
  ...chord(37.5, 6.5, [220.00, 261.63, 329.63], 0.15),
  ...chord(44, 6.0, [164.81, 196.00, 246.94], 0.11),
  ...chord(50, 6.0, [146.83, 174.61, 220.00], 0.10),
  ...pulses(56, 70, 110.00),
  ...chord(56, 6.5, [174.61, 220.00, 261.63], 0.16),
  ...chord(62.5, 6.5, [196.00, 246.94, 293.66], 0.16),
  ...chord(69, 5.85, [220.00, 261.63, 329.63, 392.00], 0.14),
];
