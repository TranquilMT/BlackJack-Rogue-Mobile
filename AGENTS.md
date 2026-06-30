# AGENTS.md

## Cursor Cloud specific instructions

Blackjack Rogue is a single-page Vite + React 19 + TypeScript game (a roguelike where
blackjack hands are used as combat against a boss). There is one service: a Node dev
server that hosts Vite middleware plus a small Express/Socket.IO backend.

Non-obvious notes for working in this repo:

- **Source ships as a zip.** The tracked source on the base branch lives inside
  `blackjack-rogue-enhanced.zip`. The startup update script extracts it into the repo
  root when `package.json` is missing, so a fresh VM may only contain the zip until that
  runs. If `package.json` is absent, run
  `unzip -o blackjack-rogue-enhanced.zip -d .` before anything else.
- **Run the app:** `npm run dev` (defined as `tsx server.ts`), not bare `vite`. It starts
  Express + Socket.IO + Vite middleware and listens on `http://localhost:3000` (binds
  `0.0.0.0`). Health check: `GET /api/health` → `{"status":"ok"}`.
- **Browser needs outbound internet.** `index.html` uses an import map that loads `react`,
  `react-dom`, `framer-motion`, `gsap`, and `zustand` from `https://esm.sh`. The dev server
  does not bundle/proxy these, so the page only renders if the browser can reach esm.sh.
- **Lint / build:** `npm run lint` (`tsc --noEmit`) and `npm run build` (`vite build`).
  `npm run preview` serves the production build.
- **Optional Steam proxy:** the `/api/steam/achievements` route needs `STEAM_API_KEY` and
  `STEAM_APP_ID` (see `.env.example`). These are not required to run or play the game.
- **Gameplay entry path:** from the landing screen the flow is TAP TO ENTER → dismiss the
  update / daily-reward / name popups → main menu → ENDLESS RUN or CAMPAIGN → (skip
  tutorial) → Embark → through story dialogue → the blackjack table (HIT / STAND / DOUBLE /
  SURRENDER).
