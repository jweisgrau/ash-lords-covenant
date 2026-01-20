import { describe, it, expect } from 'vitest';
import { MechanicsEngine, OracleSystem, processStateUpdateLogic } from '../docs/game-logic.js';

describe('MechanicsEngine', () => {

    describe('parseIntent', () => {
        it('identifies combat verbs as FORCE/Combat/Tier 2', () => {
            const result = MechanicsEngine.parseIntent("I attack the guard with my sword");
            expect(result).toEqual({ needsRoll: true, stat: 'FORCE', tier: 2, type: 'combat' });
        });

        it('identifies stealth verbs as FINESSE/Stealth/Tier 1', () => {
            const result = MechanicsEngine.parseIntent("I sneak past the sleeping guard");
            expect(result).toEqual({ needsRoll: true, stat: 'FINESSE', tier: 1, type: 'stealth' });
        });

        it('identifies stealing verbs as FINESSE/Steal/Tier 1', () => {
            const result = MechanicsEngine.parseIntent("I pickpocket the merchant's coin purse");
            expect(result).toEqual({ needsRoll: true, stat: 'FINESSE', tier: 1, type: 'steal' });
        });

        it('identifies social verbs correctly', () => {
            const result = MechanicsEngine.parseIntent("I convince him to let us pass");
            expect(result.stat).toBe('INFLUENCE');
            expect(result.type).toBe('social');
        });

        it('identifies investigation', () => {
            const result = MechanicsEngine.parseIntent("I search the room for clues");
            expect(result.stat).toBe('WITS');
            expect(result.type).toBe('investigate');
        });

        it('defaults to narrative for simple observation', () => {
            const result = MechanicsEngine.parseIntent("I look at the statue");
            expect(result).toEqual({ needsRoll: false, type: 'narrative', ambiguous: true });
        });
    });

    describe('rollDice', () => {
        // Mock Math.random to control dice rolls
        const mockRandom = (val) => {
            const original = Math.random;
            Math.random = () => val;
            return () => { Math.random = original; };
        };

        it('calculates Tier 1 success correctly', () => {
            const cleanup = mockRandom(0.79); // d10 = 8
            const char = { stats: { FORCE: 0 }, pips: { FORCE: 0 } };
            const result = MechanicsEngine.rollDice('FORCE', 1, char);
            expect(result.d10).toBe(8);
            expect(result.outcome).toBe('success');
            cleanup();
        });

        it('calculates Tier 1 cost correctly', () => {
            const cleanup = mockRandom(0.49); // d10 = 5
            const char = { stats: { FORCE: 0 }, pips: { FORCE: 0 } };
            const result = MechanicsEngine.rollDice('FORCE', 1, char);
            expect(result.d10).toBe(5);
            expect(result.outcome).toBe('cost');
            cleanup();
        });

        it('applies modifiers correctly', () => {
            const cleanup = mockRandom(0.49); // d10 = 5
            // +1 stat, -1 pip. Total shoud be 5 + 1 - 1 = 5.
            const char = { stats: { FORCE: 1 }, pips: { FORCE: 1 } };
            const result = MechanicsEngine.rollDice('FORCE', 1, char);
            expect(result.total).toBe(5);
            cleanup();
        });
    });
});

describe('processStateUpdateLogic', () => {
    it('applies XP gain', () => {
        const state = { character: { xp: 0 } };
        const update = { xp_gain: 5 };
        const next = processStateUpdateLogic(state, update);
        expect(next.character.xp).toBe(5);
    });

    it('applies Pips damage (clamped to 2)', () => {
        const state = { character: { pips: { FORCE: 0 } } };
        const update = { add_pips: { stat: 'FORCE', amount: 3 } };
        const next = processStateUpdateLogic(state, update);
        expect(next.character.pips.FORCE).toBe(2);
    });

    it('handles concurrency updates', () => {
        const state = { character: { currency: 10 } };
        const update = { currency_gain: -5 };
        const next = processStateUpdateLogic(state, update);
        expect(next.character.currency).toBe(5);
    });

    it('Tier 1 miss applies no pips', () => {
        const state = { character: { pips: { FINESSE: 0 } } };
        // Tier 1 miss (no severity logic in pure mechanics, just check description or lack of pips in consequences)
        // But getConsequences is where the logic lives. 
        // Let's test getConsequences instead or add a test for it.
    });
});

describe('getConsequences', () => {
    it('Tier 1 miss has NO pip damage', () => {
        const res = { outcome: 'miss', tier: 1, stat: 'FINESSE' };
        const consequences = MechanicsEngine.getConsequences(res, 'stealth', OracleSystem);
        expect(consequences.add_pips).toBeNull(); // Should be null or undefined
        expect(consequences.description).toContain('Failure');
        expect(consequences.description).not.toContain('strain');
    });

    it('Tier 2 miss has pip damage', () => {
        const res = { outcome: 'miss', tier: 2, stat: 'FORCE' };
        const consequences = MechanicsEngine.getConsequences(res, 'combat', OracleSystem);
        expect(consequences.add_pips).toEqual({ stat: 'FORCE', amount: 2 });
    });
});
