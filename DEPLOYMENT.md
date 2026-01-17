# Ash-Lord's Covenant - Deployment Guide

This guide will walk you through deploying your RPG game to GitHub Pages with Cloudflare Workers for API key security.

## Prerequisites

- GitHub account
- Cloudflare account (free tier)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
- Git installed on your computer

## Part 1: Deploy Cloudflare Worker

### Step 1: Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Create a free account
3. Verify your email

### Step 2: Create Worker

1. In Cloudflare dashboard, go to **Workers & Pages** → **Create Worker**
2. Name it: `ash-lords-rpg-proxy`
3. Click **Deploy** (it will create a default worker)
4. Click **Edit Code**
5. Delete all the default code
6. Copy the entire contents of `cloudflare-worker.js` from this repository
7. Paste it into the Cloudflare editor
8. Click **Save and Deploy**

### Step 3: Add Environment Variables

1. Go back to your worker's page
2. Click **Settings** → **Variables**
3. Under **Environment Variables**, click **Add variable**
4. Add:
   - **Variable name:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key from https://aistudio.google.com/apikey
   - Click **Encrypt** (important!)
5. Click **Save and Deploy**

### Step 4: (Optional) Set Up Rate Limiting

1. In Workers dashboard, go to **KV** → **Create namespace**
2. Name it: `RATE_LIMIT_KV`
3. Click **Add**
4. Go back to your worker → **Settings** → **Variables**
5. Under **KV Namespace Bindings**, click **Add binding**
6. **Variable name:** `RATE_LIMIT_KV`
7. **KV namespace:** Select `RATE_LIMIT_KV`
8. Click **Save and Deploy**

### Step 5: Get Worker URL

Your worker URL will be: `https://ash-lords-rpg-proxy.YOUR_SUBDOMAIN.workers.dev`

Copy this URL - you'll need it later.

### Step 6: Test Worker

Open terminal/command prompt and test:

```bash
curl -X POST https://ash-lords-rpg-proxy.YOUR_SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"gemini-3.0-pro-preview-2025\",\"payload\":{\"contents\":[{\"parts\":[{\"text\":\"Test\"}]}]}}"
```

You should get a JSON response from Gemini.

---

## Part 2: Deploy to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ash-lords-covenant` (or your choice)
3. Make it **Public** (required for free GitHub Pages)
4. Do **NOT** initialize with README
5. Click **Create repository**

### Step 2: Push Code to GitHub

Open terminal in your project folder and run:

```bash
cd "C:\Users\jweis\Claude Code\rpg-game"
git init
git add .
git commit -m "Initial commit: v1.0.0 with Gemini 3 Pro"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ash-lords-covenant.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/public`
4. Click **Save**
5. Wait 1-2 minutes for deployment
6. Your site will be live at: `https://YOUR_USERNAME.github.io/ash-lords-covenant/`

### Step 4: Update CORS in Cloudflare Worker

Now that you have your GitHub Pages URL, secure your worker:

1. Go back to Cloudflare Workers dashboard
2. Edit your worker code
3. Find this line (around line 8):
   ```javascript
   'Access-Control-Allow-Origin': '*',
   ```
4. Change it to:
   ```javascript
   'Access-Control-Allow-Origin': 'https://YOUR_USERNAME.github.io',
   ```
5. Click **Save and Deploy**

This prevents other websites from using your worker.

### Step 5: Update Worker URL in index.html

1. In your local code, open `public/index.html`
2. Search for: `YOUR_WORKER_URL_HERE`
3. Replace it with your actual Cloudflare Worker URL:
   ```javascript
   const PROXY_URL = 'https://ash-lords-rpg-proxy.YOUR_SUBDOMAIN.workers.dev';
   ```
4. Save the file
5. Commit and push:
   ```bash
   git add public/index.html
   git commit -m "Add Cloudflare Worker URL"
   git push
   ```
6. Wait 1-2 minutes for GitHub Pages to update

---

## Part 3: Test Your Deployment

### Step 1: Open Your Game

Visit: `https://YOUR_USERNAME.github.io/ash-lords-covenant/`

### Step 2: Create a Character

1. Enter a character name
2. Select a Calling
3. Select a Burden
4. Click **Begin Your Saga**

### Step 3: Test Gameplay

1. Type an action (e.g., "I attack the guard")
2. Press Enter or click Submit
3. Verify you get a response from the AI
4. Check that XP/currency updates appear

### Step 4: Test Persistence

1. Reload the page
2. Verify your character and progress are still there
3. This means localStorage is working!

### Step 5: Test Export/Import

1. Click **Export Save** button
2. Download saves as JSON file
3. Reset the game
4. Click **Import Save**
5. Select your JSON file
6. Verify everything is restored

---

## Troubleshooting

### "Failed to fetch" Error

**Cause:** Worker URL is wrong or CORS is blocking requests

**Fix:**
1. Check that `PROXY_URL` in `index.html` matches your worker URL exactly
2. Make sure CORS origin in worker matches your GitHub Pages URL
3. Check browser console (F12) for detailed error

### "API Key Invalid" Error

**Cause:** Gemini API key not set correctly in Cloudflare

**Fix:**
1. Go to Cloudflare Workers → Your worker → Settings → Variables
2. Verify `GEMINI_API_KEY` is set and encrypted
3. Get a fresh API key from https://aistudio.google.com/apikey if needed
4. Update and **Save and Deploy**

### Character Not Saving

**Cause:** localStorage might be disabled or browser privacy settings

**Fix:**
1. Check browser console (F12) for errors
2. Make sure you're not in Incognito/Private mode
3. Check browser settings allow localStorage
4. Try a different browser

### Worker Rate Limit

**Cause:** You're making more than 50 requests per hour from one IP

**Fix:**
1. Wait an hour for rate limit to reset
2. Or increase the limit in worker code (line 35):
   ```javascript
   if (count && parseInt(count) > 100) { // Changed from 50
   ```

### GitHub Pages Not Updating

**Cause:** GitHub Pages cache

**Fix:**
1. Wait 2-3 minutes after pushing
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check GitHub Actions tab to see if build completed

---

## Cost Breakdown

### Cloudflare Workers
- **Free tier:** 100,000 requests/day
- **Your usage:** ~50-100 requests per play session
- **Cost:** $0 (well within free tier)

### GitHub Pages
- **Free tier:** Unlimited for public repos
- **Cost:** $0

### Gemini 3 Pro API
- **Input:** $1.25 / 1M tokens
- **Output:** $5.00 / 1M tokens
- **Context caching:** 90% discount on cached tokens
- **Per turn:** ~3,300 input + 300 output = ~$0.013
- **100-turn campaign:** ~$1.30 (or ~$0.50 with caching)

**Total infrastructure cost:** $0/month
**Total API cost:** ~$0.50-$1.30 per 100-turn campaign

---

## Updates and Maintenance

### To Update Your Game

1. Make changes locally
2. Test by opening `public/index.html` in browser
3. Commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Wait 1-2 minutes for GitHub Pages to update

### To Update Worker

1. Edit worker code in Cloudflare dashboard
2. Click **Save and Deploy**
3. Changes are instant (no waiting)

### Backup Your Saves

**Automatic:** Every 5 turns, game creates backup in localStorage

**Manual:**
1. Click **Export Save** button regularly
2. Save JSON files to your computer
3. Store important saves in cloud storage (Google Drive, Dropbox)

---

## Security Notes

### API Key Security
✅ Your Gemini API key is safely stored in Cloudflare Workers
✅ It's encrypted and never exposed to browser
✅ CORS prevents other websites from using your worker
✅ Rate limiting prevents abuse

### What's Public
- Your game code (HTML/CSS/JS) - visible on GitHub
- Your game saves - stored locally in your browser only
- Your character data - never leaves your computer

### What's Private
- Gemini API key - encrypted in Cloudflare
- Your play sessions - not tracked anywhere
- Your save files - only on your computer

---

## Next Steps

1. ✅ Deploy Cloudflare Worker
2. ✅ Deploy to GitHub Pages
3. ✅ Test thoroughly
4. 🎮 Play the game!
5. 📢 Share your GitHub Pages URL with friends
6. 🛠️ Customize and improve the game
7. ⭐ Star this repo if you enjoyed it!

---

## Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Review this guide's Troubleshooting section
3. Check Cloudflare Workers logs (Workers → Your worker → Logs)
4. Verify your API key is valid at https://aistudio.google.com/apikey

---

## Congratulations!

You've successfully deployed a full-stack RPG game with:
- ✅ Static hosting (GitHub Pages)
- ✅ Secure API proxy (Cloudflare Workers)
- ✅ AI-powered game master (Gemini 3 Pro)
- ✅ Local persistence (localStorage)
- ✅ Zero infrastructure costs

Enjoy your game! 🎲⚔️🔥
