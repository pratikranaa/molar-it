#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { MUSIC_DURATION_SECONDS, MUSIC_SECTIONS, NOTE_EVENTS } from "./music-score.js";

const SAMPLE_RATE = 48_000;
const CHANNELS = 2;

function argumentValue(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

function envelope(time, duration, type) {
  const attack = type === "mallet" ? 0.018 : 0.04;
  const release = type === "mallet" ? Math.min(1.8, duration * 0.7) : Math.min(0.3, duration * 0.7);
  if (time < 0 || time > duration) return 0;
  if (time < attack) return time / attack;
  if (time > duration - release) return Math.max(0, (duration - time) / release);
  return type === "mallet" ? Math.exp(-2.2 * time / duration) : 0.72;
}

function sectionGain(time) {
  return MUSIC_SECTIONS.find((section) => time >= section.start && time < section.end)?.gain || 0;
}

function oscillator(event, localTime) {
  const phase = 2 * Math.PI * event.frequency * localTime;
  if (event.type === "pulse") return Math.sin(phase) + 0.18 * Math.sin(phase * 2);
  return Math.sin(phase) + 0.34 * Math.sin(phase * 2) + 0.12 * Math.sin(phase * 3);
}

function renderSamples() {
  const frameCount = MUSIC_DURATION_SECONDS * SAMPLE_RATE;
  const left = new Float64Array(frameCount);
  const right = new Float64Array(frameCount);
  for (const event of NOTE_EVENTS) {
    const first = Math.floor(event.start * SAMPLE_RATE);
    const last = Math.min(frameCount, Math.ceil((event.start + event.duration) * SAMPLE_RATE));
    const leftPan = Math.sqrt((1 - event.pan) / 2);
    const rightPan = Math.sqrt((1 + event.pan) / 2);
    for (let frame = first; frame < last; frame += 1) {
      const localTime = frame / SAMPLE_RATE - event.start;
      const time = frame / SAMPLE_RATE;
      const value = oscillator(event, localTime)
        * envelope(localTime, event.duration, event.type)
        * event.gain
        * sectionGain(time);
      left[frame] += value * leftPan;
      right[frame] += value * rightPan;
    }
  }
  const fadeFrames = SAMPLE_RATE * 2;
  for (let frame = 0; frame < frameCount; frame += 1) {
    const fadeIn = Math.min(1, frame / fadeFrames);
    const fadeOut = Math.min(1, (frameCount - frame) / fadeFrames);
    left[frame] *= fadeIn * fadeOut;
    right[frame] *= fadeIn * fadeOut;
  }
  return { left, right };
}

function wavBuffer({ left, right }) {
  const frames = left.length;
  const dataBytes = frames * CHANNELS * 2;
  const buffer = Buffer.alloc(44 + dataBytes);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataBytes, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * CHANNELS * 2, 28);
  buffer.writeUInt16LE(CHANNELS * 2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataBytes, 40);
  for (let frame = 0; frame < frames; frame += 1) {
    buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[frame])) * 32767), 44 + frame * 4);
    buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[frame])) * 32767), 46 + frame * 4);
  }
  return buffer;
}

const output = resolve(argumentValue("output", "music/molar-launch-bed.wav"));
const rawOutput = `${output}.raw.wav`;
await mkdir(dirname(output), { recursive: true });
await writeFile(rawOutput, wavBuffer(renderSamples()));
const normalized = spawnSync("ffmpeg", [
  "-y",
  "-i", rawOutput,
  "-af", "loudnorm=I=-14:TP=-1:LRA=7",
  "-ar", String(SAMPLE_RATE),
  "-ac", String(CHANNELS),
  output,
], { stdio: "inherit" });
await rm(rawOutput, { force: true });
if (normalized.error) throw new Error(`Unable to run ffmpeg: ${normalized.error.message}`);
if (normalized.status !== 0) throw new Error(`ffmpeg loudness normalization exited with status ${normalized.status}`);
console.log(output);
