# Part B Bug Fixes - Implementation Plan

## Critical Bugs (Must Fix Before Testing)

### Bug Fix 1: Remove Duplicate xp/xp_locked Fields

**File:** `index.html`  
**Lines:** 2421-2424

**Current Code:**
```javascript
equipment: { slots, inventory },
xp: 0,
xp_locked: 0,
xp: 0,              // ← DELETE
xp_locked: 0,       // ← DELETE
blight: 0,
```

**Action:** Delete lines 2423-2424

---

### Bug Fix 2: Remove Duplicate tag_remove Handler

**File:** `index.html`  
**Lines:** 3327-3334

**Current Code:**
```javascript
if (update.tag_remove) {
    await TagSystem.removeTag(update.tag_remove);
    showToast(`Tag removed: ${update.tag_remove}`);
}
if (update.tag_remove) {          // ← DELETE THIS BLOCK
    await TagSystem.removeTag(update.tag_remove);
    showToast(`Tag removed: ${update.tag_remove}`);
}
```

**Action:** Delete lines 3331-3334

---

### Bug Fix 3: Move Fragment Handlers Inside Transaction ⚠️ CRITICAL

**File:** `index.html`  
**Lines:** 3319-3383

**Problem:** Fragment and revelation handlers execute AFTER `return updates`, so changes are lost.

**Current Structure:**
```javascript
async function processStateUpdate(update) {
    await gameState.transaction(async (state) => {
        // ... updates object built here
        return updates;  // ← Line 3319 - transaction ends
    });
    
    // ❌ These execute OUTSIDE transaction
    if (update.tag_add) { ... }
    if (update.truth_fragment_add) { ... }  // ← LOST!
    if (update.revelation_complete) { ... } // ← LOST!
}
```

**Fix:** Move narrative handlers INSIDE the transaction:

```javascript
async function processStateUpdate(update) {
    await gameState.transaction(async (state) => {
        const character = state.character;
        const updates = {};
        
        // ... (existing handlers: xp, pips, armor, equipment, blight, etc.)
        
        // MOVE INSIDE: Truth Fragment Add
        if (update.truth_fragment_add) {
            if (!character) return;  // Add validation
            
            const { faction, fragment_id } = update.truth_fragment_add;
            const currentFragments = character.truth_fragments || { 
                ash_wardens: [], soot_stained: [], 
                iron_forgers: [], whispering_flesh: [] 
            };
            
            if (!currentFragments[faction].includes(fragment_id)) {
                updates.character = {
                    ...(updates.character || character),
                    truth_fragments: {
                        ...currentFragments,
                        [faction]: [...(currentFragments[faction] || []), fragment_id]
                    }
                };
                showToast(`Truth Fragment Discovered! (${faction})`);
                
                // Check for Revelation Unlock (2 fragments)
                if ((currentFragments[faction].length + 1) >= 2) {
                    setTimeout(() => {
                        addMessageToChat('model', `\n\n**REVELATION UNLOCKED**\nYou have pieced together a disturbing truth about the **${faction.replace('_', ' ').toUpperCase()}**. (Check World State)`);
                    }, 1000);
                }
            }
        }
        
        // MOVE INSIDE: Revelation Complete
        if (update.revelation_complete) {
            if (!character) return;  // Add validation
            
            const faction = update.revelation_complete;
            const currentRevelations = character.revelations_completed || [];
            
            if (!currentRevelations.includes(faction)) {
                updates.character = {
                    ...(updates.character || character),
                    revelations_completed: [...currentRevelations, faction]
                };
                
                // Award Destiny Clock progress (+2)
                updates.destinyFrontClocks = {
                    ...state.destinyFrontClocks,
                    destiny: {
                        ...state.destinyFrontClocks.destiny,
                        current: Math.min(8, (state.destinyFrontClocks.destiny.current || 0) + 2)
                    }
                };
                
                showToast(`Revelation Completed: ${faction}!`);
                showToast(`Destiny Clock +2`);
            }
        }
        
        return updates;  // Now includes narrative updates
    });
    
    // KEEP OUTSIDE: Tag operations (they have their own transactions)
    if (update.tag_add) {
        await TagSystem.addTag(update.tag_add);
    }
    
    if (update.tag_remove) {
        await TagSystem.removeTag(update.tag_remove);
        showToast(`Tag removed: ${update.tag_remove}`);
    }
}
```

---

## Recommended Improvements (Optional)

### Improvement 1: Add Quest Check to Rumor Mill Trigger

**File:** `index.html`  
**Line:** ~3667

**Change:**
```javascript
// Current
const turnCount = gameState.getState().gameState.turn_count || 0;
if (turnCount >= 5) {
    setTimeout(() => window.RumorSystem.showRumor Mill(), 1500);
}

// Improved
const state = gameState.getState();
const turnCount = state.gameState.turn_count || 0;
const hasQuest = state.questState?.current_quest != null;

if (turnCount >= 5 && !hasQuest) {
    setTimeout(() => window.RumorSystem.showRumorMill(), 1500);
}
```

---

### Improvement 2: Fix Typo in Revelation Quest

**File:** `game_data.js`  
**Line:** 640

**Change:** `" The Pit"` → `"The Pit"` (remove leading space)

---

## Testing After Fixes

1. **Fragment Persistence Test:**
   ```javascript
   window.processStateUpdate({ 
       truth_fragment_add: { faction: "ash_wardens", fragment_id: "aw_frag_labor" } 
   });
   // Then check: window.gameState.getState().character.truth_fragments
   // Should show: { ash_wardens: ["aw_frag_labor"], ... }
   ```

2. **Revelation Test:**
   ```javascript
   window.processStateUpdate({ revelation_complete: "ash_wardens" });
   // Check destiny clock increased by 2
   ```

3. **Rumor Mill Test:**
   - Advance to turn 5, trigger interlude, end interlude
   - Verify modal appears (only if no active quest)
