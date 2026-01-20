// game_data.js
// Version 1.2.2 - The Asset System (Balance Patch & Narrative Loot)

export const INJURY_FLAVOR_TEXT = {
    "FORCE": { strain: "Winded, Muscle Spasm, Bruised", injury: "Broken Bone, Concussion, Torn Ligament" },
    "FINESSE": { strain: "Unsteady, Trembling, Off-Balance", injury: "Gashed Leg, Vertigo, Blinded" },
    "INFLUENCE": { strain: "Awkward, Stuttering, Misread Room", injury: "Humiliated, Blacklisted, Marked" },
    "WITS": { strain: "Distracted, Headache, Foggy", injury: "Hallucinating, Obsessed, Concussed" },
    "RESOLVE": { strain: "Hesitant, Shaken, Doubtful", injury: "Terrified, Broken Spirit, Hopeless" }
};

// --- NEW MASTER GEAR LIST (20 ITEMS) ---
// Logic: 5 Stats * (1 Regular Tool, 1 Heavy Tool, 1 Regular Armor, 1 Heavy Armor) = 20 Items
// Costs: Heavy = 3 XP, Regular = 5 XP.
export const MASTER_GEAR_LIST = [
    // --- FORCE ---
    { name: "Iron Gauntlets", type: "tool", stat: "FORCE", bonus: 1, tags: [], cost_xp: 5, desc: "+1 Force." },
    { name: "Siege Hammer", type: "tool", stat: "FORCE", bonus: 1, tags: ["heavy"], cost_xp: 3, desc: "+1 Force. Heavy." },
    { name: "Chainmail Jack", type: "armor", stat: "FORCE", pips: 2, max_pips: 2, tags: [], cost_xp: 5, desc: "Absorbs 2 Force Injury." },
    { name: "Plate Cuirass", type: "armor", stat: "FORCE", pips: 2, max_pips: 2, tags: ["heavy"], cost_xp: 3, desc: "Absorbs 2 Force Injury. Heavy." },

    // --- FINESSE ---
    { name: "Balanced Daggers", type: "tool", stat: "FINESSE", bonus: 1, tags: [], cost_xp: 5, desc: "+1 Finesse." },
    { name: "Sniper's Arbalest", type: "tool", stat: "FINESSE", bonus: 1, tags: ["heavy"], cost_xp: 3, desc: "+1 Finesse. Heavy." },
    { name: "Leather Brigandine", type: "armor", stat: "FINESSE", pips: 2, max_pips: 2, tags: [], cost_xp: 5, desc: "Absorbs 2 Finesse Injury." },
    { name: "Reinforced Greatcoat", type: "armor", stat: "FINESSE", pips: 2, max_pips: 2, tags: ["heavy"], cost_xp: 3, desc: "Absorbs 2 Finesse Injury. Heavy." },

    // --- INFLUENCE ---
    { name: "Guild Signet", type: "tool", stat: "INFLUENCE", bonus: 1, tags: [], cost_xp: 5, desc: "+1 Influence." },
    { name: "Herald's Staff", type: "tool", stat: "INFLUENCE", bonus: 1, tags: ["heavy"], cost_xp: 3, desc: "+1 Influence. Heavy." },
    { name: "Noble's Finery", type: "armor", stat: "INFLUENCE", pips: 2, max_pips: 2, tags: [], cost_xp: 5, desc: "Absorbs 2 Influence Strain." },
    { name: "Ceremonial Plate", type: "armor", stat: "INFLUENCE", pips: 2, max_pips: 2, tags: ["heavy"], cost_xp: 3, desc: "Absorbs 2 Influence Strain. Heavy." },

    // --- WITS ---
    { name: "Aether Lens", type: "tool", stat: "WITS", bonus: 1, tags: [], cost_xp: 5, desc: "+1 Wits." },
    { name: "Field Laboratory", type: "tool", stat: "WITS", bonus: 1, tags: ["heavy"], cost_xp: 3, desc: "+1 Wits. Heavy." },
    { name: "Alchemist's Apron", type: "armor", stat: "WITS", pips: 2, max_pips: 2, tags: [], cost_xp: 5, desc: "Absorbs 2 Wits Strain." },
    { name: "Hazmat Suit", type: "armor", stat: "WITS", pips: 2, max_pips: 2, tags: ["heavy"], cost_xp: 3, desc: "Absorbs 2 Wits Strain. Heavy." },

    // --- RESOLVE ---
    { name: "Iron Locket", type: "tool", stat: "RESOLVE", bonus: 1, tags: [], cost_xp: 5, desc: "+1 Resolve." },
    { name: "Penitent's Chains", type: "tool", stat: "RESOLVE", bonus: 1, tags: ["heavy"], cost_xp: 3, desc: "+1 Resolve. Heavy." },
    { name: "Sanctified Charm", type: "armor", stat: "RESOLVE", pips: 2, max_pips: 2, tags: [], cost_xp: 5, desc: "Absorbs 2 Resolve Strain." },
    { name: "Reliquary Shield", type: "armor", stat: "RESOLVE", pips: 2, max_pips: 2, tags: ["heavy"], cost_xp: 3, desc: "Absorbs 2 Resolve Strain. Heavy." }
];

export const CONTENT_PACK_ASHLORDS = {
    // --- NARRATIVE ESCALATION ---
    GENERIC_ESCALATIONS: [
        "The Ash-Wardens double their patrols.",
        "Supplies in the city run low; prices for food spike.",
        "A thick, unnatural smog descends on the district.",
        "Rumors of a new plague strain circulate in the slums.",
        "The Iron-Forgers begin locking down district gates."
    ],

    // --- CORE MECHANICS ---
    talent_mechanics: {
        "mercenary_code": { type: "passive", effect: "combat_tier_1_if_paid" },
        "shadow_walk": { type: "passive", effect: "stealth_tier_1" },
        "highborn": { type: "passive", effect: "high_status_social_tier_1" },
        "slayers_knowledge": { type: "passive", effect: "monster_lore_tier_1" },
        "artifact_attunement": { type: "passive", effect: "magic_device_tier_1" },
        "call_deep": { type: "active", benefit: "summon_blight_creature", cost: "advance_blight" },
        "chain_breaker": { type: "active", benefit: "shatter_binding", cost: "add_pips_hunted" },
        "symbiotic_surge": { type: "active", benefit: "auto_crit_force_resolve", cost: "advance_blight" },
        "mastermind": { type: "active", benefit: "flashback_solution", cost: "add_pips_wits" },
        "adrenaline_spike": { type: "active", benefit: "ignore_all_harm_scene", cost: "add_pips_force" }
    },

    // --- CALLINGS (Updated for Asset System v1.2.2 - Nerfed Start & Narrative Loot) ---
    callings: [
        {
            id: "sellsword", 
            name: "The Sellsword", 
            description: "Violence is your trade. You don't fight for honor; you fight for the payout.", 
            stats: { FORCE: 2, FINESSE: 0, INFLUENCE: -1, WITS: 0, RESOLVE: 0 }, 
            talents: [{ id: "mercenary_code", name: "Mercenary's Code", description: "Combat rolls count as Tier 1 (Challenging) instead of Tier 2 when you are being paid for the specific objective." }], 
            equipment: [
                { name: "Chainmail Jack", type: "armor", stat: "FORCE", pips: 2, max_pips: 2, tags: [], desc: "Absorbs 2 Force Injury." },
                { name: "Blood-Stained Contract", type: "loot", tags: ["valuable"], desc: "Proof of a job that toppled a kingdom. Validates the Succession War." }
            ]
        },
        {
            id: "cutthroat", 
            name: "The Cutthroat", 
            description: "You fight dirty. Shadows are your armor, and surprise is your only virtue.", 
            stats: { FORCE: -1, FINESSE: 2, INFLUENCE: 0, WITS: 0, RESOLVE: 0 }, 
            talents: [{ id: "shadow_walk", name: "Shadow Walk", description: "Hostile actions taken from hiding or shadows always count as Tier 1 (Challenging)." }], 
            equipment: [
                { name: "Leather Brigandine", type: "armor", stat: "FINESSE", pips: 2, max_pips: 2, tags: [], desc: "Absorbs 2 Finesse Injury." }, // Replaces Daggers
                { name: "Stolen Guild Ledger", type: "loot", tags: ["valuable"], desc: "Evidence of the Guild's corruption. Key to the Vault." }
            ]
        },
        {
            id: "disgraced", 
            name: "The Disgraced", 
            description: "You lost your title, but not your upbringing. You know how the high-born think.", 
            stats: { FORCE: 0, FINESSE: 0, INFLUENCE: 2, WITS: 0, RESOLVE: -1 }, 
            talents: [{ id: "highborn", name: "Highborn", description: "Social rolls against NPCs of high rank or status always count as Tier 1 (Challenging)." }], 
            equipment: [
                { name: "Noble's Finery", type: "armor", stat: "INFLUENCE", pips: 2, max_pips: 2, tags: [], desc: "Absorbs 2 Influence Strain." },
                { name: "Fractured Family Crest", type: "loot", tags: ["valuable"], desc: "The last piece of your heritage. A symbol to unite the Houses." }
            ]
        },
        {
            id: "hexenjager", 
            name: "The Hexenjager", 
            description: "You hunt the things that go bump in the night. You have the tools and the knowledge.", 
            stats: { FORCE: 0, FINESSE: 0, INFLUENCE: -1, WITS: 0, RESOLVE: 2 }, 
            talents: [{ id: "slayers_knowledge", name: "Slayer's Knowledge", description: "Rolls to track, identify, or harm Beasts and Blighted Monstrosities always count as Tier 1 (Challenging)." }], 
            equipment: [
                { name: "Sanctified Charm", type: "armor", stat: "RESOLVE", pips: 2, max_pips: 2, tags: [], desc: "Absorbs 2 Resolve Strain." },
                { name: "Cursed Fetish", type: "loot", tags: ["valuable"], desc: "It whispers of the Shadow Realm. Key to the Trial." }
            ]
        },
        {
            id: "arcanist", 
            name: "The Arcanist", 
            description: "A scholar-engineer of the supernatural. You use devices to handle what others fear.", 
            stats: { FORCE: -1, FINESSE: 0, INFLUENCE: 0, WITS: 2, RESOLVE: 0 }, 
            talents: [{ id: "artifact_attunement", name: "Artifact Attunement", description: "Rolls to use, disable, or resist magical devices/traps always count as Tier 1 (Challenging). You can identify properties safely." }], 
            equipment: [
                { name: "Alchemist's Apron", type: "armor", stat: "WITS", pips: 2, max_pips: 2, tags: [], desc: "Absorbs 2 Wits Strain." },
                { name: "Encoded Cipher", type: "loot", tags: ["valuable"], desc: "Fragments of the First Tongue. Unlocks the Codex." }
            ]
        }
    ],

    // --- BURDENS ---
    burdens: [
        {
            id: "blight_marked",
            name: "The Blight-Marked",
            description: "The Blight recognizes you. You can call to it, but it calls back.",
            requiresInput: false,
            stats: { FORCE: -1, FINESSE: 0, INFLUENCE: 1, WITS: 0, RESOLVE: 0 },
            talents: [{ id: "call_deep", name: "Call of the Deep", description: "Summon a Blighted Creature to fight for you. COST: Advance Blight Track (+1 Stage)." }]
        },
        {
            id: "vow_breaker",
            name: "The Vow-Breaker",
            description: "You broke a binding. You can break others, but the shadows hunt you.",
            requiresInput: false,
            stats: { FORCE: 0, FINESSE: 1, INFLUENCE: 0, WITS: 0, RESOLVE: -1 },
            talents: [{ id: "chain_breaker", name: "Chain-Breaker", description: "Instantly shatter any physical or magical binding. COST: Gain 2 Pips (Injury) to RESOLVE." }]
        },
        {
            id: "vessel",
            name: "The Vessel",
            description: "Something lives inside you. It lends you strength, but eats your mind.",
            requiresInput: false,
            stats: { FORCE: 0, FINESSE: 0, INFLUENCE: 0, WITS: -1, RESOLVE: 1 },
            talents: [{ id: "symbiotic_surge", name: "Symbiotic Surge", description: "Auto-succeed on FORCE/RESOLVE with Critical Success. COST: Advance Blight Track (+1 Stage)." }]
        },
        {
            id: "schemer",
            name: "The Schemer",
            description: "You always have a plan. The stress of maintaining the lies is killing you.",
            requiresInput: false,
            stats: { FORCE: 0, FINESSE: 0, INFLUENCE: -1, WITS: 1, RESOLVE: 0 },
            talents: [{ id: "mastermind", name: "Mastermind", description: "Flashback: You prepared for this exact situation (bribe, item, sabotage). COST: Gain 2 Pips (Injury) to WITS (Paranoid)." }]
        },
        {
            id: "berserker",
            name: "The Berserker",
            description: "You are unstoppable in the moment, but you break when the red haze clears.",
            requiresInput: false,
            stats: { FORCE: 1, FINESSE: -1, INFLUENCE: 0, WITS: 0, RESOLVE: 0 },
            talents: [{ id: "adrenaline_spike", name: "Adrenaline Spike", description: "Surge of violence. Auto-succeed on a Force action and ignore enemy damage this turn. COST: Gain 2 Pips (Injury) to FORCE immediately." }]
        }
    ],

    // --- ENDGAME FRONTS ---
    endgame_fronts: {
        sellsword: { 
            front_id: "iron_throne_succession_crisis", 
            name: "The Succession War", 
            description: "Five mercenary captains vie for the Iron Throne...", 
            grim_portents: [
                { at: 2, event: "Captain Ironheart defeats Captain Redblade..." }, 
                { at: 4, event: "Ironheart lays siege to Blackwall Fortress..." }, 
                { at: 6, event: "Ironheart wins the siege..." }, 
                { at: 8, event: "CATASTROPHE: Ironheart claims throne..." }
            ], 
            bad_ending: "Ironheart sits the Iron Throne..." 
        },
        cutthroat: { 
            front_id: "guild_conspiracy_exposed", 
            name: "The Guild's Tightening Grip", 
            description: "The Alchemist's Guild consolidates power...", 
            grim_portents: [
                { at: 2, event: "Guild raises 'Blight Tax' again..." }, 
                { at: 4, event: "Guild starts arresting 'Blight-carriers'..." }, 
                { at: 6, event: "Guild reveals 'miracle cure'..." }, 
                { at: 8, event: "CATASTROPHE: Guild becomes de facto rulers..." }
            ], 
            bad_ending: "The Guild's control is complete..." 
        },
        disgraced: { 
            front_id: "house_extinction", 
            name: "The Name Dies", 
            description: "Your family's enemies consolidate...", 
            grim_portents: [
                { at: 2, event: "Your enemy claims your family's ancestral lands..." }, 
                { at: 4, event: "Your family crest is publicly defaced..." }, 
                { at: 6, event: "The last elder who remembers your family's truth dies..." }, 
                { at: 8, event: "CATASTROPHE: Your family name is formally erased..." }
            ], 
            bad_ending: "Your family name is gone..." 
        },
        hexenjager: { 
            front_id: "blight_spreads_unstoppable", 
            name: "The Ash-Lord Awakens", 
            description: "The Blight spreads faster...", 
            grim_portents: [
                { at: 2, event: "Blight corruption spreads..." }, 
                { at: 4, event: "First Ash-Lord cultists appear..." }, 
                { at: 6, event: "The Ash-Lord's presence is felt..." }, 
                { at: 8, event: "CATASTROPHE: The Ash-Lord fully awakens..." }
            ], 
            bad_ending: "The Ash-Lord rises..." 
        },
        arcanist: { 
            front_id: "aether_collapse", 
            name: "The Reality Breach", 
            description: "The barrier between worlds is failing...", 
            grim_portents: [
                { at: 2, event: "Gravity anomalies reported in the slums..." }, 
                { at: 4, event: "Ghosts become visible to everyone at noon..." }, 
                { at: 6, event: "The Sky-Citadel vanishes into the Aether..." }, 
                { at: 8, event: "CATASTROPHE: The city dissolves into raw magic..." }
            ], 
            bad_ending: "Reality unravels..." 
        }
    },

    // --- ACHIEVEMENT QUESTS ---
    achievement_quests: {
        FORCE: {
            quest_id: "arena_champion_duel",
            title: "Blood on the Iron",
            intro: "Word spreads: the Arena of Iron Fangs seeks challengers for its undefeated champion, Kael the Unchained. Three years. No losses. No mercy.",
            chapters: [
                { chapter: 1, title: "The Gauntlet", objective: "Prove yourself worthy by defeating three lesser champions", tier: 2, stat: "FORCE", xp_reward: 2 },
                { chapter: 2, title: "The Champion's Challenge", objective: "Face Kael in ritual combat before the Iron Assembly", tier: 2, stat: "FORCE", extended: true, xp_reward: 3 }
            ],
            success: { narrative: "Kael falls. The crowd roars. You are now the Champion of Iron Fangs.", stat_increase: "FORCE", tags_add: ["Champion of Iron Fangs"] },
            integration: "The Iron Arena is tied to the Mercenary Captains Front."
        },
        FINESSE: {
            quest_id: "vault_of_mirrors_heist",
            title: "The Impossible Theft",
            intro: "The Alchemist's Guild controls the city through one source: The Vault of Mirrors. Never breached. Never robbed. Until now.",
            chapters: [
                { chapter: 1, title: "The Inside Man", objective: "Recruit a guild insider or steal the vault blueprints", tier: 2, stat: "FINESSE", xp_reward: 2 },
                { chapter: 2, title: "The Heist", objective: "Infiltrate the vault, disable wards, steal the guild's fortune", tier: 2, stat: "FINESSE", extended: true, xp_reward: 3 }
            ],
            success: { narrative: "The vault is empty. You vanish into legend—the thief who did the impossible.", stat_increase: "FINESSE", tags_add: ["Master Thief", "Guild Enemy"] },
            integration: "Success bankrupts the Guild Front."
        },
        INFLUENCE: {
            quest_id: "unite_rival_houses",
            title: "The Peacemaker's Gambit",
            intro: "Two noble houses have warred for a generation. The city bleeds. You see an opportunity.",
            chapters: [
                { chapter: 1, title: "The Secret Meeting", objective: "Convince both houses to negotiate, despite decades of hatred", tier: 2, stat: "INFLUENCE", xp_reward: 2 },
                { chapter: 2, title: "The Marriage Alliance", objective: "Broker a political marriage or treaty that both sides will honor", tier: 2, stat: "INFLUENCE", xp_reward: 3 }
            ],
            success: { narrative: "The houses unite. The city celebrates. You are the architect of peace.", stat_increase: "INFLUENCE", tags_add: ["The Peacemaker"] },
            integration: "The peace won't last—you know it. But you bought time."
        },
        WITS: {
            quest_id: "decipher_ancient_codex",
            title: "The Scholar's Obsession",
            intro: "The Codex of Ancients has stumped scholars for 200 years. You've found a lead.",
            chapters: [
                { chapter: 1, title: "The Missing Key", objective: "Locate the cipher key hidden in the city's oldest library", tier: 2, stat: "WITS", xp_reward: 2 },
                { chapter: 2, title: "The Translation", objective: "Decipher the codex and learn its terrible secret", tier: 2, stat: "WITS", xp_reward: 3 }
            ],
            success: { narrative: "You solve it. The codex reveals the origin of the Blight. Knowledge is power... and burden.", stat_increase: "WITS", tags_add: ["Scholar of the Forbidden"] },
            integration: "Codex reveals that Blight was CREATED..."
        },
        RESOLVE: {
            quest_id: "trial_of_shadows",
            title: "The Unbroken",
            intro: "The Trial of Shadows is an ancient ordeal. Face your deepest fears. Survive, or be consumed.",
            chapters: [
                { chapter: 1, title: "Enter the Shadow Realm", objective: "Willingly enter the supernatural trial ground", tier: 2, stat: "RESOLVE", xp_reward: 2 },
                { chapter: 2, title: "The Gauntlet of Fears", objective: "Endure three manifestations of your worst nightmares", tier: 2, stat: "RESOLVE", extended: true, xp_reward: 3 }
            ],
            success: { narrative: "You emerge, unbroken. Your will is iron. Nothing can break you now.", stat_increase: "RESOLVE", tags_add: ["Unbreakable Will"] },
            integration: "Trial tests your deepest fears..."
        }
    },

    // --- FACTIONS ---
    FACTIONS: [
        { id: "ash_wardens", name: "The Ash-Wardens", goal: "Order at any cost" },
        { id: "soot_stained", name: "The Soot-Stained", goal: "Black market control" },
        { id: "iron_forgers", name: "The Iron-Forgers", goal: "Tech monopoly" },
        { id: "whispering_flesh", name: "Whispering Flesh", goal: "Accelerate Blight" }
    ],
    
    FACTION_CONDITIONS: {
        "ash_wardens": { 
            name: "Martial Law", 
            effect: "Checkpoints everywhere. Movement requires a Bribe or Stealth check. All illicit transactions are Tier 2 (Perilous)." 
        },
        "soot_stained": { 
            name: "Crime Wave", 
            effect: "The streets are ungoverned. You cannot safely Rest in the city (Conditions persist). Acquiring Assets costs +1 XP." 
        },
        "iron_forgers": { 
            name: "Industrial Smog", 
            effect: "Thick, choking fumes. -1 to FINESSE (Vision) and FORCE (Breathing) while outdoors. Tech prices double." 
        },
        "whispering_flesh": { 
            name: "The Thin Veil", 
            effect: "The barrier rot is absolute. All RESOLVE checks (Fear/Corruption) are Tier 2 (Perilous). 'Shaken' condition cannot be cleared." 
        }
    },
    
    ORACLES: {
         ACTIONS: ["Abandon", "Accuse", "Afflict", "Ambush", "Assault", "Await", "Bargain", "Betray", "Blame", "Bleed", "Blight", "Block", "Break", "Bribe", "Burden", "Burn", "Bury", "Censor", "Coerce", "Collapse", "Condemn", "Confess", "Confine", "Consume", "Corrupt", "Covert", "Crave", "Cripple", "Crush", "Curse", "Deceive", "Decay", "Defile", "Demand", "Deny", "Desecrate", "Despair", "Destroy", "Disguise", "Exploit", "Extort", "Falter", "Fester", "Flee", "Forsake", "Frame", "Gnaw", "Grieve", "Grudge", "Haunt", "Hide", "Hinder", "Hoard", "Hunt", "Imprison", "Infect", "Inquire", "Isolate", "Lament", "Lure", "Mute", "Mutate", "Neglect", "Oppose", "Overthrow", "Persecute", "Poison", "Pollute", "Punish", "Pursue", "Ransack", "Refuse", "Reject", "Repress", "Resent", "Restrain", "Revenge", "Rot", "Ruin", "Sabotage", "Scorn", "Scrounge", "Seize", "Sever", "Shatter", "Silence", "Smuggle", "Steal", "Struggle", "Subvert", "Suffer", "Suppress", "Suture", "Taint", "Threaten", "Toil", "Torment", "Usurp", "Weaken", "Wither"],
         THEMES: ["Authority", "Ash", "Addiction", "Ally", "Ambition", "Bargain", "Betrayal", "Blight", "Blood", "Body", "Bone", "Burden", "Bureaucracy", "Chain", "Cinder", "Community", "Conspiracy", "Covenant", "Greed", "Curse", "Debt", "Deceit", "Decree", "Despair", "Desperation", "Desolation", "Disease", "Dogma", "Doubt", "Duty", "Envy", "Evidence", "Execution", "Faction", "Faith (Shaken)", "Family", "Fear", "Filth", "Grave", "Heresy", "Home", "Hope (False)", "Hunger", "Ignorance", "Infection", "Iron", "Jealousy", "Judgment", "Justice", "Knowledge", "Labor", "Law", "Legacy", "Lie", "Loss", "Lust", "Madness", "Memory", "Mercy", "Price", "Pride", "Prison", "Privilege", "Prophecy", "Protection", "Power", "Punishment", "Rags", "Rat", "Rations", "Refuge", "Regret", "Religion", "Resource", "Revenge", "Ruin", "Rumor", "Rust", "Secret", "Slum", "Soot", "Sorrow", "Soul", "Superstition", "Survival", "Swarm", "Taint", "Tithe", "Tradition", "Treachery", "Truth", "Tyranny", "Vengeance", "Vermin", "Vice", "Victim", "Wall", "Weakness", "Wound"],
         LOCATIONS: ["Abbey", "Altar", "Alley", "Archive", "Armory", "Asylum", "Bastion", "Baths", "Bell-Tower", "Bone-Yard", "Breach", "Bridge", "Canal", "Catacomb", "Cathedral", "Cenotaph", "Chapel", "Charnel House", "Cistern", "Citadel", "Courthouse", "Court", "Cradle", "Crematorium", "Crossroad", "Crypt", "Dam", "Den", "Dock", "Drain", "Dungeon", "Embassy", "Exchange", "Fane", "Flophouse", "Forge", "Fort", "Foundry", "Gallows", "Gaol", "Kennel", "Lamp-Post", "Labyrinth", "Library", "Lighthouse", "Lock", "Manufactory", "Market", "Memorial", "Menagerie", "Mill", "Monument", "Morgue", "Museum", "Nursery", "Observatory", "Orphanage", "Ossuary", "Pen", "Pit", "Prison", "Processing", "Pump-Station", "Quarry", "Rack", "Refinery", "Reliquary", "Rookery", "Rook's", "Sanatorium", "Scriptorium", "Sepulcher", "Sewer-Canal", "Shaft", "Shambles", "Shrine", "Slaughterhouse", "Slum", "Spire", "Stable", "Stockade", "Stockyard", "Stone", "Sump", "Tannery", "Temple", "Tenement", "Terminus", "Theatre", "Tomb", "Tower", "Undercroft", "Veldt", "Viaduct", "Wall", "Warren", "Waste", "Well", "Wharf", "Workshop"]
    },

    TIER_1_TWISTS: [
        "Momentary hesitation costs you the initiative.",
        "You attract unwanted attention from a nearby observer.",
        "A piece of gear is strained or dropped (no damage, just awkward).",
        "You waste a valuable resource (time, supplies, ammo).",
        "You succeed, but receive bad information mixed with the good.",
        "You make noise that echoes dangerously.",
        "You offend a minor social protocol.",
        "You end up in a precarious position (not yet dangerous, but poor leverage).",
        "The environment shifts against you (lights dim, crowd presses in)."
    ],

    TIER_2_TWISTS: [
        {complication: "New Enemy", twist: "Arrives now"}, 
        {complication: "Betrayal", twist: "For money"}, 
        {complication: "Blight Surge", twist: "Environment twists"}
    ]
};