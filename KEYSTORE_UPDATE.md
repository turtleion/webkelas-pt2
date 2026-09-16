# Keystore Update - 2026-09-15

## New Debug Keystore

Generated keystore baru karena yang lama in-use.

**Location**: `android/keystores/debug.keystore`

**Credentials**:
- Alias: `androiddebugkey`
- Store password: `android`
- Key password: `android`

**Fingerprints**:
```
SHA-1: DA:C0:AC:2A:84:72:05:4C:5A:E8:62:2A:B1:96:CE:2A:8D:D8:A4:1C
SHA-256: 70:F3:FD:74:0A:DF:16:4E:EF:49:C5:39:FF:AC:06:F4:CE:97:62:13:F8:7D:47:A7:B7:77:C1:49:00:75:8A:98
```

## Changes Made

1. ✓ Generated new keystore: `android/keystores/debug.keystore`
2. ✓ Updated `android/app/build.gradle`:
   - Added `debug` signingConfig pointing to new keystore
   - Debug builds now explicitly use this keystore
3. ✓ Added keystore documentation: `android/keystores/README.md`
4. ✓ Updated `.gitignore` to exclude `*.keystore` files
5. ✓ Tested build: `./gradlew assembleDebug` → SUCCESS
6. ✓ APK output: `android/app/build/outputs/apk/debug/app-debug.apk` (6.7 MB)

## Google Cloud Console Setup Required

Update OAuth 2.0 Client ID dengan SHA-1 fingerprint baru:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select OAuth client: `1080188252070-1b1u33aja7kfplrtpjfm443lavvfvbn1.apps.googleusercontent.com`
3. Add/Replace SHA-1: `DA:C0:AC:2A:84:72:05:4C:5A:E8:62:2A:B1:96:CE:2A:8D:D8:A4:1C`
4. Package name: `ts.arsipkelas.xtkj1`
5. Save

**Important**: Google Sign-In tidak akan jalan sampai SHA-1 baru didaftarkan di OAuth client.

## Build Commands

```bash
# Set JDK 21 (required for Gradle 8.14.3)
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk

# Build debug APK
cd android
./gradlew assembleDebug --no-daemon

# Output: app/build/outputs/apk/debug/app-debug.apk
```

## Old SHA-1 (deprecated)
```
B1:AF:07:13:40:2B:A5:60:79:C0:3F:58:60:82:C8:0B:9D:44:36:DF
```
