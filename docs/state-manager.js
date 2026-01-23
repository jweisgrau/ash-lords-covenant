// (Skipping edit as character is initialized in index.html)
// Replaces Firebase with localStorage + event-driven updates

const GAME_STATE_KEY = "ashlords_game_v1";
const BACKUP_KEY = "ashlords_game_v1_backup";

// State schema
const createFreshState = () => ({
  version: "1.0.0",
  userId: `local-${crypto.randomUUID()}`,
  character: null,
  gameState: {
    phase: "character_creation",
    turn_count: 0,
    saga_log: "The story begins...",
    current_location: "Unknown"
  },
  chatHistory: [],
  worldClocks: {
    clocks: []
  },
  destinyFrontClocks: {
    destiny: { current: 0, segments: 8 },
    front: { current: 0, segments: 8, name: "The Threat Looms" }
  },
  questState: {
    current_quest: null
  },
  campaign: null
});

// Validation
class StateValidator {
  static validate(updates, currentState) {
    const errors = [];

    if (updates.character) {
      const char = updates.character;

      // Stats bounds (-3 to +5)
      if (char.stats) {
        for (const [stat, val] of Object.entries(char.stats)) {
          if (val < -3 || val > 5) {
            errors.push(`Stat ${stat} out of bounds: ${val} (must be -3 to +5)`);
          }
        }
      }

      // Pips bounds (0 to 2)
      if (char.pips) {
        for (const [stat, pips] of Object.entries(char.pips)) {
          if (pips < 0 || pips > 2) {
            errors.push(`Pips ${stat} out of bounds: ${pips} (must be 0 to 2)`);
          }
        }
      }



      // XP non-negative
      if (char.xp !== undefined && char.xp < 0) {
        errors.push(`XP cannot be negative: ${char.xp}`);
      }
    }

    // Chat history size limit (30 messages)
    if (updates.chatHistory && updates.chatHistory.length > 30) {
      errors.push(`Chat history exceeds 30 messages (has ${updates.chatHistory.length})`);
    }

    if (errors.length > 0) {
      throw new Error("Validation failed:\n" + errors.join("\n"));
    }

    return true;
  }
}

// Error recovery
class ErrorRecovery {
  static recoverState() {
    // Try main state
    try {
      const stateStr = localStorage.getItem(GAME_STATE_KEY);
      if (stateStr) {
        const state = JSON.parse(stateStr);
        if (this.validateStructure(state)) {
          console.log("✅ Loaded state from localStorage");
          return state;
        }
      }
    } catch (e) {
      console.error("❌ Main state corrupted:", e);
    }

    // Try backup
    try {
      const backupStr = localStorage.getItem(BACKUP_KEY);
      if (backupStr) {
        const backup = JSON.parse(backupStr);
        if (this.validateStructure(backup)) {
          console.warn("⚠️ Recovered from backup state");
          return backup;
        }
      }
    } catch (e) {
      console.error("❌ Backup state corrupted:", e);
    }

    // Return fresh state
    console.log("🆕 Creating fresh state");
    return createFreshState();
  }

  static validateStructure(state) {
    return state &&
      state.version &&
      state.userId &&
      state.gameState &&
      Array.isArray(state.chatHistory);
  }

  static createBackup(state) {
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to create backup:", e);
    }
  }
}

// Transaction queue (prevents race conditions)
class TransactionQueue {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.queue = [];
    this.processing = false;
  }

  async enqueue(transaction) {
    return new Promise((resolve, reject) => {
      this.queue.push({ transaction, resolve, reject });
      this.processNext();
    });
  }

  async processNext() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const { transaction, resolve, reject } = this.queue.shift();

    try {
      // Transaction receives FRESH state, returns updates
      const updates = await transaction(this.stateManager.state);
      const result = await this.stateManager.updateState(updates);
      resolve(result);
    } catch (error) {
      console.error("Transaction failed:", error);
      reject(error);
    } finally {
      this.processing = false;
      this.processNext();
    }
  }
}

// Main state manager
class GameStateManager {
  constructor() {
    this.state = ErrorRecovery.recoverState();
    this.listeners = new Map();
    this.txQueue = new TransactionQueue(this);

    // Create backup on load
    ErrorRecovery.createBackup(this.state);
  }

  // Subscribe to state changes
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    // Immediately invoke with current state
    const slice = this.getStateSlice(key);
    if (slice !== null) {
      callback(slice);
    }
  }

  unsubscribe(key, callback) {
    this.listeners.get(key)?.delete(callback);
  }

  // Update state atomically
  async updateState(updates) {
    try {
      // Validate
      StateValidator.validate(updates, this.state);

      // Deep merge updates
      const newState = this.deepMerge(this.state, updates);

      // Persist
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(newState));

      // Backup every 5 turns
      if (newState.gameState?.turn_count % 5 === 0) {
        ErrorRecovery.createBackup(newState);
      }

      this.state = newState;

      // Notify subscribers
      this.notifySubscribers(updates);

      return { success: true };
    } catch (error) {
      console.error("State update failed:", error);
      return { success: false, error: error.message };
    }
  }

  deepMerge(target, source) {
    const output = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }

    return output;
  }

  notifySubscribers(updates) {
    for (const [key, callbacks] of this.listeners) {
      if (this.wasKeyAffected(key, updates)) {
        const slice = this.getStateSlice(key);
        callbacks.forEach(cb => {
          try {
            cb(slice);
          } catch (e) {
            console.error(`Listener error for ${key}:`, e);
          }
        });
      }
    }
  }

  wasKeyAffected(key, updates) {
    return key in updates || key === 'all';
  }

  getStateSlice(key) {
    switch (key) {
      case 'character': return this.state.character;
      case 'chatHistory': return this.state.chatHistory;
      case 'worldClocks': return this.state.worldClocks;
      case 'destinyFrontClocks': return this.state.destinyFrontClocks;
      case 'gameState': return this.state.gameState;
      case 'questState': return this.state.questState;
      case 'all': return this.state;
      default: return null;
    }
  }

  // Convenience methods
  getState() {
    return this.state;
  }

  async transaction(fn) {
    return this.txQueue.enqueue(fn);
  }

  // Export for backup
  exportState() {
    return JSON.stringify(this.state, null, 2);
  }

  // Import from backup
  importState(stateJson) {
    try {
      const imported = JSON.parse(stateJson);
      if (ErrorRecovery.validateStructure(imported)) {
        this.state = imported;
        localStorage.setItem(GAME_STATE_KEY, stateJson);
        ErrorRecovery.createBackup(imported);
        this.notifySubscribers({ all: true });
        return true;
      }
      return false;
    } catch (e) {
      console.error("Import failed:", e);
      return false;
    }
  }

  // Reset game
  reset() {
    this.state = createFreshState();
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(this.state));
    localStorage.removeItem(BACKUP_KEY);
    this.notifySubscribers({ all: true });
  }
}

// Export singleton
export const gameState = new GameStateManager();
export { createFreshState };
