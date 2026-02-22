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
- **Preview server**: DO NOT use preview_start / launch.json — not configured for this project

## Architecture

### Frontend Structure
```
src/
├── App.tsx              # Main app, routing by gameState phase, music + chat integration
├── types.ts             # GamePhase, RoundResult types
├── data/
│   └── characters.ts    # 128 Bible characters with multi-language names (ko/en/zh/zhTw/my/th)
├── pages/
│   ├── LobbyPage.tsx    # Room create/join, room browser, language dropdown, info modals
│   ├── WaitingRoom.tsx  # Player list, ready system, round selection, animated states
│   ├── GamePage.tsx     # All game phases with animations (storyteller→submit→vote→result)
│   └── GameOverPage.tsx # Rankings with counting animation, confetti, play again
├── components/
│   ├── BibleCard.tsx    # Card with 3D flip, deal animation, dynamic multi-lang names
│   ├── AvatarIcon.tsx   # Individual PNG avatars (/icons/0-15.png) — DO NOT REGENERATE
│   ├── AvatarPicker.tsx # Avatar selection grid (58px items, 40px icons)
│   ├── GlobalChat.tsx   # Fixed bottom chat bar (collapsed/expanded), drag-resize handle
│   ├── MusicPlayer.tsx  # Music FAB (bottom-left) + mini player + playlist modal
│   ├── ScoreBoard.tsx   # Summary + detail tabs, filter().reduce() for scoring
│   ├── CountdownBar.tsx # 28px height timer bar with gradient + glow
│   ├── InstallPrompt.tsx # PWA "Add to Home Screen" prompt (iOS/Android)
│   ├── ChatOverlay.tsx  # OLD inline chat (kept but unused, replaced by GlobalChat)
│   ├── InfoModal.tsx    # Reusable modal
│   └── Toast.tsx        # Toast notifications with colored glow shadows
├── hooks/
│   └── useSocket.ts     # Socket.IO connection, game state, chat messages, phaseReady
├── utils/
│   ├── audioManager.ts  # Singleton: categories, shuffle, auto-next, playlist mode
│   └── sfx.ts           # UI sound effects (Web Audio API)
├── i18n/
│   ├── index.ts         # i18n config, localStorage language restore
│   ├── ko.ts            # Korean (primary)
│   ├── en.ts            # English
│   ├── zh.ts            # Chinese (Simplified)
│   ├── zhTw.ts          # Chinese (Traditional) — registered as "zh-TW"
│   ├── my.ts            # Myanmar (Burmese)
│   └── th.ts            # Thai
└── styles/
    └── global.css       # CSS variables, fonts, button ripple effects, page-container
```

### Backend (server/index.js)
- Single file, ~860+ lines
- Socket.IO events: room management, game flow, chat, timers
- **Timer system**: storyteller_turn (60s), players_submit (30s), voting (20s)
- **Timer deferral**: `phase_ready` event from clients + 5s safety fallback (`guideTimeout`)
- **Auto-vote**: Players who don't vote in time get random auto-vote
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

### Card Name Display System (BibleCard.tsx)
- **Dynamic multi-language names** based on `i18n.language`
- `normalizeLang()`: Normalizes browser locale codes (e.g., `ko-KR` → `ko`, `zh-Hant` → `zh-TW`)
- `getCardNames()`: Returns `{ primaryName, secondaryNames }` — always 3 names displayed
- **Display rules** (primary = large, secondary = small):
  - Korean selected → primary: 한국어, secondary: English + 简体中文
  - English selected → primary: English, secondary: 한국어 + 简体中文
  - Other languages (zh, zh-TW, my, th, etc.) → primary: 해당언어, secondary: 한국어 + English
- Secondary names are determined by what the **primary name value** actually is (not by lang code), so fallback cases work correctly
- **When adding new languages**: add to `nameMap` in `getCardNames()`, add to `known` array in `normalizeLang()`, the display rule automatically falls into the "Other" category (primary + Korean + English)

### Character Data (src/data/characters.ts)
- 128 Bible characters with interface:
  ```typescript
  { id, nameKo, nameEn, nameZh, nameZhTw, nameMy, nameTh, image }
  ```
- Myanmar/Thai names may need verification against 신세계역 (New World Translation)
- Card images at `/public/cards/001_아담_Adam.png` ~ `128_실라_Silas.png`

### Card Animations (BibleCard.tsx)
- **3D Flip**: `flipReveal` prop — card starts face-down and flips to face-up with spring animation
- **Deal Effect**: `dealDelay` prop — cards fly in from below with rotation, staggered by delay
- **Sequential Reveal**: Round result cards flip one-by-one (0.15s intervals)
- Vote count badges and highlight badges animate in after flip completes
- Uses `perspective: 800px` and `transform-style: preserve-3d` for 3D effect

### Card Name CSS (BibleCard.css)
- `.bible-card__name-primary`: 14px, bold (11px for sm, 16px for lg)
- `.bible-card__name-secondary`: 10px, tertiary color (8px for sm, 12px for lg)
- `.bible-card__info`: flex column, centered text, 8px 10px padding

### Game Visual Effects (GamePage.tsx)
- **TypingText Component**: Clue text appears one character at a time (60ms/char) with blinking cursor
- **ParticleBurst Component**: 12 colored particles explode on vote selection
- **Phase Transitions**: Smooth Y-axis slide with cubic-bezier easing
- **Phase Guide Popup**: Modal overlay per phase with "오늘은 설명 안보기" checkbox (localStorage `guide_hide_today`)
- **Result Toast**: Shows after guide popup is dismissed (not during)
- **Bonus Labels**: `+보너스!` shown in orange for bonus score entries

### Score & Result Animations (GameOverPage.tsx)
- **useCountUp Hook**: Score counts from 0 to target with ease-out cubic (1200ms)
- **AnimatedScore Component**: Reusable counting animation with configurable delay
- **3-Wave Confetti**: Side cannons → center burst (500ms) → gold burst (1500ms)
- **Winner Avatar Wiggle**: Avatar rotates left-right on reveal
- **Staggered Rankings**: Each rank row slides in from left with spring animation

### Waiting Room Animations (WaitingRoom.tsx)
- **Ready Check**: Green circle ✓ with spring pop-in animation
- **Host Star**: Gold gradient circle ✦
- **Waiting Dots**: 3 bouncing dots animation (dotBounce keyframe)
- **Avatar Wiggle**: Avatar rotates on ready state change
- **Player List**: AnimatePresence for enter/exit animations
- **Start Button Glow**: Pulsing box-shadow when all players ready

### Music System
- Audio files in `/public/audio/` (categories: start, playing, celebration, secret)
- AudioManager singleton with two modes: **auto mode** (phase-based) and **playlist mode** (user manual)
- `togglePlay()` checks `_pendingCategory !== _currentCategory` to switch on resume
- `_userPaused` flag prevents auto-resume after manual pause
- Browser autoplay policy: defers playback until first user interaction
- Playlist only accessible from lobby/waiting
- Music FAB (bottom-left) uses `--gchat-bar-h` CSS variable to stay above chat bar

### Chat System
- GlobalChat: fixed bottom bar, always visible when in a room
- **Drag-to-resize**: Handle at top, mouse + touch support, MIN=120/MAX=500/DEFAULT=250/200
- Collapsed: last message preview + input field
- Expanded: full message history with dynamic height via state
- Sets `--gchat-bar-h` CSS variable on `:root` so other fixed elements follow
- Adds `gchat-is-expanded` class on `<body>` for CSS coordination
- Chat persists across rounds, only cleared on leave room

### Timer Deferral System
- Phase guide popup shows → timer paused (`timerPaused = true`)
- Player clicks OK → `phase_ready` event → server activates timer
- 5-second safety fallback: `guideTimeout` auto-activates timer if no `phase_ready` received
- `clearRoomTimer()` also clears `guideTimeout`

### Clue Input (Storyteller)
- Positioned ABOVE cards with highlighted blue box + pulse animation
- Label: "✏️ 제시어를 입력하세요"
- Instruction text changes after card selection

### Scoring Bug Fix
- `scoreChanges` can have multiple entries per player per round (e.g., correct_guess +3 AND bonus +1)
- Must use `filter().reduce()`, NOT `find()` to sum all entries

### PWA Support
- `public/manifest.json` with standalone display mode
- `InstallPrompt.tsx`: iOS Safari manual instructions, Android Chrome `beforeinstallprompt` API
- 7-day dismiss with localStorage `pwa_install_dismissed`

### Kakaopay Donation
- Mobile: direct link to `https://qr.kakaopay.com/FN0023EGr`
- Desktop: QR code image (kakaopay only works on mobile app)
- CSS media query + `hover: none` for device detection

### KakaoTalk Browser Warning
- Detects KakaoTalk in-app browser via user agent
- Shows warning popup with "외부 브라우저로 열기" button
- "오늘 하루 보지 않기" checkbox with localStorage `kakao_warn_hide`

### Contact Section
- Email: atshane81@gmail.com
- KakaoTalk Channel: https://pf.kakao.com/_exghAX

### i18n (Internationalization)
- **6 languages**: Korean (ko), English (en), Chinese Simplified (zh), Chinese Traditional (zh-TW), Myanmar (my), Thai (th)
- i18n resource registration: `{ ko, en, zh, "zh-TW": zhTw, my, th }`
- Language saved to localStorage (`app_lang`)
- **Language selector**: Dropdown (`<select>`) in LobbyPage with `🌐 {t("lobby.language")}` label
- All translation files have `lobby.language` key for the label
- **Fonts**: Inter + Noto Sans KR + Noto Sans SC + Noto Sans TC + Noto Sans Thai + Noto Sans Myanmar via Google Fonts
- Font-family chain: `'Inter', 'Noto Sans KR', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans Thai', 'Noto Sans Myanmar', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Keys include: guide.*, pwa.*, score.bonus, toast.*, lobby.language sections

#### Adding a New Language
1. Create `src/i18n/{langCode}.ts` — copy structure from `ko.ts`, translate all keys
2. Register in `src/i18n/index.ts`: import + add to resources
3. Add `name{LangCode}` field to `BibleCharacter` interface in `src/data/characters.ts`
4. Add translations for all 128 characters in `characters.ts`
5. Add to `nameMap` in `BibleCard.tsx` `getCardNames()` function
6. Add to `known` array in `BibleCard.tsx` `normalizeLang()` function
7. Add to `LANGUAGES` array in `LobbyPage.tsx`
8. Add Google Font (Noto Sans variant) to `global.css` import + font-family chain
9. Card display automatically shows: selected language (primary) + Korean + English (secondary)

## CSS Architecture
- CSS variables defined in `global.css` (--accent, --bg-primary, etc.)
- `--gchat-bar-h`: dynamic CSS variable set by GlobalChat component (actual chat bar height)
- Fixed elements stacking: chat bar (z:140) → game bottombar (z:60) → music FAB (z:1000)
- `page-container` has `padding-bottom: 64px` for chat bar space
- `game-content` has `padding-bottom: 140px` for bottom bar + chat

### Button Ripple Effect
- All buttons (btn-primary, btn-secondary, btn-ghost) have `::before` pseudo-element ripple
- On `:active`, ripple circle expands from center (300px) with opacity transition
- `overflow: hidden` + `position: relative` on all button classes

### Timer Bar (CountdownBar)
- Gradient fill: accent → purple (normal), red gradient (urgent ≤5s)
- Glow line at edge: `::after` pseudo-element with box-shadow
- Urgent text pulse: scale 1 → 1.05 animation

### Toast Notifications
- Type-specific glow shadows (blue/orange/green)
- Inner border highlight with `inset` box-shadow
- Spring animation entrance (scale 0.9 → 1, y 40 → 0)

## Deployment Notes
- **Frontend (Vercel)**: Auto-deploys on push to master
- **Backend (Render)**: Manual deploy required when `server/index.js` changes
  - Dashboard: https://dashboard.render.com → `jwgame` service → Manual Deploy
- Render free tier spins down on inactivity (~50s cold start)
- Backend URL configured in `useSocket.ts`
- **Workflow**: work on `claude/eager-greider` branch → merge to master → push
  - Worktree can't checkout master directly
  - Must: `cd "C:\Users\atsha\jwgame" && git merge claude/eager-greider && git push origin master`
- **node_modules**: Lives in main repo (`C:\Users\atsha\jwgame\node_modules`), NOT in worktree
  - Build/dev commands work from worktree because Vite resolves from project root

## Known Issues / Warnings
- CRLF warnings on git commit (Windows) — harmless
- Chunk size warning on build (~540KB) — framer-motion is the main contributor
- `ChatOverlay.tsx` still exists but is unused (replaced by GlobalChat) — can be removed later
- Copyright notice: "사용되는 모든 그림과 음악은 AI로 제작되었습니다"
- Myanmar/Thai character names (nameMy, nameTh) may not match 신세계역 — pending user verification
