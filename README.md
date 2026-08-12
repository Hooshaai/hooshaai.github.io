# 🧠 Hoosha AI Platform Ecosystem

[![Substack](https://img.shields.io/badge/Substack-Hoosha_AI_Journal-FF6719?style=for-the-badge&logo=substack&logoColor=white)](https://hooshaai.substack.com)
[![HuggingFace Space](https://img.shields.io/badge/HuggingFace-tahamajs%2FBlog-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co/spaces/tahamajs/Blog)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-hooshaai.github.io-222222?style=for-the-badge&logo=github&logoColor=white)](https://hooshaai.github.io)

**Hoosha AI** is an independent AI research lab and systems engineering initiative dedicated to advancing continuous-time generative modeling (Continuous Flow Matching), differential attention mechanisms, and scalable GPU compute infrastructure.

---

## 📂 Ecosystem Directory Structure

```text
hooshaai.github.io/
├── index.html                   # Main Landing Page, Research Feed & Tech Ecosystem
├── platform.html                # Interactive Research Dashboard & Model Sandboxes
├── style.css                    # Glassmorphic Cyber Design System & Token Styles
├── script.js                    # Web Audio Synth, Neural Canvas & Spotlight Search (Cmd+K)
├── fetch_substack_articles.py   # Substack RSS Automated Fetcher & Parser
├── articles.json                # Parsed Substack Articles Database
│
├── backend/                     # 🐍 Production Django REST Framework API App
│   ├── manage.py                # Django CLI Management Script
│   ├── db.sqlite3               # Pre-seeded SQLite Database
│   ├── requirements.txt         # Python Backend Dependencies
│   ├── Dockerfile               # Production Docker Container Specification
│   ├── docker-compose.yml       # Django + Postgres + Redis + Celery Services
│   ├── hoosha_backend/          # Django Project Configuration (Settings, URLs, WSGI)
│   └── api/                     # REST API App (Models, Views, Serializers, Tests, Commands)
│
├── mobile_app/                  # 📱 React Native (Expo) Android Mobile Application
│   ├── App.js                   # Navigation & Tab Bar Container
│   ├── app.json                 # Android Package Specification (ai.hoosha.app)
│   ├── eas.json                 # Expo Application Services Build Profiles
│   ├── package.json             # Mobile Dependencies & Scripts
│   ├── build_apk.sh             # Standalone Android Release APK Build Script
│   └── src/components/          # Native Views (ResearchFeed, Sandbox, ModelZoo, Profile)
│
└── hf_space_blog/               # 🔬 Hugging Face Static Space Mirror (tahamajs/Blog)
    ├── README.md                # HF Space Metadata Configuration
    └── index.html               # HF Space Mirror
```

---

## ⚡ Quick Start Commands

### 1. Web Application (Static Frontend)
Simply open `index.html` or `platform.html` in any browser, or serve locally via Python:
```bash
python3 -m http.server 8000
```
Visit `http://localhost:8000` or `http://localhost:8000/platform.html`.

### 2. Django REST Framework Backend (`/backend/`)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data      # Seed default admin & research papers
python manage.py runserver 8000
```
- **API Base**: `http://localhost:8000/api/v1/`
- **Swagger Docs**: `http://localhost:8000/api/v1/docs/`
- **Admin Panel**: `http://localhost:8000/admin/` (`admin` / `admin12345`)

### 3. React Native Android Mobile Application (`/mobile_app/`)
```bash
cd mobile_app
npm install
npx expo start              # Start Expo Dev Server
npx expo run:android        # Run on Android Emulator/Device
./build_apk.sh              # Build Standalone Release APK
```

---

## 🌟 Key Platform Features

1. **Continuous Flow Matching (CFM) Visualizer**: Interactive 2D Vector Field canvas for solving ODE velocity trajectories $v_t(x) = x_1 - x_0$.
2. **LLM Epistemic Uncertainty Probe**: Real-time logit entropy $H(p)$ computation and selective RAG decision gating.
3. **Spotlight Command Palette (`Cmd + K`)**: Instant search across 20 Substack papers, 6 `.safetensors` model checkpoints, 4 CUDA kernels, and repos.
4. **CUDA & Triton Playground**: JIT compiler profiler displaying PTX assembly, TFLOPS, latency, and HBM3 bandwidth.
5. **8x H100 GPU Cluster Telemetry**: Live telemetry matrix tracking VRAM usage, temperature meters, and NVLink inter-GPU throughput.
6. **Article Publisher Studio**: Markdown & KaTeX LaTeX paper editor with live side-by-side preview and single-click publishing.

---

<div align="center">
  <sub>© 2026 Hoosha AI Research Lab · Building Synthetic Cognitive Architectures</sub>
</div>
