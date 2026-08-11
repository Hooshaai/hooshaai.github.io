# Hoosha AI Mobile Application (React Native / Expo)

A minimal React Native Android application for **Hoosha AI**, built with Expo. The application provides access to frontier AI research papers, interactive architecture sandboxes, open weights model explorer, and fellow profile management.

---

## 📱 Features & App Architecture

The app is configured with **Tab Navigation** across 4 core screens:

1. **Research Feed (`src/components/ResearchFeed.js`)**:
   - Live research paper feed covering Linear Attention, State Space Models, and Transformer architecture breakthroughs.
   - Search bar and topic filter pills (*All, Linear Attention, State Space, Hardware, Transformers, Multimodal*).
   - Interactive paper bookmarks, like counter, share actions, and modal abstracts with key takeaways.

2. **AI Sandboxes (`src/components/SandboxView.js`)**:
   - **Attention Complexity Simulator**: Interactive slider for Sequence Length (up to 128k tokens) & Batch Size, visualizing VRAM & FLOPs savings (\(O(N^2)\) vs \(O(N)\)).
   - **FLOPs & VRAM Hardware Estimator**: Parameter scaling (7B to 180B) and Quantization mode (FP16, INT8, INT4) calculator with GPU recommendations.
   - **Neural Code Interpreter**: Live compilation simulator for Triton Linear Attention & Mamba Selective Scan kernels.

3. **Model Zoo (`src/components/ModelZooView.js`)**:
   - Open weights model explorer (*Hoosha-Linear-70B*, *Hoosha-Flash-8B*, *Mamba-Hoosha-14B*, *Hoosha-Vision-v2*).
   - Modality filters, benchmark badges (MMLU, GSM8K, Context Window), copy HuggingFace model IDs, and architecture spec modal.

4. **Profile & Settings (`src/components/ProfileView.js`)**:
   - Hoosha Core Fellow profile with GPU compute stats (GPU hours, inferences, saved papers).
   - Secret API key management (view, copy, regenerate).
   - App preferences toggles and Android build metadata verification card (`ai.hoosha.app`).

---

## 📁 Directory Structure

```
mobile_app/
├── App.js                         # Root application with Tab Navigation & SafeAreaProvider
├── app.json                       # Expo Android package config (ai.hoosha.app)
├── eas.json                       # EAS Build profile configuration (APK/AAB builds)
├── package.json                   # Dependencies & build scripts
├── README.md                      # Project setup & release APK documentation
├── assets/                        # App icons & splash images
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── src/
    └── components/
        ├── ResearchFeed.js        # Tab 1: Research Feed & Paper Abstract Modal
        ├── SandboxView.js         # Tab 2: Interactive Complexity & Hardware Simulators
        ├── ModelZooView.js        # Tab 3: Open Weights Model Explorer & Specs
        └── ProfileView.js         # Tab 4: Fellow Profile & Settings
```

---

## 🛠️ Prerequisites

Before running or building the app, ensure you have the following installed:

- **Node.js**: Version `>= 18.0.0`
- **Expo CLI**: `npm install -g expo-cli` or use `npx expo`
- **EAS CLI** (for cloud APK builds): `npm install -g eas-cli`
- **Android Studio & SDK** (for local Android emulator / native builds): Android SDK 34 target configured.

---

## 🚀 Quick Start (Development Mode)

1. **Install Dependencies**:
   ```bash
   cd mobile_app
   npm install
   ```

2. **Start Expo Development Server**:
   ```bash
   npx expo start
   ```

3. **Run on Android Emulator / Physical Device**:
   - Press `a` in the Expo terminal to launch on a connected Android device or emulator.
   - Or scan the QR code using the **Expo Go** app on Android.

---

## 🤖 Running Native Android Build (`npx expo run:android`)

To prebuild the native Android project and run directly on an attached Android device or Android Studio emulator:

```bash
npx expo run:android
```

This command will:
- Prebuild the `android/` native directory with package name `ai.hoosha.app`.
- Compile native Java/Kotlin code and launch the app directly.

---

## 📦 Release Build & APK Generation

You can build a standalone **Release APK** for distribution using either **EAS Cloud Build** or **Local Native Release Build**.

### Method 1: EAS Build (Recommended for Release APK)

[EAS (Expo Application Services)](https://expo.dev/eas) provides automated cloud builds for standalone Android APKs.

1. **Install EAS CLI and Login**:
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Generate Release APK**:
   ```bash
   eas build -p android --profile preview
   ```
   *Note: Using `--profile preview` produces a standalone `.apk` file ready to install on any Android device.*

3. **Generate Google Play Store AAB (App Bundle)**:
   ```bash
   eas build -p android --profile production
   ```

When the build completes, EAS provides a direct download URL for your standalone `ai.hoosha.app.apk`.

---

### Method 2: Local Native Release APK Build

To generate a signed Release APK locally using standard Gradle tooling:

1. **Execute Release Build**:
   ```bash
   npx expo run:android --variant release
   ```

2. **Locate Generated APK**:
   After the Gradle build completes, your standalone APK will be located at:
   ```
   mobile_app/android/app/build/outputs/apk/release/app-release.apk
   ```

---

## ⚙️ Android Configuration Summary (`app.json`)

```json
{
  "expo": {
    "name": "Hoosha AI",
    "slug": "hoosha-ai",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "dark",
    "android": {
      "package": "ai.hoosha.app",
      "versionCode": 1,
      "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"]
    }
  }
}
```

---

## 📄 License

Copyright © 2026 **Hoosha AI**. All rights reserved.
