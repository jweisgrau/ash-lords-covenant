# **RPG PROJECT BIBLE: The Ash-Lord's Covenant (v1.2.2)**

Architecture: Stateful Wrapper (Firebase \+ Gemini)  
Tone: Grimdark Political Fantasy / "Witty Grimdark"  
Current System: The Asset Economy (v1.2)

## **1\. Core Identity & Philosophy**

* **The Lie:** "We must stop the ancient evil\!"  
* **The Truth:** The Blight is a resource. The Alchemist's Guild manufactures it; the Iron-Forgers weaponize it; the Ash-Wardens use it to justify martial law.  
* **Player Role:** A disposable asset trying to survive the "Death Spiral" long enough to become a Legend.  
* **Design Pillars:**  
  * **Simulationist Chassis:** Hard math for Pips, Clocks, and XP. The AI cannot cheat these.  
  * **Narrativist Engine:** The AI handles the "color" and "consequences" within the math's constraints.

## **2\. The Mechanics (Iron Logic)**

### **A. The Action Roll (d10 System)**

**Formula:** 1d10 \+ Stat \+ Tool Bonus

* **Tier 1: Challenging (Standard Risk)**  
  * **8+:** Full Success.  
  * **5-7:** Success with **Twist** (Complication, No Damage).  
  * **4-:** Failure (1 Pip Strain).  
* **Tier 2: Perilous (Lethal / Outnumbered)**  
  * **11+:** Critical Success (+2 XP).  
  * **8-10:** Success with **Strain** (1 Pip).  
  * **6-7:** Major Cost (**Injury** / 2 Pips).  
  * **5-:** Disaster (Failure \+ Injury \+ Complication).

### **B. The Damage System (Ablative Logic)**

Damage is strictly tracked via **Diamond Pips \[x\]**.

1. **Armor First (Cyan Pips):** If the character has equipped **Armor** for the targeted stat, damage is deducted from the Armor's pips first. Armor does *not* regenerate naturally.  
2. **Strain (1 Red Pip):** Minor harm (-1 to rolls). Clears with **Rest** (Interlude).  
3. **Injury (2 Red Pips):** Structural harm (-2 to rolls). Requires **Medical Aid** (Burning a *Valuable*).  
4. **Death:** If **10 Total Pips** (across all stats) are filled, the character dies.

### **C. The Asset Economy (Barter & Blood)**

"Coin" is dead. The economy is driven by **XP** (Growth) and **Valuables** (Survival).

* **XP (Experience):** earned by surviving risks (Tier 2 Crits/Successes).  
  * **Spend 5 XP:** Buy Standard Gear (Tool/Armor).  
  * **Spend 3 XP:** Buy Heavy Gear (Risk of Overburdened).  
  * **Spend 6 XP:** Train Stat (+1 Permanent, Max \+4).  
* **Valuables:** Rare narrative items (e.g., *Stolen Guild Ledger*, *Golden Idol*).  
  * **Usage:** Burned (destroyed) during Interlude to perform **Recovery** (Heal Injury) or **Repair** (Fix Armor).  
  * **Starting Loadout:** Every character begins with one specific *Valuable* linked to their Destiny Quest.

## **3\. Character Options**

### **Stats**

* **FORCE:** Violence, coercion, physical power.  
* **FINESSE:** Precision, stealth, agility.  
* **INFLUENCE:** Charm, deception, authority.  
* **WITS:** Observation, lore, intuition, engineering.  
* **RESOLVE:** Willpower, endurance, resisting corruption.

### **Gear Types**

* **Tools:** Grant **\+1 Bonus** to a specific Stat. (e.g., *Balanced Daggers* for Finesse).  
* **Armor:** Provides **Ablative Pips** (2) for a specific Stat.  
* **Heavy Gear:** Cheaper (3 XP) but counts toward "Overburdened" (-1 Finesse/Force if \>2 items).

### **Destiny & Progression**

* **The Destiny Clock:** The UI automatically labels this clock based on the character's **Highest Stat**.  
  * *Force:* "Blood on the Iron" (Arena Champion)  
  * *Finesse:* "The Impossible Theft" (Vault Heist)  
  * *Influence:* "The Peacemaker's Gambit" (Noble Unity)  
  * *Wits:* "The Scholar's Obsession" (Ancient Codex)  
  * *Resolve:* "The Unbroken" (Trial of Shadows)  
* **Endgame Trigger:** When a Stat reaches **\+4** (Legendary) OR the **Destiny Clock** fills (8/8), the Endgame Quest begins.

## **4\. The Game Cycle**

1. **Rumor Phase:** The AI presents 3 objectives derived from the active **Faction Clocks**.  
2. **Quest Phase:** The player engages in Tier 1 / Tier 2 risks.  
   * *Success:* Faction Clock \-2, XP Gain, Loot (Valuable).  
   * *Failure:* Faction Clock \+2, Injury.  
3. **Interlude (Safe Haven):**  
   * **Train:** Spend 6 XP (+1 Stat).  
   * **Shop:** Spend XP for Tools/Armor.  
   * **Recover:** Burn a *Valuable* to clear Injury/Repair Armor.  
   * **Rest:** Clear Strain (Free).

## **5\. Technical Architecture (v1.2.2)**

### **The Logic Layer (JavaScript)**

* **Source of Truth:** resolveMechanics() handles all dice math and damage distribution.  
* **State Updates:** The JS explicitly constructs specific update objects:  
  * { update\_armor: { name: "...", new\_pips: X } }  
  * { stat\_increase: { stat: "...", amount: 1 } }  
* **Directives:** The AI is strictly forbidden from inventing mechanics. It must render the JS output.

### **The Narrative Layer (AI/Gemini)**

* **Context:** Must respect recentNarrativeHistory and game\_data.js lists.  
* **Loot:** When the narrative implies finding an item, the AI must output the corresponding JSON equipment\_add.