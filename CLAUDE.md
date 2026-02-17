# CLAUDE.md - 성서인물게임 (Bible Character Game)

## Project Overview
Dixit-style multiplayer web card game using Bible character AI-generated illustrations.
3~10 players take turns as storyteller, giving clues about their chosen card.

## Tech Stack
- **Frontend**: Vite + React + TypeScript, Framer Motion, react-i18next
- **Backend**: Node.js + Express + Socket.IO (`server/index.js`)
- **Deploy**: Vercel (frontend, auto-deploy on push) / Render (backend, manual deploy)
- **URL**: https://jwgame-gules.vercel.app / https://jwgame.onrender.com

## Commands
- `npm run dev` — run both client + server concurrently
- `npm run build` — `tsc -b && vite build`
- `npm run dev:client` / `npm run dev:server` — run separately

## Architecture

### Frontend Structure
```
src/
├── App.tsx              # Main app, routing by gameState phase, music + chat integration
├── types.ts             # GamePhase, RoundResult types
├── pages/
│   ├── LobbyPage.tsx    # Room create/join, room browser, language selector, info modals
│   ├── WaitingRoom.tsx  # Player list, ready system, round selection
│   ├── GamePage.tsx     # All game phases (storyteller→submit→vote→result)
│   └── GameOverPage.tsx # Rankings, confetti, play again
├── components/
│   ├── BibleCard.tsx    # Card component with highlight, vote count badge
│   ├── AvatarIcon.tsx   # Individual PNG avatars (/icons/0-15.png) — DO NOT REGENERATE
│   ├── AvatarPicker.tsx # Avatar selection grid (58px items, 40px icons)
│   ├── GlobalChat.tsx   # Fixed bottom chat bar (collapsed/expanded), sets --gchat-bar-h CSS var
│   ├── MusicPlayer.tsx  # Music FAB (bottom-left) + mini player + playlist modal
│   ├── ScoreBoard.tsx   # Summary + detail tabs, filter().reduce() for scoring
│   ├── CountdownBar.tsx # 28px height timer bar
│   ├── ChatOverlay.tsx  # OLD inline chat (kept but unused, replaced by GlobalChat)
│   ├── InfoModal.tsx    # Reusable modal
│   └── Toast.tsx        # Toast notifications
├── hooks/
│   └── useSocket.ts     # Socket.IO connection, game state, chat messages
├── utils/
│   ├── audioManager.ts  # Singleton: categories, shuffle, auto-next, playlist mode
│   └── sfx.ts           # UI sound effects (Web Audio API)
├── i18n/
│   ├── index.ts         # i18n config, localStorage language restore
│   ├── ko.ts            # Korean (primary)
│   ├── en.ts            # English
│   └── zh.ts            # Chinese (Simplified)
└── styles/
    └── global.css       # CSS variables, Noto Sans KR/SC fonts, page-container
```

### Backend (server/index.js)
- Single file, ~700 lines
- Socket.IO events: room management, game flow, chat, timers
- **Timer system**: storyteller_turn (60s), players_submit (20s), voting (15s)
- **Auto-vote**: Players who don't vote in 15s get random auto-vote
- **Disconnect handling**: Auto-advance if only disconnected players remain
- **Chat**: Allowed in ALL phases (no phase restriction)
- **Scoring**: Dixit rules — all correct/all wrong = storyteller 0, others +2; partial = storyteller +3, correct voters +3; bonus +1 per wrong vote on your card

### Game Phases
`lobby` → `waiting` → `storyteller_turn` → `players_submit` → `shuffle` → `voting` → `reveal` → `round_result` → (repeat or `game_over`)

## Key Design Decisions

### Avatar Icons
- 16 individual PNGs at `/public/icons/0.png` ~ `15.png`
- **NEVER regenerate or overwrite these files** — user manually centered each one
- AvatarIcon uses `<img>` tag (not CSS sprite)

### Music System
- Audio files in `/public/audio/` (categories: start, playing, celebration, secret)
- AudioManager singleton with two modes: **auto mode** (phase-based) and **playlist mode** (user manual)
- Browser autoplay policy: defers playback until first user interaction (click/touch/keydown)
- Playlist only accessible from lobby/waiting
- Music FAB (bottom-left) uses `--gchat-bar-h` CSS variable to stay above chat bar

### Chat System
- GlobalChat: fixed bottom bar, always visible when in a room
- Collapsed: last message preview + input field
- Expanded: full message history (250px desktop, 200px mobile)
- Sets `--gchat-bar-h` CSS variable on `:root` so other fixed elements (music FAB, game bottom bar) follow
- Adds `gchat-is-expanded` class on `<body>` for CSS coordination
- Chat persists across rounds, only cleared on leave room

### Clue Input (Storyteller)
- Positioned ABOVE cards with highlighted blue box + pulse animation
- Label: "✏️ 제시어를 입력하세요"
- Instruction text changes after card selection: "카드를 골랐어요! 아래에 제시어를 입력하세요 ↓"

### Scoring Bug Fix
- `scoreChanges` can have multiple entries per player per round (e.g., correct_guess +3 AND bonus +1)
- Must use `filter().reduce()`, NOT `find()` to sum all entries

### Kakaopay Donation
- Mobile: direct link to `https://qr.kakaopay.com/FN0023EGr`
- Desktop: QR code image (kakaopay only works on mobile app)
- CSS media query + `hover: none` for device detection

### Contact Section
- Email: atshane81@gmail.com
- KakaoTalk Channel: https://pf.kakao.com/_exghAX

### i18n
- 3 languages: Korean (ko), English (en), Chinese Simplified (zh)
- Language saved to localStorage (`app_lang`)
- Fonts: Noto Sans KR + Noto Sans SC via Google Fonts

## CSS Architecture
- CSS variables defined in `global.css` (--accent, --bg-primary, etc.)
- `--gchat-bar-h`: dynamic CSS variable set by GlobalChat component (actual chat bar height)
- Fixed elements stacking: chat bar (z:140) → game bottombar (z:60, bottom: var(--gchat-bar-h)) → music FAB (z:1000, bottom: calc(var(--gchat-bar-h) + 12px))
- `page-container` has `padding-bottom: 64px` for chat bar space
- `game-content` has `padding-bottom: 140px` for bottom bar + chat

## Deployment Notes
- **Frontend (Vercel)**: Auto-deploys on push to master
- **Backend (Render)**: Manual deploy required when `server/index.js` changes
- Render free tier spins down on inactivity (~50s cold start)
- Backend URL configured in `useSocket.ts`

## Known Issues / Warnings
- CRLF warnings on git commit (Windows) — harmless
- `ChatOverlay.tsx` still exists but is unused (replaced by GlobalChat) — can be removed later
- Copyright notice: "사용되는 모든 그림과 음악은 AI로 제작되었습니다"
