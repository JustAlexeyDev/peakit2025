@echo off
setlocal

rem Usage: build-apk.bat [debug|release]
set BUILD_TYPE=%1
if "%BUILD_TYPE%"=="" set BUILD_TYPE=debug

echo === PeakIt Android APK build (%BUILD_TYPE%) ===

rem Prefer Bun, fallback to npm
where bun >nul 2>nul
if %errorlevel%==0 (
  set PM=bun
) else (
  where npm >nul 2>nul
  if %errorlevel%==0 (
    set PM=npm
  ) else (
    echo ERROR: Neither Bun nor npm found. Install Bun or Node.js/npm.
    exit /b 1
  )
)

rem Require Java 11+
where java >nul 2>nul || (
  echo ERROR: Java not found. Install JDK 17 and set JAVA_HOME/Path.
  exit /b 1
)
for /f "tokens=2 delims==" %%v in ('java -XshowSettings:properties -version 2^>^&1 ^| findstr /i "java.specification.version"') do set JAVAVER=%%v
set JAVAVER=%JAVAVER: =%
set JAVAMAJOR=
if "%JAVAVER:~,2%"=="1." (
  for /f "tokens=2 delims=." %%m in ("%JAVAVER%") do set JAVAMAJOR=%%m
) else (
  for /f "tokens=1 delims=." %%m in ("%JAVAVER%") do set JAVAMAJOR=%%m
)
for /f "delims=" %%a in ('powershell -NoProfile -Command "[int]'%JAVAMAJOR%' -ge 11"') do set OKJAVA=%%a
if /i not "%OKJAVA%"=="True" (
  echo ERROR: Java %JAVAMAJOR% detected. Java 11+ required.
  exit /b 1
)

pushd %~dp0

if not exist frontend (
  echo ERROR: Cannot find frontend directory next to this script.
  popd & exit /b 1
)

echo [1/4] Building web assets...
cd frontend
if "%PM%"=="bun" (
  call bun run build || (echo ERROR: Web build failed.& popd & exit /b 1)
) else (
  call npm run build --silent || (echo ERROR: Web build failed.& popd & exit /b 1)
)

echo [2/4] Syncing Capacitor (android)...
if "%PM%"=="bun" (
  call bunx cap sync android || (echo ERROR: Capacitor sync failed.& popd & exit /b 1)
) else (
  call npx --yes cap sync android || (echo ERROR: Capacitor sync failed.& popd & exit /b 1)
)

echo [3/4] Running Gradle build (%BUILD_TYPE%)...
cd android
if /i "%BUILD_TYPE%"=="release" (
  call gradlew.bat assembleRelease || (echo ERROR: Gradle build failed.& popd & exit /b 1)
) else (
  call gradlew.bat assembleDebug || (echo ERROR: Gradle build failed.& popd & exit /b 1)
)

echo [4/4] Locating APK...
if /i "%BUILD_TYPE%"=="release" (
  set APKPATH=app\build\outputs\apk\release\app-release.apk
) else (
  set APKPATH=app\build\outputs\apk\debug\app-debug.apk
)

if exist "%APKPATH%" (
  for %%F in ("%APKPATH%") do set APKABS=%%~fF
  echo SUCCESS: APK created at: %APKABS%
  popd & endlocal & exit /b 0
) else (
  echo WARNING: Build finished but APK not found at expected path: %CD%\%APKPATH%
  popd & endlocal & exit /b 0
)


