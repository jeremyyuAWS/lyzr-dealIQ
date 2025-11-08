# Deployment Guide

This application can be deployed with or without a database, making it flexible for demos and production use.

## Demo Mode (No Database Required)

The app works fully without any database configuration. All demo scenarios and form submissions are handled in-memory.

### Quick Deploy to Netlify/GitHub Pages

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to:
   - **Netlify**: Drag and drop the `dist` folder to Netlify
   - **GitHub Pages**: Push the `dist` folder to your GitHub Pages repo
   - **Vercel**: Deploy the project root and it will auto-detect Vite

3. **No environment variables needed** for demo mode!

## Production Mode (With Database)

To enable real data persistence via Supabase:

1. **Set up Supabase:**
   - Create a Supabase project at https://supabase.com
   - Run the migrations in `supabase/migrations/` to create tables

2. **Configure environment variables:**
   Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Build and deploy:**
   ```bash
   npm run build
   ```

4. **Set environment variables** in your hosting platform (Netlify/Vercel):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Data Architecture

All demo data is stored in modular files under `src/data/`:

- **`scenarios.ts`**: 6 pre-configured demo scenarios with realistic business data
- Each scenario includes complete deal information and attachments

The app automatically detects if database credentials are present:
- **With credentials**: Saves real submissions to Supabase
- **Without credentials**: Uses demo mode (perfect for showcasing)

## Features Available in Demo Mode

✅ All 6 interactive demo scenarios
✅ Auto-fill animations with adjustable speed
✅ Full form validation
✅ AI-powered analysis generation
✅ Credit consumption calculator
✅ Draft auto-save (localStorage)
✅ Complete analysis results view

The only difference: Submissions aren't persisted to a database (perfect for demos and testing).
