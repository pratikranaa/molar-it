import { spawn } from "node:child_process";

export function createFrameEncoder({ output, fps, codec, durationSeconds, musicPath = null }) {
  const videoArgs = codec === "prores"
    ? ["-c:v", "prores_ks", "-profile:v", "3", "-pix_fmt", "yuv422p10le"]
    : ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];
  const args = ["-y", "-f", "image2pipe", "-framerate", String(fps), "-i", "pipe:0"];
  if (musicPath) {
    args.push(
      "-i", musicPath,
      "-map", "0:v:0",
      "-map", "1:a:0",
      "-c:a", "aac",
      "-b:a", "256k",
      "-shortest",
    );
  }
  args.push(...videoArgs, "-t", String(durationSeconds), output);
  const child = spawn("ffmpeg", args, { stdio: ["pipe", "inherit", "inherit"] });
  const completion = new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (status) => {
      if (status === 0) resolve();
      else reject(new Error(`ffmpeg exited with status ${status}`));
    });
  });
  return {
    async write(buffer) {
      if (!child.stdin.write(buffer)) {
        await new Promise((resolveDrain) => child.stdin.once("drain", resolveDrain));
      }
    },
    async close() {
      child.stdin.end();
      await completion;
    },
  };
}
