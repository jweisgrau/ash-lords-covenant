# Quick Start Guide

Get your Ash-Lord's Covenant RPG running in 15 minutes!

## 🚀 Option 1: Local Testing (5 minutes)

**Play without AI features:**

1. Open `public/index.html` in your browser
2. Create a character
3. Explore the UI (AI GM will not work without Cloudflare Worker)

✅ **Good for**: Testing UI, understanding mechanics
❌ **Limitation**: No AI responses

---

## 🌐 Option 2: Full Deployment (15 minutes)

**Complete setup with AI features:**

### Step 1: Get Gemini API Key (2 minutes)

1. Go to https://aistudio.google.com/apikey
2. Sign in with Google account
3. Click **"Get API key"**
4. Click **"Create API key in new project"**
5. Copy the key (starts with `AIza...`)

### Step 2: Deploy Cloudflare Worker (5 minutes)

1. Go to https://dash.cloudflare.com/sign-up
2. Create free account
3. Go to **Workers & Pages** → **Create Worker**
4. Name it: `ash-lords-rpg-proxy`
5. Click **Deploy**, then **Edit Code**
6. Delete default code
7. Copy entire contents of `cloudflare-worker.js`
8. Paste and **Save and Deploy**
9. Go to **Settings** → **Variables**
10. Add variable:
    - Name: `GEMINI_API_KEY`
    - Value: (paste your API key from Step 1)
    - Click **Encrypt**
11. Click **Save and Deploy**
12. Copy your worker URL (e.g., `https://ash-lords-rpg-proxy.YOUR_SUBDOMAIN.workers.dev`)

### Step 3: Update Game Code (2 minutes)

1. Open `public/index.html` in text editor
2. Search for: `YOUR_WORKER_URL_HERE` (around line 709)
3. Replace with your worker URL from Step 2
4. Save file

### Step 4: Test Locally (1 minute)

1. Open `public/index.html` in browser
2. Create a character
3. Try an action (e.g., "I attack the guard")
4. Verify you get an AI response

✅ **If it works**: Proceed to Step 5
❌ **If not**: Check browser console for errors, verify worker URL is correct

### Step 5: Deploy to GitHub Pages (5 minutes)

1. Create GitHub repository (public)
2. In terminal/command prompt:
   ```bash
   cd "C:\Users\jweis\Claude Code\rpg-game"
   git init
   git add .
   git commit -m "Initial commit v1.0.0"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ash-lords-rpg.git
   git push -u origin main
   ```
3. Go to repository **Settings** → **Pages**
4. Source: **main** branch, folder: **/public**
5. Click **Save**
6. Wait 2 minutes
7. Visit: `https://YOUR_USERNAME.github.io/ash-lords-rpg/`

### Step 6: Secure Worker (1 minute)

1. Go back to Cloudflare Workers
2. Edit `cloudflare-worker.js`
3. Find line 8: `'Access-Control-Allow-Origin': '*'`
4. Change to: `'Access-Control-Allow-Origin': 'https://YOUR_USERNAME.github.io'`
5. **Save and Deploy**

---

## ✅ Verification Checklist

After deployment, verify these work:

- [ ] Game loads at GitHub Pages URL
- [ ] Character creation saves
- [ ] AI responds to actions
- [ ] XP/currency updates show toasts
- [ ] Page reload preserves game state
- [ ] Export Save button downloads JSON file
- [ ] Import Save button restores from JSON
- [ ] Reset Game clears everything

---

## 🐛 Common Issues

### "YOUR_WORKER_URL_HERE" in Console
**Fix:** You forgot Step 3 - update `index.html` with your worker URL

### "Failed to fetch" Error
**Fix:**
1. Check worker URL is correct in `index.html`
2. Verify CORS origin in worker matches GitHub Pages URL
3. Test worker directly with curl (see DEPLOYMENT.md)

### No AI Response
**Fix:**
1. Check Cloudflare Workers logs
2. Verify `GEMINI_API_KEY` is set correctly
3. Check Gemini API quota at https://aistudio.google.com/apikey

### Game Not Saving
**Fix:**
1. Check browser console for errors
2. Make sure localStorage is enabled
3. Don't use Incognito/Private mode

---

## 💰 Cost Estimate

- **GitHub Pages**: FREE (public repo)
- **Cloudflare Workers**: FREE (up to 100k requests/day)
- **Gemini API**: ~$1.32 per 100-turn campaign
- **Total Monthly**: $0 infrastructure + ~$5-10 API (depending on play)

---

## 📚 Next Steps

1. ✅ **Play the game!** Create a character and start your saga
2. 📖 Read [README.md](README.md) for mechanics documentation
3. 🎨 Customize `game_data.js` to add new callings/burdens
4. 🔧 Check [DEPLOYMENT.md](DEPLOYMENT.md) for advanced configuration
5. 📝 Review [CHANGELOG.md](CHANGELOG.md) to understand what changed

---

## 🆘 Getting Help

**In order of preference:**

1. Check browser console (F12) for error messages
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
3. Verify all URLs and API keys are correct
4. Test Cloudflare Worker with curl
5. Check Cloudflare Workers logs
6. Open GitHub issue with error details

---

## 🎮 Game Controls

- **Type actions** in natural language (e.g., "I sneak past the guards")
- **Export Save** regularly to backup progress
- **Import Save** to restore or transfer to another device
- **Reset Game** to start fresh (cannot be undone!)

---

## 🎲 Quick Mechanics Reference

**Dice Roll:** d10 + STAT - PIPS

**Tiers:**
- Tier 1: 6+ Success, 4-5 Cost, 1-3 Miss
- Tier 2 (Combat): 7+ Success, 5-6 Cost, 1-4 Miss

**Pips (Damage):**
- 1 Pip = Strain (minor)
- 2 Pips = Injury (serious)
- Max 2 pips per stat

**Currency:**
- Items: 1-3 coin
- Healing: 3+ coin
- Bribes: 2-5 coin

---

**Good luck, Ash-Lord! May your choices forge legends.** ⚔️🔥
