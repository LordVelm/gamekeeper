# Steam Backlog Organizer

Automatically categorizes your Steam game library into four collections:

- **Completed** - Games you've finished the main story/campaign
- **In Progress / Backlog** - Completable games you haven't finished yet
- **Endless** - Games with no real ending (multiplayer, sandbox, strategy, etc.)
- **Not a Game** - Demos, tools, utilities, soundtracks, etc.

Results are written directly to your Steam library as collections (synced across machines) and optionally exported as JSON.

## How It Works

Classification uses **rule-based logic** that analyzes your Steam data:

- **Steam Store data** — Game type (demo, tool, DLC), genres, categories (single-player, multiplayer)
- **Achievement data** — Story-completion achievement names, achievement percentage
- **Playtime** — Hours played relative to game type
- **14 priority rules** — Deterministic, auditable, no black boxes

No external AI or paid APIs needed beyond the free Steam Web API key.

## Requirements

- Windows 10/11 (macOS/Linux support planned)
- A [Steam Web API key](https://steamcommunity.com/dev/apikey) (free)
- Your Steam profile's game details set to **Public**
- Optional: ~2 GB disk space for local AI features (auto-downloaded on first use)

## Installation

Download the latest installer from [Releases](https://github.com/LordVelm/steam-backlog-organizer/releases).

Or build from source:

```bash
cd steam-backlog-organizer
npm install
cd app
npx tauri build
```

## Features

- **Modern desktop app** — Built with Tauri + React, dark Steam-inspired theme
- **No paid APIs** — Fully rule-based classification using Steam's own data
- **Saved classifications** — Results persist between runs. Only new games get classified
- **Manual overrides** — Fix any game the rules got wrong. Overrides always take priority
- **Cloud sync** — Collections sync across machines via Steam Cloud
- **Caching** — Library and store data cached locally to avoid redundant API calls
- **"What should I play next?"** — Chat panel with game recommendations (deterministic fallback or local AI)
- **AI ambiguity assistant** — For uncertain classifications, ask AI for a second opinion
- **Export** — Download your classifications as JSON for debugging or sharing

## Optional: Local AI

The app bundles a local AI engine for smarter game recommendations and classification second opinions. On first use, it downloads a small model (~2 GB) — no external software needed.

To set up: **Settings > AI Assistant > Download AI Model**

The AI is used for:
- **Game recommendations** — "What should I play next?" chat
- **Ambiguity resolution** — Second opinions on uncertain classifications

The AI is **never** used for core classification — rules stay canonical. GPU acceleration is automatic if you have an NVIDIA GPU.

## Important Notes

- **Steam must be closed** when writing collections
- **API keys are stored locally** in `%APPDATA%/SteamBacklogOrganizer/config/settings.json`
- **All data stays on your machine** — no cloud services, no telemetry

## Development Log

### v0.1 — Initial release
- AI-only classification using Claude API

### v1.0 — Hybrid rewrite
- Rule-based engine for most games, AI for ambiguous remainder

### v2.0 — Pure rules
- Removed AI dependency entirely, expanded to 14 rules, CustomTkinter GUI

### v3.0 — Full rebuild (current)
- **Complete rewrite** — Tauri v2 + React 19 + Rust backend
- **Single binary** — No Python runtime needed
- **Modern UI** — Dark Steam-themed design with card grid, animations, search/filter
- **Rust classifier** — All 14 rules ported with 100% parity against Python (verified with 569-game test suite)
- **Optional local AI** — Bundled llama-server with auto-download, GPU acceleration, no external dependency
- **Chat panel** — "What should I play next?" with retrieve-then-rank
- **Settings** — Steam config, AI setup + GPU toggle, JSON export, all in one panel

## Architecture

See [`CLAUDE.md`](./CLAUDE.md) for architecture details, build plan, and parity testing strategy.

## Feedback & Support

- **Bug reports & feature requests** — [Open an issue](https://github.com/LordVelm/steam-backlog-organizer/issues)
- **Support the project** — [Buy Me a Coffee](https://buymeacoffee.com/lordvelm)
