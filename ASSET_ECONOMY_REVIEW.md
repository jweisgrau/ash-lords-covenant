# Asset Economy Implementation Review

## Critical Issues Found

### 1. **Currency Logic Not Fully Removed from processStateUpdate** ⚠️ CRITICAL
**Location**: `index.html` lines 3064-3076

The `processStateUpdate` function still contains currency handling logic that was supposed to be removed:

```javascript
// Currency gain/loss
if (update.currency_gain !== undefined && update.currency_gain !== 0 && update.currency_gain !== null) {
    const amount = Number(update.currency_gain);
    if (!isNaN(amount) && amount !== 0) {
        const newCurrency = Math.max(0, (character.currency || 0) + amount);
        updates.character = {
            ...(updates.character || character),
            currency: newCurrency
        };
        showToast(`${amount > 0 ? '+' : ''}${amount} Coin`);
        console.log(`Currency update: ${character.currency} + ${amount} = ${newCurrency}`);
    }
}
```

**Impact**: 
- The AI can still send `currency_gain` commands and they will be processed
- This undermines the entire Asset Economy implementation
- Creates a disconnect between the AI prompt (which says not to use currency) and actual behavior

**Fix Required**: Remove this entire block (lines 3064-3076)

---

### 2. **Equipment Addition Not Updated for Slot System** ⚠️ CRITICAL  
**Location**: `index.html` lines 3108-3127

The `processStateUpdate` function's `equipment_add` handler still treats equipment as an array:

```javascript
// Equipment add
if (update.equipment_add && update.equipment_add.length > 0) {
    const currentEquipment = character.equipment || [];
    const newItems = update.equipment_add.map(item => ({
        name: item.name || "Unknown Item",
        type: item.type || "loot",
        properties: item.properties || item.tags || [],
        lore: item.lore || item.desc || "",
        ...(item.stat ? { stat: item.stat } : {}),
        ...(item.pips !== undefined ? { pips: item.pips, max_pips: item.max_pips || 2 } : {}),
        ...(item.bonus !== undefined ? { bonus: item.bonus } : {})
    }));

    updates.character = {
        ...(updates.character || character),
        equipment: [...currentEquipment, ...newItems]
    };

    newItems.forEach(item => showToast(`+1 Item: ${item.name}`));
}
```

**Impact**:
- When AI adds equipment via `equipment_add`, it will overwrite the new slot structure `{ slots: {}, inventory: [] }` with a flat array
- This will break the entire equipment system after the first AI-awarded item
- Shop purchases will work (using `InventorySystem.addItem`) but AI rewards won't

**Fix Required**: Replace this with a call to `InventorySystem.addItem` for each item, similar to how `purchaseFromShop` works

---

### 3. **AI Prompt References Old Equipment Structure AND Currency** ⚠️ CRITICAL
**Location**: `index.html` lines 2870-2876

The AI system prompt still references equipment as an array AND includes currency:

```javascript
Equipment: ${(character.equipment || []).map(e => {
                if (e.type === 'tool') return `${e.name} (+1 ${e.stat})`;
                if (e.type === 'armor') return `${e.name} (${e.pips || 0}/${e.max_pips || 2} ${e.stat} armor)`;
                return e.name;
            }).join(', ')}
Coin: ${character.currency}
XP: ${character.xp || 0}
```

**Impact**: 
- AI will have completely incorrect understanding of player's equipment state
- AI is told the player has "Coin" which contradicts the entire Asset Economy
- This will cause AI to generate narratives inconsistent with actual game state
- When `character.equipment` becomes `{ slots: {}, inventory: [] }` after character creation, this will crash or return empty/nonsense

**Fix Required**: 
1. Remove the `Coin` line entirely
2. Update equipment listing to iterate over both `character.equipment.slots` and `character.equipment.inventory`
3. Should probably show equipped items (from slots) and inventory items separately for clarity

**Suggested Fix**:
```javascript
Equipment: 
  Equipped: ${Object.entries(character.equipment?.slots || {})
    .flatMap(([stat, slot]) => {
      const items = [];
      if (slot.tool) items.push(`${slot.tool.name} (+1 ${stat})`);
      if (slot.armor) items.push(`${slot.armor.name} (${slot.armor.pips}/${slot.armor.max_pips} ${stat} armor)`);
      return items;
    }).join(', ') || 'None'}
  Inventory: ${(character.equipment?.inventory || []).map(i => i.name).join(', ') || 'None'}
XP: ${character.xp || 0}
```

---

### 4. **Malformed AI Prompt Text** ⚠️ LOW
**Location**: `index.html` line 2917

```
- Describe injuries as wounds, exhaustion, strain - not            *** STEALING & LOOTING GUIDANCE (ASSET ECONOMY) ***
```

The sentence is incomplete and runs into the next section header.

**Fix Required**: Should read:
```
- Describe injuries as wounds, exhaustion, strain - not as "pips"

*** STEALING & LOOTING GUIDANCE (ASSET ECONOMY) ***
```

---

### 5. **Duplicate Comment** ⚠️ COSMETIC
**Location**: `index.html` lines 1714-1715

```javascript
// EXTENDED INVENTORY SYSTEM (Asset Economy v1.2)
// EXTENDED INVENTORY SYSTEM (Asset Economy v1.2)
```

Minor duplicate that should be cleaned up.

---

## Potential Logic Issues

### 6. **Item Modification Uses Old Structure**
**Location**: `index.html` lines 3147-3150+

The `item_modify` handler likely also assumes array structure. Need to verify it works with slot system.

### 7. **Missing Armor Damage Handler in processStateUpdate**
The `game-logic.js` returns `update_armor` from `getConsequences`, but there's no handler for this in `processStateUpdate`. The armor damage logic seems to be missing entirely from the client-side state update flow.

**Location**: Should be in `processStateUpdate` but appears to be missing

**Impact**: Ablative armor won't actually take damage when it should

---

## Recommendations

### Priority 1 (Must Fix Before Testing):
1. Remove currency handling from `processStateUpdate` (lines 3064-3076)
2. Update `equipment_add` handler to use `InventorySystem.addItem` 
3. Update AI prompt to use new equipment structure and remove currency (lines 2870-2876)
4. Add `update_armor` handler to `processStateUpdate` for ablative armor

### Priority 2 (Should Fix):
5. Fix malformed AI prompt text (line 2917)
6. Update `item_modify` handler for slot structure (lines 3147+)

### Priority 3 (Nice to Have):
7. Remove duplicate comment (lines 1714-1715)

---

## Testing Recommendations

Before user testing, verify:
1. AI cannot award currency via `currency_gain`
2. AI-awarded items via `equipment_add` properly go to inventory or slots
3. Ablative armor actually reduces pips when player takes damage
4. Shop purchases work correctly
5. Interlude actions (heal/repair using valuables) work correctly

---

## Code Quality Notes

### Positive Aspects:
- The `InventorySystem` extension is well-structured and properly handles slot logic
- The character creation initialization correctly sets up the slot structure  
- The UI rendering (`displayCharacter`) correctly handles the new slot display
- The DOMContentLoaded wrapper prevents timing issues with module loading

### Areas for Improvement:
- The disconnect between new code (`InventorySystem.addItem`) and old code (`processStateUpdate`) creates a maintenance burden
- Consider refactoring all item additions to go through a single unified system
- The mixing of direct state updates and `InventorySystem` methods could lead to inconsistencies
