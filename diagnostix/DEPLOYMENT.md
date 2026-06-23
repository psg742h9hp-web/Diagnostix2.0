# DiagnostiX — Deployment Guide

## Option A: Vercel (recommended, 5 min)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Node.js 18+ installed locally

### Steps

1. **Create GitHub repo**
   - Go to github.com → New repository
   - Name it `diagnostix` (private recommended)
   - Do NOT initialise with README

2. **Push the code**
   ```bash
   cd diagnostix
   git init
   git add .
   git commit -m "Initial build"
   git remote add origin https://github.com/YOUR_USERNAME/diagnostix.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to vercel.com → Add New Project
   - Import your GitHub repo
   - Framework: Next.js (auto-detected)
   - No environment variables needed
   - Click Deploy

4. **Access**
   - Vercel gives you a URL like `diagnostix-abc.vercel.app`
   - Add it to your phone home screen (Safari → Share → Add to Home Screen)
   - Works offline after first load (pages cached by browser)

---

## Option B: Local only (no internet required after setup)

```bash
cd diagnostix
npm install
npm run build
npm start
# Open http://localhost:3000
```

---

## Updating the app

```bash
# Make changes, then:
git add .
git commit -m "describe change"
git push
# Vercel auto-deploys in ~30 seconds
```

---

## Adding more conditions to guidelines

Edit `/data/guidelines.js` — each condition follows the same structure:

```js
{
  id: 'unique-id',
  specialty: 'cardiology', // see existing specialties
  name: { en: 'English Name', cs: 'Czech Name' },
  guidelineRef: 'ESC 2023',
  keyFindings: { en: ['...'], cs: ['...'] },
  workup: { en: ['...'], cs: ['...'] },
  redFlags: { en: ['...'], cs: ['...'] },
  mimics: { en: ['...'], cs: ['...'] },
  treatment: { en: ['...'], cs: ['...'] },
  discharge: { en: ['...'], cs: ['...'] },
}
```

---

## Activating AI Lab Analysis (post-funding)

When ready to enable the Claude API:
1. Add `ANTHROPIC_API_KEY` to Vercel environment variables
2. Create `/pages/api/analyze.js` endpoint
3. Replace the "Coming Soon" placeholder in `/pages/cases/[id].js`

---

## Troubleshooting

**Blank page after deploy?**
- Check Vercel build logs for errors
- Clear browser cache (Ctrl+Shift+R)

**Cases not saving?**
- Check browser allows localStorage (not private/incognito mode)
- F12 → Application → Local Storage → verify key `dx_cases`

**Language toggle not persisting?**
- Same localStorage requirement — works in standard browser mode
