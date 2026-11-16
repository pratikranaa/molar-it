# Molar launch studio — remake 02

A new film project. The prior `film/` project and its exports are unchanged.

## Preview

From `molar.it`: `python3 -m http.server 8893 --bind 127.0.0.1`, then open `http://127.0.0.1:8893/studio.html`.

Starts paused. Space: play/pause. Arrows: seek five seconds. C: captions. M: music. Four edits share one new scene library. Pick any of the 28 scene cards to play it independently. The complete transcript is readable HTML, including when canvas is inaccessible.

The site production build is allowlisted. This private studio is not added to the public build or deployed.

## Render

Node 22+, FFmpeg/ffprobe in PATH. From this folder:

```sh
npm ci
npm run check
npm run render
# One selected edit, or a quick excerpt:
node render.mjs --cut launch
node render.mjs --cut short --limit 2
node render.mjs --cut scenes
node render.mjs --cut vertical
npm run check:media
```

All outputs are local under ignored `renders/`. The five full exports are `molar-launch.mp4`, `molar-founder.mp4`, `molar-demo.mp4`, `molar-short.mp4`, and `molar-short-vertical.mp4`. The scene directory contains 28 clean, silent MP4s with separate SRT/VTT narration guides. Films are 1080p60 H.264/AAC, with captions burned in and provided separately. Original temporary music is `music-bed.wav`.

The launch and founder cuts are 2:39.5 each, with 20 product cutaways and eight founder/copy segments. The extended demo is 2:58; both short formats are 30 seconds. `check:media` verifies all 33 MP4s, including complete decode, frame count, duration, size, video/audio codecs, sidecars, and encoded-frame contact sheets. `check` generates its own local footage fixture and does not require rendered films.

Geometry uses a normalized 1600×900 landscape artboard and a separately recomposed 900×1600 portrait artboard. Every element scales together. `draw.mjs` is shared by the browser and native Skia renderer; no screen recordings, stock UI mockups, or reference assets are baked into the illustrations. Fonts are the site's locally bundled Instrument Sans and Geist Mono.

## Replace the placeholders

Eight founder slots F01–F08 are listed in `renders/narration-and-shotlist.md`, with exact in/out timing. Record in bright outdoor shade with a quiet background and an external mic. Keep the face near the guide and leave the bottom caption area clear. Record each complete sentence, with a second of quiet before and after. Do not read timecodes or visual directions aloud.

Use the founder panel's optional file input to audition a take locally. Files never leave the browser. Browser uploads do **not** rewrite the exported MP4. For the final film, replace the matching placeholder intervals in an editor using the shotlist; use the clean scene MP4s as cutaways. Keep product claims scoped to supported services and configured checks.

The exported founder version intentionally contains guides, not a synthetic person. The animated version uses the exact same script and timings with copy frames. Both currently have captions and an original synthesized placeholder music bed; there is no spoken voice track. Record the narration first, then retime `story.mjs` to the actual take and rerender, or assemble the clean pieces in your editor. Do not present the placeholder music as a commissioned human performance.

## Truth boundaries

Illustrative Northstar sample data is not a live QA run or proof of deployment. “Could not verify” is distinct from pass/fail. No claim that Molar serves 15M users. The founder experience comes from the user's latest YC draft. There are no competitor-superiority claims, invented customers, benchmark numbers, one-click universal service compatibility, or guaranteed autonomous fixes. Mender remains outside the main promise.

## Research / creative attribution

Reviewed 2026-09-09: the [live Molar website](https://molar.it), current local startup draft, [Waybill YC launch](https://www.ycombinator.com/companies/waybill) and its [video](https://www.youtube.com/watch?v=JPxhZFZ5xco), the user's supplied Waybill script/board, written launch pages for [Momentic](https://www.ycombinator.com/launches/KZH-momentic-automated-testing-with-ai), [Spur](https://www.ycombinator.com/companies/spur), [QualGent](https://www.ycombinator.com/launches/NWJ-qualgent-ai-quality-assurance-agent-for-mobile-software-testing) and [Trope](https://www.ycombinator.com/companies/trope), plus the user-pasted Trope production article.

Waybill was accessible as a browser player/poster; scripted seeks did not finish loading, so this is not a claim that its full film was newly watched. The supplied script and visual board remain the primary motion reference. The other YC research is written-launch review, not a full-video viewing claim. The remake takes the problem → inputs → workflow → proof → expansion → trust structure, not reference footage, art, music or copy.

[web.dev animation guidance](https://web.dev/articles/animations-guide) informed the review UI's transform/opacity transitions. Film drawing uses original Canvas code, not ported animation techniques. The [YC application founder-video rules](https://www.ycombinator.com/video/) describe a separate submission; these launch films are not that video.

The implementation plan and decisions are in the parent repo's `docs/superpowers/plans/2026-09-09-molar-film-remake.md`.
