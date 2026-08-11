#!/usr/bin/env bash

# ==============================================================================
# Hoosha AI Mobile App - Production Release Android APK Build Script
# ==============================================================================

set -e

# Terminal Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m' # No Color

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo -e "${CYAN}${BOLD}==============================================================================${NC}"
echo -e "${CYAN}${BOLD}       Hoosha AI Mobile - Production Release Android APK Builder              ${NC}"
echo -e "${CYAN}${BOLD}==============================================================================${NC}"

# 1. Environment & Tools Verification
echo -e "\n${YELLOW}[1/5] Verifying environment & build prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed or not available in PATH.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}[ERROR] npm is not installed or not available in PATH.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm version: $(npm -v)${NC}"

# 2. Dependencies Check
echo -e "\n${YELLOW}[2/5] Checking node_modules and project dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${CYAN}Installing npm dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✓ node_modules found.${NC}"
fi

# 3. Clean Build Workspace
echo -e "\n${YELLOW}[3/5] Cleaning previous build artifacts and caches...${NC}"
rm -rf android/app/build android/build .expo/web .expo/android 2>/dev/null || true
echo -e "${GREEN}✓ Build workspace cleaned.${NC}"

# 4. Generate Android Native Code (Prebuild) if needed
echo -e "\n${YELLOW}[4/5] Preparing Expo prebuild / Android project structure...${NC}"
if [ ! -d "android" ]; then
    echo -e "${CYAN}Generating native Android folder via Expo prebuild...${NC}"
    npx expo prebuild --platform android --no-install
    echo -e "${GREEN}✓ Expo prebuild completed.${NC}"
else
    echo -e "${GREEN}✓ Android project directory already initialized.${NC}"
fi

# 5. Build Android Release APK
echo -e "\n${YELLOW}[5/5] Compiling Production Release APK...${NC}"

if [ -f "android/gradlew" ]; then
    echo -e "${CYAN}Executing Gradle assembleRelease...${NC}"
    cd android
    chmod +x gradlew
    ./gradlew assembleRelease --no-daemon
    cd ..
    
    APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
    if [ ! -f "$APK_PATH" ]; then
        # Check alternative output path for unsigned apk
        APK_PATH=$(find android/app/build/outputs/apk -name "*.apk" 2>/dev/null | head -n 1)
    fi
else
    echo -e "${CYAN}Executing Expo Local EAS Build...${NC}"
    npx eas-cli build --platform android --local --profile release --output build-release.apk || npx expo run:android --variant release
    APK_PATH="build-release.apk"
fi

# Final Verification
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo -e "\n${GREEN}${BOLD}==============================================================================${NC}"
    echo -e "${GREEN}${BOLD} SUCCESS! Release APK built successfully.                                    ${NC}"
    echo -e "${GREEN}${BOLD} Output Path: ${PROJECT_DIR}/${APK_PATH}${NC}"
    echo -e "${GREEN}${BOLD} File Size  : ${APK_SIZE}${NC}"
    echo -e "${GREEN}${BOLD}==============================================================================${NC}"
else
    echo -e "\n${YELLOW}Build command finished. If building on EAS cloud, check EAS dashboard.${NC}"
    echo -e "${GREEN}${BOLD}Build process completed.${NC}"
fi

exit 0
