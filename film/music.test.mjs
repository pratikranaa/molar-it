import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { MUSIC_DURATION_SECONDS, MUSIC_SECTIONS, NOTE_EVENTS } from "./music-score.js";

test("the original score covers the approved 75-second arc", () => {
  assert.equal(MUSIC_DURATION_SECONDS, 75);
  assert.deepEqual(
    MUSIC_SECTIONS.map((section) => section.name),
    ["human", "working", "failure", "resolution", "close"],
  );
  assert.ok(NOTE_EVENTS.every((event) => event.start >= 0 && event.start + event.duration <= 75));
});

test("music renderer writes a 48 kHz stereo 75-second WAV", async () => {
  const output = "/tmp/molar-launch-music-test.wav";
  const result = spawnSync(process.execPath, ["render-music.mjs", "--output", output], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.ok((await stat(output)).size > 1_000_000);
  const header = await readFile(output);
  assert.equal(header.subarray(0, 4).toString(), "RIFF");
  assert.equal(header.readUInt16LE(22), 2);
  assert.equal(header.readUInt32LE(24), 48_000);
});
