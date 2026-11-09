# Wheelhaus — Production Mobile Apps & Web Portal Guide

This guide details how to build, test, and publish both native mobile applications to the **Google Play Store** and **Apple App Store**, as well as deploy the **Backend API** and **Admin Web Dashboard**.

---

## 🏗️ Architecture Overview

The codebase is structured as a production multi-app workspace:

```
C:\Weelhaus\
├── apps\
│   ├── customer-mobile\       # React Native / Expo app for vehicle owners
│   ├── partner-mobile\        # React Native / Expo app for car wash centres & drivers
│   ├── admin-web\             # Desktop/tablet operations web portal
│   └── backend-api\           # Express REST & SSE Real-time server
├── packages\
│   └── shared\                # Shared data contracts, types & status state-machines
└── package.json               # Monorepo workspace orchestration
```

---

## 📱 1. Publishing Mobile Apps to Play Store & App Store

Both `customer-mobile` and `partner-mobile` are built with **Expo & React Native** and come pre-configured with:
- Dedicated bundle identifiers (`com.wheelhaus.customer` and `com.wheelhaus.partner`).
- App icons, splash screens, and Android adaptive icons.
- Production EAS build profiles (`eas.json`) targeting Android `.aab` (Android App Bundle) and iOS `.ipa`.

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### Step 2: Build Android APK for Immediate Device Testing
To test the real `.apk` on any Android device directly:
```bash
# For Customer App:
cd apps/customer-mobile
eas build -p android --profile preview

# For Partner App:
cd apps/partner-mobile
eas build -p android --profile preview
```
EAS outputs a QR code and a direct download link for the installable `.apk`.

### Step 3: Build & Publish for Google Play Store (Production `.aab`)
Google Play requires `.aab` format:
```bash
# Build the production bundle:
eas build -p android --profile production

# Submit directly to Google Play Console:
eas submit -p android
```

### Step 4: Build & Publish for Apple App Store / TestFlight
```bash
# Build production iOS bundle:
eas build -p ios --profile production

# Submit directly to App Store Connect:
eas submit -p ios
```

---

## 💻 2. Running & Deploying the Admin Web Portal

The **Admin Web Portal** (`apps/admin-web`) is built with React, Vite, and Tailwind CSS.

### Running Locally:
```bash
cd apps/admin-web
npm run dev
```
Accessible at: `http://localhost:5174`

### Deploying to Production:
```bash
cd apps/admin-web
npm run build
```
The output in `apps/admin-web/dist/` can be deployed instantly to Vercel, Netlify, or AWS S3 + CloudFront.

---

## ⚙️ 3. Running & Deploying the Backend API

The **Backend API** (`apps/backend-api`) manages authentication, dispatch queues, live SSE telemetry, and partner commission payouts.

### Running Locally:
```bash
cd apps/backend-api
npx tsx src/server.ts
```
Server listens on: `http://localhost:4000`

### Production Deployment:
Can be deployed as a Docker container, VPS, or cloud container on Railway, Render, Fly.io, or AWS ECS.
Environment variables:
- `PORT=4000`
- `CORS_ORIGIN=*`
- `NODE_ENV=production`

---

## ⚡ 4. Monorepo Scripts Reference

From the root directory (`C:\Weelhaus\`):
- `npm run start:backend` — Starts the unified backend server.
- `npm run start:customer` — Launches the customer mobile app in Expo developer mode.
- `npm run start:partner` — Launches the partner mobile app in Expo developer mode.
- `npm run start:admin` — Runs the admin operations portal.
