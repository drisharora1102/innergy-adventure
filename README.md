# Innergy Adventure

A mobile-first Innergy wellness catch game built with React, TypeScript, Vite, TailwindCSS, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL on desktop or iPad Safari in landscape mode.

## Features

- 30-second catch game with touch and mouse basket controls
- Healthy and unhealthy falling objects with scoring, lives, effects, and sound toggle
- Difficulty ramps every 10 seconds
- Power-ups: double points, shield, freeze time, magnet, and rainbow mode
- Results screen with wellness score, personalized recommendations, QR placeholder, and a shared top-10 leaderboard

## Shared leaderboard

The leaderboard uses Firebase Firestore so scores persist and stay synchronized across devices. Copy `.env.example` to `.env`, add your Firebase web app values, and deploy `firestore.rules` to your Firebase project.

Each player name has one leaderboard record. A new score replaces it only when it is higher than that player's previous best.
