# Nite Site

A super simple React website for a software company with dynamic moon phase display.

## Features

- Minimalist design with dark theme
- Responsive layout for mobile and desktop
- Dynamic moon phase icon based on actual lunar phases
- Uses Mona Sans and BN Anora fonts
- Static site generation for easy deployment

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add the BN Anora font file:
   - Place `BN-Anora.woff2` in the `/assets` directory
   - The font is already referenced in the HTML

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment

The built files will be in the `dist` directory. You can deploy this to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Moon Phase Data

The website uses the `phases.json` file to determine the current moon phase based on the user's visit date. The data includes moon phases for Littleton, Colorado, USA from 2025-2026.

## Project Structure

```
nitesite/
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Component styles
│   ├── main.jsx         # React entry point
│   ├── index.css        # Global styles
│   └── moonPhase.js     # Moon phase calculation logic
├── assets/
│   └── BN-Anora.woff2   # Custom font file
├── phases.json          # Moon phase data
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```
