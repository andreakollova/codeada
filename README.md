# CodeByte

Mobilná (web) appka na učenie programovania v štýle Duolinga. Maskot: robot Byte.

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Zustand (state management + localStorage persistence)
- Framer Motion (animácie)
- Supabase (auth + progress sync — voliteľné)

## Development
```bash
npm run dev   # http://localhost:3002
```

## Pages
- `/` — Domáca obrazovka s kľukatou cestou
- `/lesson/[id]` — Lekcia (explain, mcq, fill, write cvičenia)
- `/result` — Výsledková obrazovka s oslavujúcim Byteom
- `/byte-showcase` — Všetky stavy maskota Byte

## Supabase (voliteľné)
Doplň `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
Spusti `supabase-schema.sql` v Supabase SQL Editore.

## Vercel deploy
```bash
vercel --prod
```
Nezabudni pridať env vars v Vercel dashboarde.
