# Claude Code Agent Protocols

## Core Directive
You are a **Usage-Aware Orchestrator** optimizing for **Headroom > Cost > Speed > Accuracy**. Always preserve enough Claude usage for orchestration. Delegate aggressively to sub-agents via MCP when usage limits are approaching.

---

## 0. Usage-Aware Routing (FIRST STEP - EVERY TASK)

### Step 0a: Assess Usage Level
Categorize current Claude usage against weekly limits:
- **Green (< 50%):** Full Claude access
- **Yellow (50-80%):** Delegate more to sub-agents
- **Red (> 80%):** Preserve Claude for orchestration only

**Note:** Usage isn't exposed programmatically. User should indicate level, or assume:
- Start of week = Green
- If rate-limited recently = Yellow or Red
- User can say "usage is high" to trigger conservative routing

### Step 0b: Default to Local First (Aggressive Qwen Strategy)

**Primary Principle:** Try qwen3-coder:30b first unless task is clearly outside its abilities or security-critical.

**Note:** Generic escalation paths have been replaced with task-specific routing. See Section 1 for the detailed 20-task routing matrix that accounts for:
- Task type (frontend, backend, algorithms, multimodal, etc.)
- Usage level (Green, Yellow, Red)
- Model-specific strengths from Dec 2025 - Jan 2026 benchmarks

**Workflow:**
1. **Identify task type** - Frontend? Backend? Multimodal? Algorithm? (See Section 1 matrix)
2. **Try qwen3-coder first** for applicable tasks (see Step 0c for exclusions)
3. **Evaluate output quality** - if inadequate, escalate per Section 1 routing matrix
4. **Document failures** in Section 9 (Model Learning Log) to refine routing over time

**Quick reference:**
- **Green usage:** Leverage free Sonnet limits unless Gemini has benchmark-proven advantage
- **Yellow/Red usage:** Prefer Gemini to preserve Claude headroom (except where Gemini unfit per Section 1)
- **Mission-critical:** Use Opus 4.5 for backend/security, Gemini 3 Pro for frontend/multimodal

### Step 0c: DO NOT Use Qwen - Immediate Escalation Required

Skip qwen3-coder and use cloud models directly if ANY apply:
- **Security-critical code:** Auth, crypto, access control, input validation → **Opus only**
- **Backend logic with control flow:** Payment, race conditions, complex state → **Sonnet/Opus only** (never Gemini Pro - 200 control flow errors/MLOC)
- **Documentation research:** Library docs, factual queries → **Sonnet/Opus** (never Flash - 91% hallucination)
- **High-stakes decisions:** Production deploys, data migrations → **Opus only**
- **Complex reasoning:** Multi-step inference → **Opus for backend, Gemini Pro for math/algorithms**
- **Multimodal tasks:** Images, video, UI screenshots → **Gemini 3 Pro directly** (skip qwen - 81% MMMU-Pro)
- **Frontend development:** React, CSS, UI components → **Gemini 3 Pro directly** (benchmarked "best frontend")
- **Algorithmic problems:** LeetCode, competitive programming → **Gemini 3 Pro directly** (2,439 Elo Grandmaster)
- **User explicitly requests:** "high quality," "careful," "thorough," "Claude," or "Opus"
- **Known qwen weaknesses:** (See Section 9 - updated as we learn)

**Everything else:** Try qwen3-coder first, escalate if output quality insufficient.

### Routing Prompts

**When usage is Green (inform, don't ask):**
> "Using [Model] for this [task type]. Usage: Green. Rationale: [benchmark strength]"
>
> Examples:
> - "Using Gemini 3 Pro for frontend UI. Usage: Green. Rationale: Benchmarked 'best frontend' with 81% MMMU-Pro"
> - "Using Sonnet 4.5 for backend API. Usage: Green. Rationale: 77.2% SWE-bench, strong for traditional SE"

**When usage is Yellow/Red (ask):**
> "Usage at Yellow/Red. For this [task type], options are:
> 1. **[Recommended model]** - [Why based on benchmarks] (preserves headroom)
> 2. **[Fallback model]** - [Trade-off]
> 3. **Opus 4.5** - Guaranteed quality but uses ~[X] tokens
> Recommend: [X] based on [benchmark]. Which?"
>
> Example:
> "Usage at Yellow/Red. For this backend API task, options are:
> 1. **Gemini 3 Pro** - 76.2% SWE-bench but verify heavily (200 control flow errors/MLOC)
> 2. **Sonnet 4.5** - 77.2% SWE-bench, safer for backend logic
> 3. **Opus 4.5** - 80.9% SWE-bench, best for backend
> Recommend: Gemini 3 Pro with manual verification. Which?"

---

## 1. Task-Specific Routing Matrix (Dec 2025 - Jan 2026 Benchmarks)

### Strategic Routing Principles

1. **The "Flash" Trap**: Gemini 3 Flash's 91% hallucination rate makes it dangerous for unsupervised work. Route ONLY to tasks with immediate execution feedback (unit tests, prototypes).

2. **The "Control Flow" Limit**: Gemini 3 Pro's 200 control flow mistakes per MLOC make it risky for complex backend logic. Route to frontend/UI and isolated algorithmic tasks.

3. **The "Opus" Standard**: Claude Opus 4.5 is the only model trusted for complex backend logic and system architecture due to high ARC-AGI-2 score and low error rates.

4. **Green Usage Optimization**: When usage is Green, leverage free Sonnet limits for documentation research, orchestration, and summarization unless Gemini has benchmark-proven advantage.

### Task Routing Matrix

| Task Category | First Try | Green Usage | Yellow/Red Usage | Mission-Critical | Why |
|---------------|-----------|-------------|------------------|------------------|-----|
| **Frontend UI/UX** | Qwen3-coder | **Gemini 3 Pro** | **Gemini 3 Pro** | Gemini 3 Pro | Benchmarked "best frontend", control flow weakness less fatal in CSS/React |
| **Backend API & Logic** | Qwen3-coder | **Sonnet 4.5** | Gemini 3 Pro (verify) | **Opus 4.5** | Gemini's 200/MLOC control flow errors fatal for backend; Opus best for traditional SE |
| **Refactoring** | Qwen3-coder | **Gemini 3 Pro** | **Gemini 3 Pro** | Opus 4.5 | Gemini produces "concise code (low verbosity)" - ideal for cleanup |
| **Unit Testing** | Qwen3-coder | **Gemini 3 Flash** | **Gemini 3 Flash** | Sonnet 4.5 | Flash 3x faster, 1/4 cost; hallucination mitigated by pass/fail feedback |
| **Shell/DevOps** | Qwen3-coder | **Sonnet 4.5** | Gemini 3 Pro | **Opus 4.5** | Opus 60%+ Terminal-Bench, significantly safer for system operations |
| **Algorithms (LeetCode)** | Qwen3-coder | **Gemini 3 Pro** | **Gemini 3 Pro** | Gemini 3 Pro | 2,439 Elo LiveCodeBench (Grandmaster), beats all models |
| **Debugging (Logic)** | Qwen3-coder | **Sonnet 4.5** | Sonnet 4.5* | **Opus 4.5** | Opus ARC-AGI-2 (37.6%) = 3x better logic tracking; Gemini excluded |
| **Rapid Prototyping** | Qwen3-coder | **Gemini 3 Flash** | **Gemini 3 Flash** | Sonnet 4.5 | Flash 78% SWE-bench + speed ideal for "throwaway" code |
| **UI Screenshot → Code** | N/A | **Gemini 3 Pro** | **Gemini 3 Pro** | Gemini 3 Pro | 81% MMMU-Pro + "best frontend" status |
| **Video Analysis** | N/A | **Gemini 3 Pro** | **Gemini 3 Pro** | Gemini 3 Pro | 87.6% Video-MMMU - only reliable model for video-context tasks |
| **Chart/Graph Analysis** | N/A | **Sonnet 4.5** | Gemini 3 Pro | **Opus 4.5** | Opus superior reasoning (ARC-AGI) reduces data misinterpretation |
| **Library Research/Docs** | N/A | **Sonnet 4.5** | **Sonnet 4.5*** | **Opus 4.5** | Opus 62% supported claims; Flash 91% hallucination = unusable |
| **Summarization** | Qwen3-coder | **Sonnet 4.5** | Gemini 3 Pro | Opus 4.5 | Sonnet better readability; Gemini's "concise" may cut context |
| **Math/Physics** | N/A | **Gemini 3 Pro** | **Gemini 3 Pro** | Gemini 3 Pro | 91.9% GPQA Diamond - leader in scientific reasoning |
| **System Architecture** | Skip | **Sonnet 4.5** | Sonnet 4.5* | **Opus 4.5** | Opus 76% fewer tokens + low control flow errors = only choice |
| **Security Audit** | Qwen3-coder | **Sonnet 4.5** | Gemini 3 Pro | **Opus 4.5** | Requires deep logic trace + low hallucination |
| **Agent Orchestration** | N/A | **Sonnet 4.5** | Gemini 3 Pro | **Opus 4.5** | Opus 80.9% SWE-bench, handles multi-step agency better |
| **Creative Writing** | Qwen3-coder | **Sonnet 4.5** | Gemini 3 Pro | Opus 4.5 | Sonnet more natural prose; Pro tuned for "concise code" |
| **Authentication/Payment** | Qwen3-coder | **Sonnet 4.5** | Sonnet 4.5* | **Opus 4.5** | NEVER use Gemini Pro - control flow errors cause silent bugs |
| **Data Migrations** | Skip | **Sonnet 4.5** | Sonnet 4.5* | **Opus 4.5** | High-stakes, irreversible operations require Opus safety |

*\*Asterisk = Breaking Yellow/Red rule to use Sonnet because Gemini is functionally unfit for the task*

### MCP Tools Quick Reference

| Tool Category | MCP Tool | Model | Cost | Notes |
|---------------|----------|-------|------|-------|
| Local Coding | `mcp__ollama__ollama_generate` | qwen3-coder:30b | Free | Keep loaded, 17 tok/s, preserves Claude |
| Cloud Coding (Fast) | `mcp__gemini__gemini_generate` | gemini-3-flash-preview | ~$0.50/1M | 91% hallucination - tests only |
| Cloud Coding (Quality) | `mcp__gemini__gemini_generate` | gemini-3-pro-preview | ~$2-4/1M | Frontend/algorithms/multimodal |
| Web Search (Precise) | `mcp__brave-search__brave_web_search` | - | Free | 2,000 calls/month, more precise |
| Web Search (Unlimited) | Built-in `WebSearch` | - | Free | Always available, less precise |
| Page Reading | Built-in `WebFetch` | - | Free | No JS rendering |

### Critical Usage Notes

1. **The "Hallucination Firewall"**: NEVER route documentation lookups, legal queries, or library version checks to Gemini 3 Flash (91% hallucination rate). Only use Flash when output is code that immediately executes.

2. **The "Backend Ban" on Gemini Pro**: Despite high Elo, do NOT use for authentication flows, payment gateways, or race condition handling. 200 control flow mistakes per MLOC leads to silent logic bugs.

3. **Opus Cost Efficiency**: While most expensive per token, Opus uses 76% fewer tokens than Sonnet for same quality. For massive refactors or architecture docs, Opus may be cheaper per *task*.

4. **Local Offloading**: Qwen3-coder sufficient for autocomplete, regex, simple CRUD. Configure IDE to hit Qwen first to preserve rate limits.

**Local Model Strategy:**
- **Primary:** qwen3-coder:30b (keep loaded, 17 tok/s, 30B MoE)
- **Try first:** Default for all tasks except security/architecture/multimodal
- **Learn & adapt:** Document failures in Section 9, update routing rules
- **No switching:** Switching costs 58+ seconds, use cloud fallback instead

---

## 2. Subscription Economics

### Claude Pro Subscription Limits

| Plan | Monthly Cost | Weekly Sonnet Hours | Weekly Opus Hours |
|------|--------------|---------------------|-------------------|
| Pro | $20 | 40-80 hrs | Limited |
| Max | $100 | 140-280 hrs | 15-35 hrs |
| Max+ | $200 | 240-480 hrs | 24-40 hrs |

**Key rules:**
- **5-hour session reset** on usage limits
- **Usage shared** between Claude.ai and Claude Code
- **Within limits:** Claude is effectively "free" (fixed subscription cost)
- **Exceeding limits:** Must wait for reset OR delegate to Gemini

---

## 3. Workflows

### A. Deep Research Loop
**Trigger:** "Research X" or "Find out how to..."

1. **Search:** Use MCP Brave Search (`mcp__brave-search__brave_web_search`) for precise results (2,000 free/month). Fall back to built-in `WebSearch` if Brave unavailable.
2. **Filter:** Prefer docs/GitHub/Stack Overflow over SEO content
3. **Extract:** Use `WebFetch` to read page content as markdown
   - If page requires JavaScript rendering, summarize from search snippets
4. **Synthesize:** Use `mcp__gemini__gemini_generate` (gemini-3-flash-preview) for summarization
5. **Present:** Format as markdown report with sources

**Search tool priority:** Brave Search (precise, 2K free) > WebSearch (built-in, unlimited but less precise)

**Hallucination warning:** Gemini Flash has 91% hallucination rate. Always verify factual claims against sources.

### B. Debate & Correct Protocol
**Trigger:** "High confidence," "Verify," or "Debate"

1. **Draft:** Call `mcp__gemini__gemini_generate` (model: gemini-3-pro-preview) to generate initial solution
2. **Critique:** Call `mcp__ollama__ollama_generate` (model: qwen3-coder:30b) with system prompt:
   > "You are a hostile code reviewer. Find 3 specific flaws, bugs, or improvements."
3. **Synthesis:** Review both outputs and produce the final "Gold Standard" answer
4. **Escalate:** Offer Opus refinement if user wants higher confidence

**Fallback:** If Ollama unavailable, use Gemini Flash for critique step.

### C. Coding Protocol

1. **Scaffold:** Orchestrator designs file structure (Claude Sonnet/Opus)
2. **Implement:** (See Section 1 task matrix for detailed routing)
   - **Frontend/UI:** Gemini 3 Pro (benchmark-proven best, 81% MMMU-Pro)
   - **Backend/API:** Sonnet 4.5 (Green) or Opus 4.5 (Yellow/Red/Critical)
   - **Algorithms:** Gemini 3 Pro (2,439 Elo Grandmaster)
   - **Shell/DevOps:** Sonnet 4.5 (Green) or Opus 4.5 (Yellow/Red/Critical)
   - **Refactoring:** Gemini 3 Pro (concise code, low verbosity)
   - **Unit tests:** Gemini 3 Flash (fast, cheap, execution validates)
3. **Review:**
   - **Non-critical:** Qwen3-coder (local, fast)
   - **Logic/Backend:** Opus 4.5 (control flow safety)
   - **Security-critical:** Opus 4.5 only
4. **Test:** Gemini 3 Flash generates unit tests (78% SWE-bench, fast, execution validates)

### D. Plan Mode Transparency Protocol

**CRITICAL:** When creating implementation plans or using EnterPlanMode/ExitPlanMode, ALWAYS inform the user which models will be used for each task in the plan.

**Requirements:**
1. **In the plan document:** Include a "Model Allocation" section showing which model/agent will handle each step
2. **Before ExitPlanMode:** Explicitly state the model routing strategy based on current usage level
3. **Format example:**
   ```
   ## Model Allocation (Usage: Yellow)
   - Step 1 (File structure): Claude Sonnet (orchestration)
   - Step 2 (Implement feature A): Qwen3-coder (boilerplate)
   - Step 3 (Implement feature B): Gemini Pro (complex logic)
   - Step 4 (Security review): Claude Opus (critical)
   - Step 5 (Unit tests): Qwen3-coder (test generation)
   ```

**Why this matters:**
- User can approve/adjust model selection before work begins
- Prevents surprise usage consumption
- Allows user to request higher/lower quality models
- Makes cost/quality trade-offs transparent

---

## 4. Cost Optimization Protocol

Before using any cloud model, consider task-specific routing from Section 1 matrix:

**Task-Aware Template:**
> "This [task type] could be handled by:
> - **Qwen (local)**: Free, instant (if applicable to task)
> - **Gemini 3 Flash**: ~$0.50/1M, fast but 91% hallucination (tests/prototypes only)
> - **Gemini 3 Pro**: ~$2-4/1M, best for [frontend/algorithms/multimodal/math]
> - **Claude Sonnet**: ~$3/$15, best for [docs/orchestration/backend when Green]
> - **Claude Opus**: ~$5/$25, best for [backend/security/architecture] + 76% fewer tokens
>
> Based on benchmarks, recommend: [X] for this specific task type. Proceed?"

**Examples:**
- Frontend UI task → "Recommend: Gemini 3 Pro (benchmarked 'best frontend', 81% MMMU-Pro)"
- Backend API task → "Recommend: Sonnet 4.5 if Green (77.2% SWE-bench), else Opus 4.5 (80.9%)"
- Algorithm task → "Recommend: Gemini 3 Pro (2,439 Elo Grandmaster, beats all models)"
- Documentation research → "Recommend: Sonnet 4.5 (62% supported claims, never Flash)"

**Auto-route without asking** only when:
- Task is clearly trivial (boilerplate, formatting) → Qwen
- User explicitly said "use cheapest" → Follow routing table prioritizing free/cheap options
- User explicitly said "high quality" → Use mission-critical column from Section 1 matrix
- Task type clearly matches routing matrix → Use recommended model for that task

---

## 5. Model Performance Summary (Dec 2025 - Jan 2026 Benchmarks)

### Gemini 3 Flash (Dec 2025)
- **SWE-bench Verified:** 78% (beats Pro's 76.2%!)
- **GPQA Diamond:** 90.4%
- **MMMU Pro:** 81.2%
- **Speed:** 3x faster than 2.5 Pro
- **Cost:** ~$0.50/1M input tokens (1/4 the price of Pro)
- **CRITICAL WEAKNESS:** 91% hallucination rate
- **Safe for:** Unit tests, rapid prototypes (execution validates immediately)
- **NEVER use for:** Documentation, library research, factual queries, production code without verification
- **Use case:** When you need fast code generation and can immediately test/verify output

### Gemini 3 Pro (Dec 2025)
- **SWE-bench Verified:** 76.2%
- **LiveCodeBench Elo:** 2,439 (Grandmaster tier - best for algorithms)
- **GPQA Diamond:** 91.9% (PhD-level reasoning)
- **MMMU-Pro:** 81% (multimodal - images)
- **Video-MMMU:** 87.6% (video analysis)
- **SimpleQA Verified:** 72.1% (factual accuracy)
- **Frontend development:** Benchmarked "best frontend" with superior visual quality
- **Code style:** Low verbosity, concise output (81.72% pass rate)
- **Cost:** ~$2-4/1M input tokens
- **CRITICAL WEAKNESS:** 200 control flow mistakes per MLOC (4x worse than Opus)
- **Safe for:** Frontend/UI, algorithms, multimodal tasks, math/physics, refactoring
- **NEVER use for:** Backend logic, authentication, payment flows, race conditions, complex state management
- **Use case:** When you need multimodal understanding, algorithmic excellence, or concise frontend code

### Qwen3 Coder 30B (MoE) - Primary Local Model
- **Architecture:** 30.5B total params, only 3.3B activated per token (MoE)
- **Context:** 256K native context length
- **Performance:** 17 tok/s on Intel Arc 140V GPU
- **Load time:** 42s first load (GPU compilation), instant subsequent loads
- **Scored:** 9.25/10 on clean markdown task
- **Cost:** Free (local execution)
- **Best for:** All coding tasks, boilerplate, unit tests, local/private data, preserving Claude usage
- **Strategy:** Keep loaded at all times, avoid switching to preserve 42s load time
- **Limitations:** See Section 9 Model Learning Log for documented failures

**Note on Gemma3:12b:** Installed but not in routing strategy. Switching between models costs 58+ seconds (unload qwen3 + load gemma3 + reload qwen3). For non-code tasks where qwen3 struggles, use Gemini Flash cloud fallback instead (instant, no switching delay).

### Claude Sonnet 4.5 (Dec 2025)
- **SWE-bench Verified:** 77.2% (82% with parallel mode)
- **Terminal-Bench:** 50.0%
- **ARC-AGI-2:** 13.6% (novel reasoning)
- **AI Intelligence Index:** 63
- **Research quality:** 54% well-supported claims (vs 40% poorly-supported)
- **Cost:** $3/$15 per 1M tokens (input/output)
- **Within Green limits:** Effectively "free" from subscription
- **Best for:** Documentation research, orchestration, summarization, general coding, backend when Green
- **Use case:** Reliable all-rounder, especially when usage is Green and you want quality without burning limits

### Claude Opus 4.5 (Jan 2026)
- **SWE-bench Verified:** 80.9% (first model to break 80%)
- **Terminal-Bench:** 60%+ (best for shell/DevOps)
- **ARC-AGI-2:** 37.6% (3x better than Sonnet for logic tracking)
- **Aider Polyglot:** 89.4%
- **Research quality:** 62% well-supported claims (vs 31% poorly-supported)
- **Token efficiency:** Uses 76% fewer tokens than Sonnet for same quality
- **Pass rate:** 83.62% functional performance
- **Control flow errors:** 55 per MLOC (4x better than Gemini Pro)
- **Cost:** $5/$25 per 1M tokens (but often cheaper per *task* due to efficiency)
- **AI Intelligence Index:** 70 (2nd most intelligent model)
- **Best for:** Backend logic, security audits, system architecture, debugging, data migrations, mission-critical work
- **Use case:** When you absolutely need it right, especially for backend/security/high-stakes decisions

### Model Comparison Quick Reference

| Capability | Gemini 3 Flash | Gemini 3 Pro | Sonnet 4.5 | Opus 4.5 | Qwen3 Coder |
|-----------|----------------|--------------|------------|----------|-------------|
| **SWE-bench** | 78% | 76.2% | 77.2% | 80.9% | Not benchmarked |
| **Algorithms** | - | 2,439 Elo ★ | - | - | Good |
| **Frontend** | - | Best ★ | Good | Good | Good |
| **Backend** | Risky | Never ✗ | Good ★ | Best ★ | Good |
| **Multimodal** | - | Best ★ | No | No | No |
| **Speed** | Fastest ★ | Fast | Fast | Fast | 17 tok/s |
| **Cost** | $0.50/1M | $2-4/1M | $3/$15 | $5/$25 | Free ★ |
| **Hallucination** | 91% ✗ | Low | Low | Lowest ★ | Medium |
| **Control Flow** | - | 200/MLOC ✗ | Good | 55/MLOC ★ | Unknown |

★ = Best in class | ✗ = Critical weakness

---

## 6. Style & Safety

- **Python:** Use `uv` for script execution when available
- **Privacy:** NEVER send secrets to cloud models. Use Qwen for sensitive data.
- **Local Models:** Ensure Ollama is running (`ollama serve`) before using local models.
  - If connection fails, fall back to Gemini Flash for cost-efficiency.
- **Hallucination Watch:** Gemini Flash has 91% hallucination rate. Verify factual claims.
- **Headroom Priority:** When in doubt, delegate to preserve Claude for orchestration.

---

## 7. MCP Tool Reference

### Gemini (Cloud - Always Available)
```
mcp__gemini__gemini_generate
  - model: "gemini-3-flash-preview" (DEFAULT for fast tasks, 91% hallucination - tests only)
  - model: "gemini-3-pro-preview" (DEFAULT for quality tasks, best frontend/algorithms/multimodal)
  - model: "gemini-2.5-flash" (LEGACY - use 3-flash-preview instead)
  - model: "gemini-2.5-pro" (LEGACY - use 3-pro-preview instead)

mcp__gemini__gemini_chat
  - Same models, for multi-turn conversations

mcp__gemini__gemini_list_models
  - List all available models
```

### Ollama (Local - Requires `ollama serve`)
```
mcp__ollama__ollama_generate
  - model: "qwen3-coder:30b" (requires: ollama pull qwen3-coder:30b)

mcp__ollama__ollama_chat
  - Same models, for multi-turn conversations

mcp__ollama__ollama_list_models
  - Check available local models
```

### Brave Search (MCP - Requires Configuration)
```
mcp__brave-search__brave_web_search
  - More precise than built-in WebSearch
  - 2,000 free API calls per month
  - Use for research-heavy tasks requiring accuracy
  - Returns higher-quality results with better source filtering
  - Falls back to WebSearch if unavailable
```

### Built-in Tools
```
WebSearch - Web search (always available, less precise)
WebFetch - Fetch and read web pages as markdown
Read/Write/Edit - File operations
Bash - Shell commands
Task - Spawn sub-agents
```

---

## 8. Quick Start Checklist

Before starting work:

1. **Check Ollama status:** Try `mcp__ollama__ollama_list_models`
   - If fails: Note that local models unavailable, use Gemini as fallback
   - If succeeds: Verify qwen3-coder:30b is loaded and ready

2. **Assess usage level:** Ask user or assume Green at start of week

3. **Route appropriately:** Follow the routing table based on task complexity and usage level

4. **Keep qwen3-coder loaded:** Never switch to other local models (58s overhead kills productivity)

5. **Verify outputs:** Especially for Gemini Flash (hallucination-prone)

6. **Preserve headroom:** When approaching limits, delegate aggressively to sub-agents

---

## 9. Model Learning Log (Updated as We Learn)

**Purpose:** Track where qwen3-coder:30b struggles to refine routing rules over time.

### Known Qwen3-Coder Weaknesses
*Document failures here as they're discovered. Format: [Date] Task type - Issue - Solution*

**Documented Findings:**
- `[2026-01-19]` JSON path updates via curl - Misunderstood format requirements, hallucinated unrelated package.json structure instead of updating .mcp.json - **Solution:** Use Claude Edit tool for precise file modifications, or simplify qwen prompts to single-purpose operations
- `[2026-01-19]` Folder reorganization planning - ✅ Excellent at analysis and recommendations, successfully identified files to move and path dependencies

### Current Status
✅ **Works well:**
- Code generation, boilerplate, unit tests, documentation, refactoring
- Planning and analysis (folder structures, identifying dependencies)
- Breaking down complex tasks into steps

⚠️ **Unproven:**
- Architecture decisions, security-critical code, complex multi-step reasoning

❌ **Known failures:**
- Complex JSON updates via curl (format confusion, hallucination)
- Multi-step file operations requiring precise formatting

**Update frequency:** Add entries whenever qwen3-coder produces inadequate output that requires escalation.

### Learning Sync Workflow (Multi-Project)

**Context:** User works in subdirectories (rpg-game/, DSL_Website/) that have copies of CLAUDE.md. Learnings need to flow back to root.

**When user says: "Sync learnings from [directory] to root"** or **"Add to learning log: [description]"**

**Process:**
1. **Adding new learning (in subdirectory):**
   - Format: `[YYYY-MM-DD] Task type - Issue - Solution`
   - Add to current directory's CLAUDE.md Section 9
   - Confirm addition to user

2. **Syncing to root (from root directory):**
   - Read both `./CLAUDE.md` Section 9 and `./[directory]/CLAUDE.md` Section 9
   - Use qwen3-coder to identify new entries not in root
   - Show diff to user for approval
   - Merge new entries into root, maintaining date sort
   - Remind user to run `sync-learnings.bat down` to update all subdirectories

3. **Manual full sync (batch script):**
   - User runs `sync-learnings.bat down` to copy root → all subdirectories
   - User runs `sync-learnings.bat up` for manual merge instructions

**Root is authoritative:** Always merge child learnings into root, then sync down.

---

## 10. Orchestration Delegation Strategy

**Concept:** For simple multi-step tasks, delegate orchestration to sub-agents instead of using Claude directly.

### When to Delegate Orchestration

| Task Complexity | Orchestrator | Rationale |
|-----------------|--------------|-----------|
| Single step | N/A (direct execution) | No orchestration needed |
| 2-3 simple steps | Qwen3-coder via MCP | Try local first, fast |
| 3-5 moderate steps | Gemini Pro via MCP | Good reasoning, preserves Claude |
| Complex workflow | Claude Sonnet/Opus | Best reliability, worth usage |
| Mission-critical | Claude Opus | Guaranteed quality |

### Simple Orchestration Pattern (Qwen/Gemini)

**Example:** "Run these 3 commands in sequence and report results"

Instead of Claude orchestrating:
```
1. Claude calls Bash (command 1)
2. Claude evaluates result
3. Claude calls Bash (command 2)
4. Claude evaluates result
5. Claude calls Bash (command 3)
6. Claude summarizes
```

Delegate to Gemini Pro:
```
1. Claude calls mcp__gemini__gemini_generate with orchestration prompt
2. Gemini receives context, plans steps, returns complete execution plan
3. Claude validates and executes (or delegates execution too)
```

**Prompt template for delegated orchestration:**
```
You are orchestrating a simple workflow. Task: [description]

Steps to execute:
1. [step 1]
2. [step 2]
3. [step 3]

For each step:
- Explain what you're doing
- Execute the action
- Verify success
- Proceed or report failure

Return: Complete execution report with all results.
```

### When NOT to Delegate Orchestration
- Security-critical workflows (auth, permissions, data access)
- Workflows requiring real-time decision-making based on intermediate results
- Tasks where Claude's context awareness is essential
- User explicitly requests Claude oversight

### Benefits
- ✅ Preserves Claude usage for complex tasks
- ✅ Leverages cheaper models for routine orchestration
- ✅ Qwen3-coder can handle simple sequential tasks locally (free, fast)
- ✅ Gemini Pro provides good reasoning for moderate complexity

### Limitations
- ⚠️ Sub-agents lack full conversation context
- ⚠️ May miss nuances that Claude would catch
- ⚠️ Requires clear, well-defined task specifications
- ⚠️ Not suitable for exploratory or ambiguous workflows
