# Lyzr DealIQ

AI-powered deal intake and opportunity analysis tool.

## Features

- Interactive deal submission form with auto-save
- AI-generated opportunity analysis
- Credit usage forecasting
- Business metrics calculator
- Completely standalone - no backend required!

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Local Storage for data persistence

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

The built files will be in the `dist` folder.

## Deployment

This app is completely static and requires no backend or environment variables. Simply deploy the `dist` folder to any static hosting service:

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. No environment variables needed!

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project to Vercel
3. Build command: `npm run build`
4. Output directory: `dist`
5. No environment variables needed!

### Deploy to GitHub Pages

1. Run `npm run build`
2. Push the `dist` folder to the `gh-pages` branch
3. Enable GitHub Pages in repository settings

## Data Storage

All data is stored locally in the browser using `localStorage`. No external database or API calls are made.

## License

MIT
