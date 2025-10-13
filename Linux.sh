#!/bin/bash

# Usage: build-apk.sh [debug|release]
BUILD_TYPE="$1"
if [ -z "$BUILD_TYPE" ]; then
  BUILD_TYPE=debug
fi


echo "=== PeakIt Android APK build ($BUILD_TYPE) ==="


# Prefer Bun, fallback to npm
if command -v bun >/dev/null 2>&1; then
  PM=bun
elif command -v npm >/dev/null 2>&1; then
  PM=npm
else
  echo "ERROR: Neither Bun nor npm found. Install Bun or Node.js/npm."
  exit 1
fi


# Require Java 11+
if ! command -v java >/dev/null 2>&1; then
  echo "ERROR: Java not found. Install JDK 17 and set JAVA_HOME/Path."
  exit 1
fi

JAVA_VER=$(java -XshowSettings:properties -version 2>&1 | grep "java.specification.version" | awk '{print $2}' | tr -d ' ')
JAVAMAJOR=0

if [[ $JAVA_VER == 1.* ]]; then
  # For java versions like 1.8, 1.11 etc.
  JAVAMAJOR=$(echo $JAVA_VER | cut -d . -f 2)
else
  JAVAMAJOR=$(echo $JAVA_VER | cut -d . -f 1)
fi

if (( JAVAMAJOR < 11 )); then
  echo "ERROR: Java $JAVA_VER detected. Java 11+ required."
  exit 1
fi


pushd "$PWD"


if [ ! -d "frontend" ]; then
  echo "ERROR: Cannot find frontend directory next to this script."
  popd
  exit 1
fi


echo "[1/4] Building web assets..."
cd frontend
if [ "$PM" == "bun" ]; then
  bun run build || { echo "ERROR: Web build failed."; popd; exit 1; }
else
  npm run build --silent || { echo "ERROR: Web build failed."; popd; exit 1; }
fi


echo "[2/4] Syncing Capacitor (android)..."
if [ "$PM" == "bun" ]; then
  bunx cap sync android || { echo "ERROR: Capacitor sync failed."; popd; exit 1; }
else
  npx --yes cap sync android || { echo "ERROR: Capacitor sync failed."; popd; exit 1; }
fi


echo "[3/4] Running Gradle build ($BUILD_TYPE)..."
cd android
if [ "$BUILD_TYPE" == "release" ]; then
  ./gradlew assembleRelease || { echo "ERROR: Gradle build failed."; popd; exit 1; }
else
  ./gradlew assembleDebug || { echo "ERROR: Gradle build failed."; popd; exit 1; }
fi


echo "[4/4] Locating APK..."
if [ "$BUILD_TYPE" == "release" ]; then
  APKPATH="app/build/outputs/apk/release/app-release.apk"
else
  APKPATH="app/build/outputs/apk/debug/app-debug.apk"
fi

if [ -f "$APKPATH" ]; then
  APKABS=$(readlink -f "$APKPATH")
  echo "SUCCESS: APK created at: $APKABS"
  popd
  exit 0
else
  echo "WARNING: Build finished but APK not found at expected path: $(pwd)/$APKPATH"
  popd
  exit 0
fi
