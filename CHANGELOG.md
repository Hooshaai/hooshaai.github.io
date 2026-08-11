# Changelog — Hoosha AI Research Platform

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [v2.0.0] — 2026-08-12 — Ultimate Ecosystem Release

### 🚀 Added
- **Multi-Page Web Architecture**: 7 fully linked HTML pages
  - `index.html` — Landing page with neural canvas hero
  - `research.html` — Research journal with 20 Substack dispatches + TTS Audio Podcast Player
  - `ecosystem.html` — Tech stack brand cards (PyTorch, CUDA, Triton, HuggingFace, etc.)
  - `models.html` — Model Zoo checkpoint vault with `.safetensors` downloads
  - `labs.html` — Interactive AI Learning Labs (CFM, GRPO, Differential Attention, RAG Probe)
  - `platform.html` — CUDA JIT profiler, GPU telemetry, Article Publisher Studio
  - `admin.html` — Executive Admin Control Center
- **Web Audio TTS Podcast Player** — Listen to all 20 Substack essays in browser
- **BibTeX Citation Generator** — `@article{majlesi2026...}` one-click citations for all papers
- **PDF Export** — Printable scientific manuscript export with KaTeX formulas
- **Spotlight Search (⌘K)** — Instant search across 33 items (articles, models, kernels, repos)
- **KaTeX Math Rendering** — Full LaTeX math display in article reader modals
- **Rich Article Content** — 600–800 word per-category technical essays with benchmark tables

### 🐍 Backend (`/backend/`)
- Django REST Framework API with JWT authentication
- Endpoints: auth, articles, checkpoints, CUDA compile, CFM solve, RAG probe
- Swagger OpenAPI docs at `/api/v1/docs/`
- `sync_substack` management command
- Docker + PostgreSQL + Redis + Celery production stack
- 10/10 unit tests passing

### 📱 Mobile App (`/mobile_app/`)
- React Native Expo app (`ai.hoosha.app`)
- Research Feed, AI Sandboxes, Model Zoo, Profile tabs
- `ArticleDetailModal` with KaTeX math rendering
- `AsyncStorage` offline caching for 100% offline use
- `build_apk.sh` release build script

### 🔄 GitHub Workflows
- `deploy.yml` — HTML validation + GitHub Pages deployment + versioned releases
- `sync-substack.yml` — Automatic RSS sync every 6 hours
- `backend-ci.yml` — Django tests + flake8 + Docker build
- `mobile-ci.yml` — Expo validation + app.json check

### 🛠️ Fixed
- KaTeX MathML duplicate text on clipboard copy
- `articleAuthorRole` showing `undefined` in reader modal
- Article modal structure unified across all pages

---

## [v1.0.0] — 2026-08-11 — Initial Release

### Added
- Initial Hoosha AI website with `index.html`
- Substack RSS auto-fetcher (`fetch_substack_articles.py`)
- Basic platform dashboard (`platform.html`)
- Admin panel (`admin.html`)
- Django backend scaffolding
- React Native mobile app foundation
