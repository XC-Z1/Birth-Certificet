# বাংলাদেশ জন্ম নিবন্ধন তথ্য অনুসন্ধান (Bangladesh Birth Registration Information Search)

**Developer Name:** X C  
**Technology Stack:** React 19, TypeScript, Tailwind CSS, Vite, Express Proxy, Framer Motion

## Overview
A Government-Style Premium Responsive Web Application for searching and verifying birth registration information in Bangladesh using a 17-digit Birth Registration Number (BRN) and Date of Birth (DOB).

## Features
- **Security & Proxy Backend:** Shields the external API (`https://sbsakib.eu.cc/api/bard`) via a backend serverless/express proxy (`/api/verify`) with rate-limiting and timeout handling.
- **Dual View Layout:** Modern Government Card Grid View + Authentic Official Certificate View with Government emblem watermark & double borders.
- **Full Bangla & English Support:** Automatically presents all personal, parental, and registration office attributes in both languages.
- **Interactive Tools:**
  - 1-Click Copy for individual fields or full certificate summary
  - Certificate Print & PDF Export layout (`Ctrl + P`)
  - Verification QR Code Generator
  - Local Storage History & Saved Favorites
  - Keyboard Shortcuts (`Ctrl + K` focus)
  - Light / Dark / Auto Theme mode switcher

## Deployment on Vercel
1. Import repository on Vercel.
2. Serverless function in `api/verify.ts` handles API proxy requests seamlessly without CORS errors.
3. Configure environment variable: `BIRTH_REG_API_URL=https://sbsakib.eu.cc/api/bard`

## Development
```bash
npm install
npm run dev
```
