export const MechanicsEngine = {
    // Parse player intent from text input
    // Priority: Check for ACTION VERBS first (anywhere in text), then fall back to narrative
    parseIntent(input) {
        const lower = input.toLowerCase().trim();

        // === PRIORITY 1: Check for action verbs ANYWHERE in the input ===

        // Combat - always Tier 2 (check first as it's highest stakes)
        if (/attack|fight|strike|hit|kill|stab|slash|punch|kick|shoot|throw.*(at|toward)|battle|duel|assault/.test(lower)) {
            return { needsRoll: true, stat: 'FORCE', tier: 2, type: 'combat' };
        }

        // Stealing/Pickpocketing - gives loot on success (check BEFORE general stealth)
        if (/pickpocket|steal|pilfer|filch|swipe|lift|loot|rob|take.*(coin|gold|money|purse|wallet|pouch)/.test(lower)) {
            return { needsRoll: true, stat: 'FINESSE', tier: 1, type: 'steal' };
        }

        // General Stealth/Finesse - no automatic loot
        if (/sneak|hide|stealth|creep|shadow|pick.*(lock)|climb|dodge|evade|escape|slip/.test(lower)) {
            return { needsRoll: true, stat: 'FINESSE', tier: 1, type: 'stealth' };
        }

        // Social/Influence - hostile = Tier 2
        if (/persuade|convince|negotiate|bribe|charm|seduce|intimidate|threaten|lie|deceive|bluff|manipulate|coerce/.test(lower)) {
            const isHostile = /threaten|intimidate|hostile|angry|suspicious|coerce/.test(lower);
            return { needsRoll: true, stat: 'INFLUENCE', tier: isHostile ? 2 : 1, type: 'social' };
        }

        // Investigation/Wits
        if (/search|investigate|find|discover|figure|solve|deduce|analyze|study|research|recall|remember|examine.*(closely|carefully)|inspect/.test(lower)) {
            return { needsRoll: true, stat: 'WITS', tier: 1, type: 'investigate' };
        }

        // Endurance/Resolve
        if (/endure|resist|withstand|brave|courage|face.*(fear|horror)|push through|keep going/.test(lower)) {
            return { needsRoll: true, stat: 'RESOLVE', tier: 1, type: 'endurance' };
        }

        // === PRIORITY 2: No action verbs found - check for narrative/dialogue ===

        // Simple observation (no hidden search intent)
        if (/^(look at|examine|observe|watch|look around)/.test(lower) && !/search|find|hidden|closely|carefully/.test(lower)) {
            return { needsRoll: false, type: 'narrative' };
        }

        // Simple dialogue (no persuasion intent)
        if (/^(ask|talk|speak|say|tell|greet|chat)/.test(lower) && !/persuade|convince|lie|threaten/.test(lower)) {
            return { needsRoll: false, type: 'dialogue' };
        }

        // Pure movement/waiting (ONLY if no other action verbs)
        if (/^(walk|leave|go|move|exit|enter|wait|rest|sleep)\b/.test(lower)) {
            return { needsRoll: false, type: 'narrative' };
        }

        // Default: ambiguous - will ask AI to classify or default to narrative
        return { needsRoll: false, type: 'narrative', ambiguous: true };
    },

    // Roll dice and calculate outcome
    rollDice(stat, tier, character, toolBonus = 0) {
        const randomValue = Math.random();
        const d10 = Math.floor(randomValue * 10) + 1;

        // Debug logging to monitor for patterns
        console.log(`🎲 Dice Roll Debug - Raw random: ${randomValue.toFixed(4)}, d10 result: ${d10}, stat: ${stat}, tier: ${tier}`);

        const statMod = character.stats[stat] || 0;
        const pips = character.pips?.[stat] || 0;
        const total = d10 + statMod + toolBonus - pips;

        let outcome;
        if (tier === 1) {
            // Tier 1: 8+ Success, 5-7 Cost, 4- Miss
            if (total >= 8) outcome = 'success';
            else if (total >= 5) outcome = 'cost';
            else outcome = 'miss';
        } else {
            // Tier 2: 11+ Full Success, 8-10 Minor Cost, 6-7 Major Cost, 5- Failure
            if (total >= 11) outcome = 'success';
            else if (total >= 8) outcome = 'minor_cost';
            else if (total >= 6) outcome = 'major_cost';
            else outcome = 'miss';
        }

        return { d10, statMod, pips, toolBonus, total, outcome, stat, tier };
    },

    // Calculate consequences based on roll result
    getConsequences(rollResult, actionType, oracleSystem) {
        const consequences = {
            xp_gain: 0,
            currency_gain: 0,
            add_pips: null,
            escalation: null,
            twist: null,
            description: '',
            stealContext: actionType === 'steal'
        };

        if (rollResult.outcome === 'success') {
            consequences.xp_gain = 1;
            if (actionType === 'steal') {
                consequences.description = 'Success! The AI will describe what was stolen based on the target.';
            } else {
                consequences.description = 'Success!';
            }
        } else if (rollResult.outcome === 'cost' || rollResult.outcome === 'minor_cost') {
            consequences.xp_gain = 1;
            const minorTwist = oracleSystem.rollMinorTwist();
            consequences.twist = minorTwist;

            if (actionType === 'steal') {
                consequences.description = `Success with complication! Partial loot - AI describes what was grabbed.`;
            } else {
                consequences.description = `Success with minor complication`;
            }
        } else if (rollResult.outcome === 'major_cost') {
            consequences.xp_gain = 1;
            const majorTwist = oracleSystem.rollMajorTwist();
            consequences.twist = majorTwist;
            consequences.add_pips = { stat: rollResult.stat, amount: 1 };

            if (actionType === 'steal') {
                consequences.description = `Success with major complication! Partial loot + injury.`;
            } else {
                consequences.description = `Success with major complication and injury`;
            }
        } else { // miss
            if (rollResult.tier === 2) {
                consequences.xp_gain = 1;
            }

            const severity = (rollResult.tier === 2 || actionType === 'combat') ? 2 : 1;
            consequences.add_pips = { stat: rollResult.stat, amount: severity };

            const flavor = oracleSystem.getInjuryFlavor(rollResult.stat, severity);
            consequences.description = severity >= 2
                ? `Failure with serious injury: ${flavor}`
                : `Failure with strain: ${flavor}`;

            if (actionType === 'steal') {
                consequences.description += ` (No loot obtained)`;
            }
        }

        return consequences;
    },

    // Format roll result for display and AI context
    formatRollResult(rollResult) {
        if (!rollResult) return '';
        const { d10, stat, statMod, pips, toolBonus, total, outcome, tier } = rollResult;
        const tierLabel = tier === 2 ? 'Perilous' : 'Challenging';
        const pipText = pips > 0 ? ` - ${pips}(Pips)` : '';
        const toolText = toolBonus > 0 ? ` + ${toolBonus}(Tool)` : '';
        const outcomeLabel = outcome === 'minor_cost' ? 'MINOR COST' :
            outcome === 'major_cost' ? 'MAJOR COST' : outcome.toUpperCase();
        return `Action: ${stat} (Tier ${tier} - ${tierLabel}). Roll: d10(${d10}) + ${statMod}(${stat})${toolText}${pipText} = ${total}. Result: ${outcomeLabel}`;
    }
};

export const InventorySystem = {
    getToolBonus(character, stat) {
        if (!character) return 0;
        const tool = (character.equipment || []).find(
            i => i.type === 'tool' && i.stat === stat
        );
        return tool ? (tool.bonus || 1) : 0;
    },

    getArmorPips(character, stat) {
        if (!character) return 0;
        const armor = (character.equipment || []).find(
            i => i.type === 'armor' && i.stat === stat
        );
        return armor ? (armor.pips || 0) : 0;
    },

    // Note: async damageArmor and addItem logic usually involve state updates
    // In this pure logic module, we'll extract the *calculation* parts if possible, 
    // but fully extracting async state methods might require passing the stateManager or callbacks.
    // For now, we will extract the pure logic helpers.
};

export const OracleSystem = {
    // Note: We need CONTENT_PACK_ASHLORDS to be passed in or imported. 
    // For a pure module, we should accept it as an argument or import it.
    // Assuming we pass it in for now to keep it pure and testable.

    rollMinorTwist(contentPack) {
        // Fallback or passed contentPack
        const twists = contentPack?.TIER_1_TWISTS || { General: ["A minor setback."] };
        const categories = Object.keys(twists);
        const category = categories[Math.floor(Math.random() * categories.length)];
        const table = twists[category];
        const entry = table[Math.floor(Math.random() * table.length)];
        return { category, description: entry, type: 'minor' };
    },

    rollMajorTwist(contentPack) {
        const table = contentPack?.TIER_2_TWISTS_WITTY || [{ complication: "Disaster", twist: "strikes." }];
        const entry = table[Math.floor(Math.random() * table.length)];
        return {
            complication: entry.complication,
            twist: entry.twist,
            description: `${entry.complication} ${entry.twist}`,
            type: 'major'
        };
    },

    getInjuryFlavor(stat, severity) {
        const INJURY_FLAVOR_TEXT = {
            FORCE: { strain: "Bruised and battered", injury: "Broken bone or deep gash" },
            FINESSE: { strain: "Sprained muscle", injury: "Torn ligament or nerve damage" },
            INFLUENCE: { strain: "Embarrassed", injury: "Reputation shattered" },
            WITS: { strain: "Headache", injury: "Concussion or mental trauma" },
            RESOLVE: { strain: "Shaken", injury: "Spirit broken" }
        };
        const flavor = INJURY_FLAVOR_TEXT[stat];
        if (!flavor) return severity >= 2 ? "Serious wound" : "Minor strain";
        return severity >= 2 ? flavor.injury : flavor.strain;
    }
};

export const TagSystem = {
    // Rate limit check logic
    checkRateLimit(tags, currentTurn) {
        if (tags.length > 0) {
            const lastTagTurn = Math.max(...tags.map(t => t.acquired_turn || 0));
            if (currentTurn - lastTagTurn < 10) {
                return { allowed: false, remaining: 10 - (currentTurn - lastTagTurn) };
            }
        }
        return { allowed: true };
    },

    checkCap(tags) {
        return tags.length < 5;
    }
};

export function processStateUpdateLogic(currentState, update) {
    // A pure function version of processStateUpdate
    // Takes state + update -> returns NEW partial state (does not mutate)

    const character = currentState.character;
    const nextState = {}; // Only what changed

    // XP Gain
    if (update.xp_gain) {
        nextState.character = {
            ...character,
            xp: (character.xp || 0) + update.xp_gain
        };
    }

    // Currency
    if (update.currency_gain !== undefined && update.currency_gain !== 0) {
        const amount = Number(update.currency_gain);
        if (!isNaN(amount) && amount !== 0) {
            const newCurrency = Math.max(0, (character.currency || 0) + amount);
            nextState.character = {
                ...(nextState.character || character),
                currency: newCurrency
            };
        }
    }

    // Pips (simplified logic for testing - real one handles array updates)
    if (update.add_pips) {
        const { stat, amount } = update.add_pips;
        const currentPips = { ...(character.pips || {}) };
        currentPips[stat] = Math.min(2, (currentPips[stat] || 0) + (amount || 1));
        nextState.character = {
            ...(nextState.character || character),
            pips: currentPips
        };
    }

    return nextState;
}

// Ensure global access for the UI if needed
if (typeof window !== 'undefined') {
    window.MechanicsEngine = MechanicsEngine;
    window.InventorySystem = InventorySystem;
    window.OracleSystem = OracleSystem;
    window.TagSystem = TagSystem;
}
