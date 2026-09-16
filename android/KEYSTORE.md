# Android Debug Keystore

**Location**: `android/keystores/debug.keystore`

## Credentials
- Alias: `androiddebugkey`
- Store password: `android`
- Key password: `android`

## SHA-1 Fingerprint (untuk Google OAuth)
```
DA:C0:AC:2A:84:72:05:4C:5A:E8:62:2A:B1:96:CE:2A:8D:D8:A4:1C
```

## Google Cloud Console Setup
1. https://console.cloud.google.com/apis/credentials
2. OAuth 2.0 Client ID: `1080188252070-1b1u33aja7kfplrtpjfm443lavvfvbn1.apps.googleusercontent.com`
3. Add SHA-1: `DA:C0:AC:2A:84:72:05:4C:5A:E8:62:2A:B1:96:CE:2A:8D:D8:A4:1C`
4. Package name: `ts.arsipkelas.xtkj1`

## Build Command
```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
./gradlew assembleDebug --no-daemon
# Output: app/build/outputs/apk/debug/app-debug.apk
```

Generated: 2026-09-16
