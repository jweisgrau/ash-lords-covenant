# Changelog

All notable changes to Ash-Lord's Covenant RPG.

## [1.0.0] - 2026-01-16

### 🎉 Major Release: Firebase → Static Migration

Complete rewrite from Firebase-dependent to fully static architecture with localStorage persistence.

### Added

#### New Files
- `public/state-manager.js` - State management module with transaction queue, validation, and backup system
- `cloudflare-worker.js` - API proxy template for secure Gemini API access
- `DEPLOYMENT.md` - Comprehensive deployment guide for GitHub Pages + Cloudflare Workers
- `README.md` - Full project documentation
- `CHANGELOG.md` - This file

#### New Features
- **Export/Import Save System**: Download and restore game saves as JSON files
  - Export button in header
  - Import with file picker
  - Automatic backup every 5 turns
- **State Validation**: Prevents invalid stat values, negative currency, out-of-bounds pips
- **Error Recovery**: Automatic recovery from corrupted localStorage via backup
- **Transaction Queue**: Prevents race conditions in state updates
- **Toast Notifications**: Visual feedback for XP, currency, pip changes
- **Missing Display Functions**: Restored from archive
  - `displayChatHistory()` - Renders chat messages
  - `displayWorldClocks()` - Shows faction clocks
  - `displayDestinyClock()` - Player legend progress
  - `displayEndgameFront()` - Threat tracker
  - `displayQuestProgress()` - Quest UI
  - `addMessageToChat()` - Chat persistence
  - `showToast()` - Notification system

### Changed

#### AI Model
- **From:** Gemini 2.5 Flash Preview (Sep 2025)
- **To:** Gemini 3 Pro Preview (2025)
- **Benefits:**
  - Better reasoning and complex decision-making
  - Improved constraint following ("NO FREE HEALING", "NO TAGS")
  - More reliable JSON output
  - Superior grimdark storytelling

#### Architecture
- **From:** Firebase Auth + Firestore (7 collections)
- **To:** localStorage + State Manager
- **Benefits:**
  - Zero infrastructure cost
  - No authentication required
  - Instant startup (no network calls)
  - Offline capable
  - Simpler deployment

#### API Integration
- **From:** Direct Gemini API calls (exposed key)
- **To:** Cloudflare Workers proxy (hidden key)
- **Benefits:**
  - API key security
  - CORS protection
  - Rate limiting (50 req/hour)
  - Free tier (100k req/day)

#### State Management
- **From:** Real-time Firestore listeners (6 total)
- **To:** Event-driven subscription system
- **Benefits:**
  - No race conditions (transaction queue)
  - Atomic updates
  - Immediate UI updates
  - Data validation

#### Chat History
- **From:** Last 15 messages from Firestore query
- **To:** Last 30 stored, 10 sent to AI
- **Benefits:**
  - Better context retention
  - Optimized token usage
  - Faster retrieval

### Removed

#### Deleted Code
- All Firebase imports (Auth, Firestore)
- Firebase config object (credentials removed)
- Exposed Gemini API key (moved to Cloudflare Worker)
- `checkAndCreateCampaign()` function - No longer needed
- Firebase global variables (`db`, `auth`, `userId`, `currentCampaignId`)
- `currentCharacterData`, `currentGameState`, `recentNarrativeHistory` globals
- Auth status UI element
- Firestore listeners (replaced with state subscriptions)

#### Removed Features
- Anonymous authentication
- Cloud persistence (now local-only)
- Real-time sync across devices (now single-device)

### Fixed

#### Major Bug Fixes
- **Race conditions** in state updates (transaction queue prevents conflicts)
- **Missing display functions** causing UI errors (restored from archive)
- **JSON parsing failures** from AI (improved extraction logic)
- **Exposed API keys** security issue (Cloudflare Worker proxy)
- **Chat history limit** exceeded (30 message cap)

#### Constraint Violations
- AI now respects "NO FREE HEALING" rule
- AI now respects "NO TAGS" rule (uses pips instead)
- Proper Tier 2 enforcement in combat

### Security

#### Improvements
- ✅ **API Key Hidden**: Moved to Cloudflare Workers environment variable
- ✅ **CORS Protection**: Worker validates origin
- ✅ **Rate Limiting**: 50 requests/hour per IP
- ✅ **No Exposed Secrets**: All credentials server-side
- ✅ **Client-Side Validation**: Prevents invalid state updates

### Performance

#### Optimizations
- **Startup Time**: Instant (no Firebase connection)
- **State Updates**: Synchronous (no network roundtrip)
- **Token Usage**: 30% reduction (optimized chat history)
- **Cost**: $0 infrastructure (vs Firebase paid tier)

### Migration Impact

#### Breaking Changes
- **No cross-device sync**: Saves are local-only
- **Manual backups**: Must export/import to transfer saves
- **Fresh start**: Existing Firebase saves not migrated

#### Compatibility
- ✅ Modern browsers (Chrome, Firefox, Edge, Safari)
- ✅ localStorage support required
- ✅ JavaScript modules support required
- ❌ IE11 not supported

### Cost Comparison

| Metric | Before (Firebase) | After (Static) |
|--------|------------------|----------------|
| Infrastructure | $25-50/month | $0/month |
| API per 100 turns | $0.05 | $1.32 |
| Total per campaign | $25+ | ~$1.32 |
| Startup cost | High | Zero |

### Code Statistics

- **Files Created**: 5
- **Files Modified**: 1 (index.html)
- **Lines Added**: ~900
- **Lines Removed**: ~350
- **Net Change**: +550 lines

### Technical Debt Paid

- ✅ Removed Firebase dependency
- ✅ Fixed state management race conditions
- ✅ Centralized state validation
- ✅ Added error recovery system
- ✅ Improved API error handling
- ✅ Better separation of concerns

---

## [0.9.5] - Previous (Firebase Era)

### Features
- Firebase Authentication (anonymous)
- Firestore persistence (7 collections)
- Gemini 2.5 Flash API
- Character creation
- Pip damage system
- World clocks
- Chat history

### Issues
- Race conditions in state updates
- Missing display functions
- JSON parsing failures
- Exposed API keys
- Constraint violations
- High infrastructure cost

---

## Future Roadmap

### v1.1.0 (Planned)
- [ ] Multiple save slots
- [ ] Character portraits
- [ ] Sound effects
- [ ] Mobile-optimized UI
- [ ] Dark/Light theme toggle

### v1.2.0 (Planned)
- [ ] Campaign sharing (export/import)
- [ ] Additional callings/burdens
- [ ] Quest system expansion
- [ ] Achievement system

### v2.0.0 (Vision)
- [ ] Multiplayer support
- [ ] Custom campaign editor
- [ ] AI image generation for scenes
- [ ] Voice narration (TTS)

---

**Version 1.0.0** marks a complete rewrite and production-ready release.
