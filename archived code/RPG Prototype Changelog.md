# **v1.2.1 (The Asset System)**

This major update deprecates the abstract "Coin" currency, replacing it with a tangible **Asset Economy**. Wealth is now inventory-based, while Character Growth is strictly XP-based. This shift aligns the game's economy with its Grimdark tone—you don't pay with gold; you barter with stolen goods.

1\. Economy & Progression

* **Currency Deprecation:** Removed the `currency` integer from the database and UI.  
* **The "Valuable" Tag:** Recovery actions (Healing/Repairs) now require burning an item tagged **"Valuable"** (e.g., *Stolen Guild Ledger*, *Golden Idol*) during an Interlude.  
* **XP Shop:** Equipment is now purchased directly with XP during Interludes, representing training and resource acquisition.  
  * **Standard Gear (5 XP):** Reliable, low-risk upgrades.  
  * **Heavy Gear (3 XP):** Cheaper but heavier, risking the *Overburdened* state.

2\. Mechanics: Tools & Armor

* **New Slot System:** Characters now have specific **Tool** and **Armor** slots for *each* of the 5 Stats.  
  * *Constraint:* You can only equip one Tool and one Armor per stat. New purchases overwrite old ones.  
* **Tools (+1 Bonus):** Items like *Balanced Daggers* (Finesse) or *Aether Lens* (Wits) now grant a flat **\+1 Bonus** to rolls with that stat.  
* **Ablative Armor:** Items like *Chainmail Jack* (Force) have their own Pips (Health).  
  * *Logic:* When taking damage to a specific stat, the **Armor absorbs the damage first**.  
  * *Repair:* Armor does not regenerate automatically; it must be repaired by burning a *Valuable* during an Interlude.

3\. User Interface

* **HUD Update:** Removed the Coin counter from the header and mobile HUD.  
* **Character Sheet Overhaul:**  
  * Added visual **Equipment Slots** under each Stat Block.  
  * **Armor Slots** display the item's current integrity (e.g., `[XX]`).  
  * **Tool Slots** indicate the active bonus (`+1`).  
* **Inventory Sorting:** The "Backpack" list now filters out equipped Tools and Armor, showing only general loot and narrative items.

4\. Content

* **Master Gear List:** Added 20 new mechanical items (1 Light/1 Heavy Tool & Armor for every stat) to `game_data.js`.  
* **Calling Loadouts:** Updated all starting classes to use the new Tool/Armor schema.

**Status:** Stable **Deployed:** v1.2.1

# **v1.1.8 (Logic & Stability Patch)**

This release addresses critical failures in the mechanical logic layer (JS), specifically regarding damage application and stat classification, while tightening narrative constraints on the AI to prevent phase jumping and hallucinations.

1\. Logic & Mechanics (JavaScript)

   \- Pip Spillover Refactor (Fix 036):

     \- Refactored resolveMechanics to strictly enforce the "Cascading Damage" rule.

     \- Damage now ONLY spills over to RESOLVE if the primary stat is fully injured (2/2 Pips).

     \- Fixed instances where 1 Pip of Strain was wrongly applying to both the Stat and Resolve simultaneously.

   \- Tier 1 Damage Fix (Fix 038):

     \- Explicitly hardcoded Damage \= 0 for Tier 1 "Success w/ Twist" (Roll 5-7).

     \- Prevents phantom strain from being applied on partial successes.

   \- Manual Coin Expenditure (Fix 032):

     \- Added keyword detection to handlePlayerAction (e.g., "bribe", "pay", "give coin").

     \- The system now automatically deducts 1 Coin and treats the action as PASSIVE (No Roll) if the player is paying a cost, bypassing unnecessary risk rolls.

   \- Quest Acceptance Bypass (Fix 033):

     \- Added keyword detection to classifyAction (e.g., "accept", "join", "take job").

     \- Accepting a quest is now forced to PASSIVE (No Roll), preventing players from taking damage just for saying "yes" to a mission.

2\. Intent & Classification (Prompt Engineering)

   \- WITS Scope Redefinition (Fix 037, 038):

     \- Updated the classifyAction system prompt to explicitly include "looking for objects," "disabling traps," "analyzing mechanisms," and "crafting" under WITS.

     \- Updated the UI tooltip for WITS to include "Using Tools/Machines, Engineering."

     \- Prevents these actions from being misclassified as FINESSE or PASSIVE.

   \- Faction Consistency (Fix 031):

     \- Hard-coded the allowable Faction names in the narrateOutcome prompt (Ash-Wardens, Soot-Stained, Iron-Forgers, Whispering Flesh).

     \- Prevents the AI from hallucinating factions (e.g., "Gilded Hand") that do not exist in the World Clock mechanics.

   \- Phase Transition Logic (Fix 039):

     \- Strict constraints added to prevent the AI from triggering the "Rumor Mill" phase transition if a Quest is currently active.

     \- Prevents the narrative from jumping to the tavern mid-mission.

3\. User Interface

   \- Quest UI Visibility (Fix 034):

     \- Updated displayQuestProgress to explicitly force the quest wrapper to visible (display: block) whenever quest data exists in the database.

   \- Narrative State Sync (Fix 035):

     \- Added a mandatory instruction for the AI to output state\_update JSON for equipment when the narrative describes finding/receiving items (e.g., the Ash-Warden Baton).

Status: Stable

Deployed: v1.1.8

# 

# **v1.1.7 (XP Logic & UI Patch)**

This changelog documents the updates and fixes implemented in version 1.1.7 of the Ash-Lord's Covenant RPG prototype. This release focused on refining the experience point (XP) acquisition logic, improving UI feedback, and correcting narrative flow issues during the game's introduction.

1\. Logic & Mechanics (JavaScript)

* **XP Logic Refactor (Fix 030):**  
  * Removed unreliable AI-driven XP awards (xp\_gain key from AI prompt).  
  * Implemented calculateXPReward(resolution) helper function in index.html.  
  * Enforced a strict XP Matrix based on Roll Result and Tier:  
    * **Tier 2 Critical Success (11+):** \+2 XP  
    * **Tier 2 Success w/ Strain (8-10):** \+1 XP  
    * **Tier 1 Full Success (8+):** \+1 XP  
    * **All other results (including T1 Twist):** 0 XP  
* **Loot Logic Refinement (Fix 001):**  
  * Updated the looting check in handlePlayerAction. It now correctly awards **\+1 Coin** if the result string contains "SUCCESS" (covering FULL, CRITICAL, and TWIST results) *and* the player's input suggests looting intent.  
* **Phase Transition Fix (Fix 023):**  
  * Refactored handlePlayerAction to remove the secondary callAIGM call for the trigger\_first\_rumor\_mill event.  
  * The phase transition to 'rumor\_mill' is now handled automatically by the AI's response in the first call (narrateOutcome), preventing narrative disconnects and location jumps.  
* **Quest Progress Fix (Fix 028):**  
  * Updated displayQuestProgress to use null coalescing (|| 1\) for current\_chapter. This prevents the UI from displaying "undefined/1" before the quest data is fully initialized.  
* **Old Quest Cleanup (Fix 010):**  
  * Added deleteDoc for the current\_quest path in createCharacterAndStartGame to ensure a fresh quest state when starting a new game.

2\. User Interface (HTML/CSS/JS)

* **Persistent System Messages (Fix 013, 026):**  
  * Replaced transient "Toasts" (popups) with persistent \[SYSTEM\] messages in the main chat log for critical updates:  
    * Coin acquisition (\[SYSTEM\] \+1 Coin)  
    * XP gain (\[SYSTEM\] \+1 XP)  
    * Quest acceptance (\[SYSTEM\] Quest Accepted: ...)  
    * Location changes (\[SYSTEM\] 📍 ...)  
* **Character Sheet Label (Fix 029):**  
  * Changed the label "Exp" to "XP" in the character sheet UI for consistency.  
* **Quest Description (Fix 008):**  
  * Added a description field (\#quest-desc) to the Quest Sidebar to display the objective context.  
* **Interaction Loader (Fix 005):**  
  * Added a "Consulting the Oracle..." loading overlay to the interaction panel, providing visual feedback while waiting for the AI response.  
* **Help Modal Content (Fix 012):**  
  * Restored the "The Cost (Pips)" explanation section to the Help Modal, ensuring players can reference the damage rules.  
* **Typography (Fix 020):**  
  * Increased the font size of the quest description text in styles.css for better readability.

3\. Narrative AI (Prompt Engineering)

* **Unified Tutorial Exit (Fix 017, 023):**  
  * Updated narrateOutcome to handle the "Opening Scene Exception" as a single, unified task.  
  * The AI now writes the transition from the Tavern to the Hub *and* presents the rumors in one response, avoiding context loss.  
* **Rumor Mill Presentation (Fix 019, 024, 025):**  
  * Explicitly instructed the AI to list **ALL FOUR** Factions/Rumors (instead of a random 3\) to introduce the full world scope.  
  * Mandated bold formatting for Faction Goals (e.g., \*\*Goal: Order at any cost\*\*) and removed the confusing clock counter numbers from the narrative text.  
* **Quest Selection logic (Fix 018, 027):**  
  * Forbidden the AI from outputting quest\_update JSON during the *offer* phase (preventing the UI from updating too early).  
  * Mandated quest\_update JSON (with a clear description) *only* when the player explicitly selects a rumor.  
* **Loot & Harm Integrity (Fix 021, 022):**  
  * Mandated that if the narrative describes finding items, the AI *must* output a corresponding state\_update JSON.  
  * Added a directive preventing immediate, unavoidable combat damage on **FULL SUCCESS** results, preserving the integrity of the dice roll.

4\. Known Issues / Future Work

* **Tier 2 Logic:** The "Perilous" mechanics are implemented but require extensive playtesting to ensure the AI Classifier correctly identifies Tier 2 situations.  
* **Inventory Management:** While loot is added, there is currently no UI for dropping or managing inventory limits (Heavy items).

Status: Stable  
Deployed: v1.1.7