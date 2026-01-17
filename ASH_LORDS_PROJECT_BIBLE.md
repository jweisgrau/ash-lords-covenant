# PROJECT BIBLE: The Ash-Lord's Covenant (v1.0)

## 1. Core Identity
**Genre:** Grimdark Political Fantasy / "Witty Grimdark"
**Format:** Text-based Digital RPG (Web/Mobile)
**Engine:** "Stateful Wrapper" architecture on Firebase (Gemini AI + Firestore)
**Design Philosophy:** "Narrativist Engine on a Simulationist Chassis"
* **Narrativist:** "Fail forward" mechanics, trinary outcomes (Success/Cost/Miss).
* **Simulationist:** Persistent world state, faction clocks that tick independently of the player.

## 2. The "Cynical Truth" Narrative
The world is dying from **The Blight**, a supernatural corruption.
* **The Lie (Epic Fantasy):** "We must stop the ancient evil!"
* **The Truth (Grimdark):** The Blight is a tool used by human factions.
    * **The Alchemist's Guild:** Created the Blight to sell the cure.
    * **The Iron Council:** Uses Blight fear to enforce martial law.
    * **The Ash-Lord:** Feeds people to the Blight to keep a worse evil sealed.

## 3. Key Mechanics (Implemented)

### A. Character System (Two-Axis)
* **Calling (Job):** Sellsword, Cutthroat, Disgraced, Hexenjager, Channeler.
* **Burden (Flaw):** Blood-Marked, Vow-Breaker, Corrupted, Debtor, Hollow.
* **Stats:** FORCE, FINESSE, INFLUENCE, WITS, RESOLVE (Range: -1 to +3 start, max +5).

### B. The Clock System
1.  **Destiny Clock (Player):** 8 Segments. Tracks progression to "Legend".
    * Advances via: Stat +3, Achievement Quests, XP thresholds.
2.  **Front Clock (World):** 8 Segments. Tracks the "Bad Ending".
    * Advances via: Acts (time passing), failed quests.
    * **Catastrophe:** If Front reaches 8/8 before Destiny, campaign ends in tragedy.

### C. Quest Structure
1.  **Investigative Scores:** Standard play. Gather info -> Reveal Truth -> Heist/Kill.
2.  **Achievement Quests:** Triggered at Stat +3. 
    * Cost: 15 XP (Locked).
    * Reward: Stat +4, "Legendary" Tag.
3.  **Legendary Quests:** Triggered at Stat +4 + High Destiny.
    * The Campaign Finale.
    * Success = Victory Ending. Failure = Tragedy Ending.

## 4. Tech Stack & Architecture
* **Frontend:** HTML/CSS/JS (Vanilla + Modules).
* **Backend:** Firebase (Auth, Firestore).
* **AI:** Gemini 1.5 Pro (via API).
* **Logic:** "Platform-to-Pack". Logic is hardcoded in JS; Content is JSON data.
    * `game_data.js`: Stores all text, quests, items.
    * `index.html`: Stores the engine logic.

## 5. Backlog & Roadmap
* **Multiplayer:** Not started.
* **Export Story:** Planned feature to download narrative log as `.txt`.
* **Human GM Mode:** Admin panel to override AI decisions (Not started).
* **Mobile Optimization:** Functional but needs polish.

## 6. Current "Truths" (For AI Context)
* **NPCs:** Always have an Instinct (Greed/Fear) vs Obligation (Duty).
* **Magic:** Hard/Dangerous. "The Blight" corrupts users.
* **Tone:** Cynical. No "good" factions, only "lesser evils."
* **Investigation:** Rumor is always a lie; Truth is always worse.