# Ash-Lord's Covenant RPG

A grimdark political fantasy RPG powered by AI (Gemini 3 Pro), featuring a sophisticated dice mechanics system, persistent state management, and deep storytelling.

## 🎮 Features

- **AI-Powered Game Master**: Gemini 3 Pro provides intelligent, context-aware storytelling
- **Grimdark Setting**: Morally complex choices in a dark political fantasy world
- **Advanced Mechanics**: d10 + STAT - PIPS system with Tier-based challenges
- **Persistent State**: localStorage-based save system with backup/recovery
- **Character Progression**: XP, currency, equipment, and injury tracking
- **World Clocks**: Dynamic faction progression system
- **Secure API**: Cloudflare Workers proxy hides API keys
- **Export/Import**: Save and restore your game progress
- **Zero Cost Infrastructure**: Runs entirely on free tier services

## 🚀 Quick Start

### Option 1: Local Development

1. Clone this repository
2. Open `public/index.html` in a modern web browser
3. Start playing! (Note: AI features will not work without Cloudflare Worker setup)

### Option 2: Deploy to GitHub Pages (Recommended)

Follow the comprehensive [DEPLOYMENT.md](DEPLOYMENT.md) guide for full setup including:
- Cloudflare Workers API proxy
- GitHub Pages hosting
- Gemini API key configuration

## 📊 Architecture

### Before (Firebase-based)
```
Browser → Firebase Auth → Firestore (7 collections)
                      ↓
                 Gemini Flash API (exposed key)
                      ↓
              JSON parsing (unreliable)
```

### After (Static + localStorage)
```
Browser → localStorage (single JSON state)
              ↓
      State Manager (transaction queue)
              ↓
   Cloudflare Worker → Gemini 3 Pro API (hidden key)
              ↓
    JSON response with reliable parsing
              ↓
       Event-based UI updates
```

## 🎯 Key Improvements

### 1. AI Model Upgrade: Gemini 3 Pro
- **Better Reasoning**: More complex narrative decisions
- **Constraint Following**: Respects "NO FREE HEALING", "NO TAGS" rules
- **Cost Efficiency**: ~$1.32 per 100-turn campaign
- **Reliability**: Consistent JSON output

### 2. State Management
- **localStorage**: No database dependency
- **Transaction Queue**: Prevents race conditions
- **Validation Layer**: Data integrity checks
- **Backup System**: Auto-backup every 5 turns
- **Export/Import**: Manual save management

### 3. Security
- **API Key Hidden**: Cloudflare Workers proxy
- **CORS Protection**: Origin validation
- **Rate Limiting**: 50 requests/hour per IP
- **No Exposed Secrets**: All sensitive data server-side

### 4. Cost Analysis

| Component | Cost |
|-----------|------|
| **Infrastructure** | $0/month |
| - GitHub Pages | Free (public repo) |
| - Cloudflare Workers | Free (100k req/day) |
| **API Usage** | ~$0.50-$1.32 |
| - Per 100-turn campaign | |
| **Total** | ~$0.50-$1.32 per campaign |

## 🛠️ Technical Details

### File Structure
```
rpg-game/
├── public/
│   ├── index.html          # Main game UI (1200+ lines)
│   ├── state-manager.js    # State management module
│   ├── game_data.js        # Content pack (callings, burdens, etc.)
│   └── styles.css          # Styling
├── cloudflare-worker.js    # API proxy (deploy to Cloudflare)
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # This file
```

### State Schema
```javascript
{
  version: "1.0.0",
  userId: "local-uuid",
  character: {
    name: string,
    playbook: { calling, burden },
    stats: { FORCE, FINESSE, INFLUENCE, WITS, RESOLVE },
    pips: { [stat]: 0-2 },
    talents: [],
    equipment: [],
    xp: number,
    currency: number
  },
  gameState: {
    phase: "adventure" | "interlude",
    turn_count: number,
    current_location: string
  },
  chatHistory: Message[], // Last 30 messages
  worldClocks: { clocks: [] },
  destinyFrontClocks: { destiny, front },
  questState: { current_quest }
}
```

### API Integration

**Cloudflare Worker Proxy:**
```javascript
POST https://your-worker.workers.dev
{
  "model": "gemini-3.0-pro-preview-2025",
  "payload": {
    "contents": [...],
    "generationConfig": { "responseMimeType": "application/json" }
  }
}
```

**Response Format:**
```json
{
  "narrative": "Story text with <mechanics>...</mechanics>",
  "location_update": "New Location",
  "state_update": {
    "xp_gain": 1,
    "currency_gain": -2,
    "add_pips": { "stat": "FORCE", "amount": 1 },
    "equipment_add": [...],
    "clocks_advance": [...]
  }
}
```

## 🎲 Game Mechanics

### Dice System: d10 + STAT - PIPS

**Formula:** Roll d10 + your STAT modifier - PIP penalties

**Example:**
- Character has FORCE +2, 1 Pip on FORCE
- Roll: d10(7) + 2 - 1 = 8
- Result: Success on Tier 1 (6+), Success on Tier 2 (7+)

### Tiers

**Tier 1 (Challenging):**
- 6+ Success
- 4-5 Cost (complication OR 1 Pip Strain)
- 1-3 Miss

**Tier 2 (Perilous - Combat):**
- 7+ Success
- 5-6 Cost (serious complication OR 2 Pips Injury)
- 1-4 Miss

### Damage (Pips)

**Strain (1 Pip):**
- Minor harm
- Clears with rest or 1-2 coin

**Injury (2 Pips):**
- Serious harm
- Requires 3+ coin or special item
- **NO FREE HEALING**

**Max 2 Pips per STAT:**
- Further damage = Incapacitated

### Character Creation

1. Choose a **Calling** (what you do):
   - Ash-Warden Deserter
   - Cinder-Scribe
   - Voidborn Smuggler
   - Ember-Knight Errant

2. Choose a **Burden** (what haunts you):
   - The Debt
   - The Rival
   - The Curse
   - The Secret

3. Stats combine: Calling + Burden
4. Start with 0 XP, 0 Coin

## 🎨 UI Features

- **Character Sheet**: Live stat/pip/XP tracking
- **Narrative Log**: Chat-style story flow
- **World Clocks**: Visual faction progress (6-segment clocks)
- **Destiny Clock**: Player legend progression (8 segments)
- **Endgame Front**: Threat advancement tracker
- **Toast Notifications**: XP/currency/damage feedback
- **Export/Import**: Save file management

## 🐛 Troubleshooting

### "YOUR_WORKER_URL_HERE" Error
**Cause:** Cloudflare Worker URL not configured

**Fix:**
1. Deploy Cloudflare Worker (see DEPLOYMENT.md)
2. Edit `public/index.html` line ~709
3. Replace `YOUR_WORKER_URL_HERE` with your worker URL

### State Not Persisting
**Cause:** localStorage disabled or browser privacy mode

**Fix:**
- Check browser console for errors
- Disable private/incognito mode
- Enable localStorage in browser settings

### AI Not Responding
**Cause:** Cloudflare Worker or Gemini API issue

**Fix:**
1. Check Cloudflare Workers logs
2. Verify GEMINI_API_KEY is set in worker
3. Test worker with curl (see DEPLOYMENT.md)
4. Check Gemini API quota at https://aistudio.google.com/apikey

### JSON Parse Errors
**Cause:** Gemini 3 Pro occasionally returns malformed JSON

**Fix:**
- Implemented automatic retry logic (3 attempts)
- Fallback JSON extraction from text
- Report persistent issues to GitHub Issues

## 📝 Development

### Local Testing Checklist

- [ ] Character creation saves to localStorage
- [ ] Chat messages appear in narrative log
- [ ] Pip damage applies correctly
- [ ] XP/currency changes show toasts
- [ ] World clocks advance
- [ ] Export/import works
- [ ] Page reload preserves state
- [ ] Backup recovery works

### Making Changes

1. Edit files in `public/` directory
2. Test locally by opening `index.html` in browser
3. Check browser console for errors
4. Deploy to GitHub Pages with `git push`

### Contributing

Contributions welcome! Areas for improvement:
- Additional callings/burdens in `game_data.js`
- UI/UX enhancements
- Better error handling
- Mobile responsiveness
- Sound effects
- Save slot system
- Campaign import/export

## 📄 License

This project is provided as-is for educational and personal use.

## 🙏 Credits

- **Game Design**: Powered by PbtA (Powered by the Apocalypse) mechanics
- **AI**: Gemini 3 Pro by Google
- **Framework**: Vanilla JavaScript + localStorage
- **Hosting**: GitHub Pages + Cloudflare Workers
- **UI**: TailwindCSS (via CDN)

## 🔗 Links

- [Deployment Guide](DEPLOYMENT.md)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

## 📞 Support

For issues and questions:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
2. Review browser console for errors
3. Check Cloudflare Workers logs
4. Open an issue on GitHub

---

**Version:** 1.0.0
**Last Updated:** 2026-01-16
**Status:** Production Ready ✅
