@echo off
REM PuranBazar Android Keystore Generator for Windows
echo =========================================================
echo Generating Release Keystore for PuranBazar Android App
echo =========================================================

set KEYSTORE_PATH=app\puranbazar-release-key.jks
set KEY_ALIAS=puranbazar
set STORE_PASS=puranbazar2026

keytool -genkeypair -v -keystore %KEYSTORE_PATH% -alias %KEY_ALIAS% -keyalg RSA -keysize 2048 -validity 10000 -storepass %STORE_PASS% -keypass %STORE_PASS% -dname "CN=PuranBazar Team, OU=Mobile Division, O=PuranBazar Marketplace, L=Dhaka, ST=Dhaka, C=BD"

echo.
echo Keystore generated successfully at: %KEYSTORE_PATH%
echo Keystore Password: %STORE_PASS%
echo Key Alias: %KEY_ALIAS%
echo.
echo Now run:
echo   gradlew.bat bundleRelease
echo This will generate the upload-ready Play Store bundle (.aab) at:
echo   app\build\outputs\bundle\release\app-release.aab
pause
