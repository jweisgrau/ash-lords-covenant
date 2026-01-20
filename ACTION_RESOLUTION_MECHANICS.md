# Action Resolution Mechanics
## The Ash-Lord's Covenant RPG System

---

## Core Philosophy
**Tiered Difficulty Assessment** - The GM evaluates how dangerous an action is before rolling, which determines the target number and stakes.

---

## The Three Tiers

### **TIER 0: Trivial**
**When to Use:**
- Character is competent at the task
- No meaningful opposition
- No significant risk of failure

**Resolution:** 
- **No roll required** - automatic success
- Used for routine tasks, basic movement, simple conversations
- Example: "You open the unlocked door" or "You climb the ladder"

**XP Awarded:** None (no risk, no reward)

---

### **TIER 1: Challenging**
**When to Use:**
- There's opposition OR risk of setback
- Failure would be inconvenient but not dangerous
- Character could reasonably retry

**Mechanic:**
- **Roll 1d10 + relevant stat modifier**
- The d10 generates 1-10, add your stat (-1 to +3)
- Typical range: 0 to 13

**Outcomes:**

| Roll Result | Outcome | Description |
|-------------|---------|-------------|
| **8+** | **Full Success** | You achieve your goal cleanly |
| **5-7** | **Success with Minor Cost** | You succeed BUT suffer a minor complication |
| **4 or less** | **Failure** | You don't achieve your goal, can retry |

**Minor Costs Examples:**
- Take 1 harm
- Lose a piece of equipment
- Create a complication
- Alert guards
- Waste time/resources

**XP Awarded:** 1 XP (even on success with cost)

**Examples:**
- Picking a lock while guards patrol nearby
- Convincing a merchant to lower prices
- Tracking someone through city streets
- Sneaking past inattentive guards

---

### **TIER 2: Perilous**
**When to Use:**
- Risk of serious harm, capture, or major loss
- High-stakes situations with real danger
- Failure has significant consequences

**Mechanic:**
- **Roll 1d10 + relevant stat modifier**
- Same die mechanics as Tier 1
- But target numbers are higher and stakes are greater

**Outcomes:**

| Roll Result | Outcome | Description |
|-------------|---------|-------------|
| **11+** | **Full Success** | You achieve your goal cleanly (rare!) |
| **8-10** | **Success with Minor Cost** | You succeed BUT take a complication |
| **6-7** | **Success with Major Cost** | You succeed BUT pay a heavy price |
| **5 or less** | **Failure with Consequence** | You fail AND suffer consequences |

**Major Costs Examples:**
- Take 2-3 harm
- Lose critical equipment
- Ally captured or injured
- Enemy gains major advantage
- Situation escalates dramatically

**XP Awarded:** 1 XP (for any attempt, regardless of outcome)

**Examples:**
- Fighting multiple armed opponents
- Infiltrating heavily guarded fortress
- Resisting Blight corruption
- Negotiating with hostile faction leader
- Defusing dangerous magical trap

---

## Stat Modifiers

Characters have 5 stats, each ranging from **-1 to +5**:

| Stat Value | Modifier | Meaning |
|------------|----------|---------|
| **-1** | -1 to rolls | Weak in this area |
| **0** | +0 to rolls | Average |
| **+1** | +1 to rolls | Competent |
| **+2** | +2 to rolls | Skilled |
| **+3** | +3 to rolls | Expert |
| **+4** | +4 to rolls | Legendary (achievement quest required) |
| **+5** | +5 to rolls | Mythic (legendary quest required, ends campaign) |

### The Five Stats

**FORCE:** Physical power, combat prowess, intimidation through presence

**FINESSE:** Agility, stealth, precision, sleight of hand

**INFLUENCE:** Persuasion, manipulation, leadership, social maneuvering  

**WITS:** Investigation, perception, knowledge, deduction

**RESOLVE:** Willpower, endurance, resisting temptation, mental fortitude

---

## GM Tier Evaluation Process

The GM (AI) follows this decision tree:

```
1. Is the character competent at this task?
   └─ Yes → Could be Tier 0
   
2. Is there opposition or risk of setback?
   └─ No → Tier 0
   └─ Yes → Continue to #3
   
3. Could this result in serious harm, capture, or major loss?
   └─ No → Tier 1
   └─ Yes → Tier 2
   
4. Does the character have a relevant talent?
   └─ Yes → May reduce tier by 1
```

**Examples of Tier Evaluation:**

| Action | Initial Tier | Reasoning | Final Tier |
|--------|--------------|-----------|------------|
| Pick simple lock, alone | Tier 1 | Opposition (lock), no danger | Tier 1 |
| Pick lock with guards nearby | Tier 1 | Risk of being spotted | Tier 1 |
| Pick lock during active combat | Tier 2 | Guards attacking, serious danger | Tier 2 |
| Sellsword charges into fight (Battle-Born talent) | Tier 2 → Tier 1 | Talent reduces combat danger | Tier 1 |
| Navigate city streets | Tier 0 | No opposition, routine task | Tier 0 |

---

## Special Mechanics

### **Extended Challenges**
For particularly difficult tasks (like final achievement quest chapters):
- **Requires 3 successful rolls** instead of 1
- Each roll uses same tier and stat
- Tracks progress: "2 of 3 successes achieved"
- Used for: climactic battles, complex heists, marathon endurance tests

### **Talents That Modify Tiers**

Some character talents reduce tier difficulty:

**Battle-Born (Sellsword):**
- When charging into fight: Combat is Tier 1 instead of Tier 2
- "You barely feel the hits—nothing stops you now"

**Hunted Your Kind (Hexenjäger):**
- First encounter with supernatural: Tier 2 → Tier 1
- "You've studied this creature type before"

### **Failure-Triggered Talents**

Some talents MUST activate on any failure:

**Shadow's Move (Haunted burden):**
- ANY failure (Tier 1 or Tier 2)
- Shadow MUST make a move:
  - Isolate you from allies
  - Whisper your deepest fears
  - Offer a dark bargain

---

## XP Award System

| Situation | XP Awarded |
|-----------|------------|
| Tier 0 success | 0 XP |
| Tier 1 success (any result) | 1 XP |
| Tier 1 failure | 0 XP |
| Tier 2 success (any result) | 1 XP |
| Tier 2 failure | 1 XP |
| Significant story achievement | 1 XP (bonus) |

**Key Principle:** XP rewards engaging with danger, not just success

---

## Action Resolution Flow (In Practice)

**1. Player Declares Action**
```
"I want to sneak past the guards into the alchemist's lab"
```

**2. GM Evaluates Tier**
```
- Character has FINESSE +2 (competent at stealth)
- Guards are alert but not actively searching
- Lab contains dangerous alchemical equipment
- Getting caught = serious consequences
→ TIER 2 (Perilous)
```

**3. GM Determines Stat**
```
Sneaking = FINESSE
```

**4. GM Announces & Rolls**
```
"This is TIER 2 (Perilous). You need 11+ for clean success.
Rolling FINESSE...
[rolls 1d10] = 7 + 2 (FINESSE) = 9 total
Result: SUCCESS WITH MINOR COST"
```

**5. GM Narrates Outcome**
```
"You slip past the guards, but one catches movement from 
the corner of his eye. He doesn't raise the alarm yet, 
but he's suspicious. You hear him calling for backup. 
You're in the lab—but the clock is ticking."

[State Update: +1 XP, tag_add: "Guards Alerted"]
```

---

## Probability Analysis

### Tier 1 Probability (Target: 8+)

| Stat | Success Rate | Partial Success | Failure |
|------|--------------|-----------------|---------|
| -1 | 20% | 40% | 40% |
| +0 | 30% | 40% | 30% |
| +1 | 40% | 40% | 20% |
| +2 | 50% | 40% | 10% |
| +3 | 60% | 40% | 0% |

### Tier 2 Probability (Target: 11+ for full success)

| Stat | Full Success | Minor Cost | Major Cost | Failure |
|------|--------------|------------|------------|---------|
| -1 | 0% | 0% | 20% | 80% |
| +0 | 0% | 10% | 20% | 70% |
| +1 | 0% | 20% | 20% | 60% |
| +2 | 10% | 20% | 20% | 50% |
| +3 | 20% | 20% | 20% | 40% |
| +4 | 30% | 20% | 20% | 30% |

**Key Insight:** Tier 2 is DANGEROUS even at high stats—failure is always possible, success often comes with costs.

---

## Design Principles

**1. Fiction First**
- Player describes what they want to do
- GM evaluates danger from fiction, not mechanics
- Tier emerges from narrative situation

**2. Failure Advances Story**
- Tier 1 failure: setback, can retry
- Tier 2 failure: consequences, situation worsens
- No "nothing happens" - always moves forward

**3. Costs Create Drama**
- Success with cost = tough choices
- "You succeed, but..." creates tension
- Even victories feel hard-won

**4. Asymmetric Information**
- Players don't know exact target numbers
- Creates authentic uncertainty
- Focus stays on fiction, not math

**5. Grimdark Reinforcement**
- High tiers mean danger is real
- Costs are narrative, not abstract
- Success often feels pyrrhic
- World doesn't care about fairness

---

## Quick Reference Card

### For Players

**When you act:**
1. Describe what you want to do
2. GM tells you the tier and which stat to use
3. Roll 1d10 + your stat modifier
4. GM narrates the outcome

**Remember:**
- Higher roll = better outcome
- Tier 2 is much more dangerous than Tier 1
- Even success may have costs
- Failure in Tier 2 = serious consequences

### For GMs

**Tier Evaluation:**
- Competent at task + no opposition = Tier 0 (no roll)
- Opposition or setback risk = Tier 1
- Serious danger or major consequences = Tier 2

**Rolling:**
- Always announce tier and stat before rolling
- Share the actual roll result and total
- Narrate outcomes with consequences built in

**Key Targets:**
- Tier 1: 8+ full success, 5-7 partial, 4- failure
- Tier 2: 11+ full success, 8-10 minor cost, 6-7 major cost, 5- failure with consequence

---

This system creates tension through genuine danger while ensuring story always progresses. The tiered approach lets the GM calibrate stakes to match the fiction, while the cost system ensures even success has weight in this grimdark world.
