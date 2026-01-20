export const DebugSystem = {
    logs: [],
    maxLogs: 50,

    // Log a mechanical event (called by MechanicsEngine)
    logEvent(type, detail) {
        const entry = {
            timestamp: new Date().toISOString(),
            type,
            detail
        };
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        console.log(`[Mechanics] ${type}:`, detail); // Also log to console for devtools
    },

    // Capture full context for a bug report
    captureContext(gameStateManager) {
        if (!gameStateManager) return { error: "No GameStateManager found" };

        const state = gameStateManager.getState();

        // Sanitize state for export (remove potentially enormous history if needed, but we likely want it)
        const exportState = {
            version: state.version,
            turn: state.gameState?.turn_count,
            phase: state.gameState?.phase,
            character: state.character, // Stats, Pips, Inventory
            worldClocks: state.worldClocks,
            tags: state.tags,
            // Last 20 chat messages for immediate context
            recentChat: (state.chatHistory || []).slice(-20)
        };

        return {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            mechanicalLogs: this.logs,
            gameState: exportState
        };
    },

    // Format report as Markdown for clipboard
    formatReport(userDescription, context) {
        return `
# Bug Report
**Timestamp**: ${context.timestamp}
**User Description**: 
> ${userDescription.replace(/\n/g, '\n> ')}

## Mechanical Log (Last 50 Events)
\`\`\`
${context.mechanicalLogs.map(l => `[${l.timestamp.split('T')[1].slice(0, 8)}] [${l.type}] ${JSON.stringify(l.detail)}`).join('\n')}
\`\`\`

## Game State
- **Phase**: ${context.gameState.phase}
- **Turn**: ${context.gameState.turn}
- **Character**: ${context.gameState.character?.name} (XP: ${context.gameState.character?.xp})
- **Stats**: ${JSON.stringify(context.gameState.character?.stats)}
- **Pips**: ${JSON.stringify(context.gameState.character?.pips)}

## Recent Chat (Last 5)
${context.gameState.recentChat.slice(-5).map(m => `- **${m.role}**: ${m.content.slice(0, 100)}...`).join('\n')}
`;
    },

    // Session storage for batch logging
    sessionReports: [],

    // Add a report to the current session
    addReportToSession(userDescription, context) {
        const report = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            description: userDescription,
            context: context
        };
        this.sessionReports.push(report);
        return this.sessionReports.length;
    },

    // Download the full session log
    downloadSessionLog() {
        if (this.sessionReports.length === 0) {
            alert("No bugs logged in this session yet!");
            return;
        }

        const sessionData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            totalReports: this.sessionReports.length,
            reports: this.sessionReports
        };

        const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ashlords-session-log-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Clear current session
    clearSession() {
        this.sessionReports = [];
        return 0;
    },

    // Create a downloadable JSON file (Single Report - Legacy/Quick)
    downloadReport(userDescription, context) {
        const report = {
            description: userDescription,
            context: context
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ashlords-bug-report-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
