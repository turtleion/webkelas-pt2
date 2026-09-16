# Test APK - Build 2026-09-16

## APK Location
`android/app/build/outputs/apk/debug/app-debug.apk` (6.7 MB)

## Configuration
- **Keystore**: `android/keystores/debug.keystore`
- **SHA-1**: `DA:C0:AC:2A:84:72:05:4C:5A:E8:62:2A:B1:96:CE:2A:8D:D8:A4:1C`
- **Package**: `ts.arsipkelas.xtkj1`
- **Google Project**: arsip-kelas (864424756250)
- **Web OAuth Client**: `864424756250-hjb07p8n7cnke98bqtgtqu3c8d3e087r.apps.googleusercontent.com`

## Google Cloud Console Setup (REQUIRED)
1. https://console.cloud.google.com/apis/credentials?project=arsip-kelas
2. Add SHA-1 to OAuth client: `DA:C0:AC:2A:84:72:05:4C:5A:E8:62:2A:B1:96:CE:2A:8D:D8:A4:1C`
3. Package name: `ts.arsipkelas.xtkj1`

## Install to Device
```bash
# Connect device via USB, enable USB debugging
adb devices

# Install (replace existing)
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# View logs
adb logcat | grep -E "Capacitor|GoogleSignIn|FCM"
```

## Test Checklist
- [ ] App launches
- [ ] Google Sign-In works (needs OAuth SHA-1 added)
- [ ] FCM push notifications (after login)
- [ ] Navigation works
- [ ] Data loads from Supabase
