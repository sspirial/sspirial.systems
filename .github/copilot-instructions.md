# Role: The Sovereign Architect

## 1. The Core (Sanctuary)
**Path:** `src/core/*` or `lib/domain/*`
- **Constraint:** PURE FUNCTIONS ONLY.
- **Forbidden:**
  - No I/O (Database, Network, File System).
  - No Frameworks (No React, Express, Django, Pandas).
  - No `try/catch` (Logic failures should return Result types or throw domain errors).
- **Goal:** If I copy this file to a different project/language, the logic should still make sense.

## 2. The Shell (Monad)
**Path:** `src/shell/*` or `src/infra/*`
- **Constraint:** SIDE EFFECTS ALLOWED.
- **Responsibility:**
  - Import logic from `Core`.
  - Handle the "Monad" (Db Transaction, HTTP Retry, Logging).
  - Catch errors from Core and format them for the user.

## 3. The "Auto-Weave" Protocol (Trigger: "Weave")
When I type **"Weave"** (without arguments):

### Phase 1: Gap Analysis (Find the Orphan)
1.  **Scan** the `src/core/` directory. List all exported "Pure Functions".
2.  **Scan** the `src/shell/` directory. Check which of those Core functions are **NOT** yet imported/used.
3.  **Target** the first "Orphaned" function you find.

### Phase 2: Fabrication (The Shell)
1.  **Determine** the correct destination in `src/shell/`.
2.  **Generate** the Shell file imports the Orphaned Logic and wraps it in the Monad.
3.  **Do not** ask for implementation details—infer them from the function name.

### Phase 3: Verification (The Test)
1.  **Generate** a temp test file.
2.  **Run** the test in the terminal.
3.  **Loop:** Fix code -> Run test -> Until Green.
4.  **Report:** "Wove `[Function]` into `[Shell File]`. Status: Verified."

## 4. The Verification Protocol (Trigger: "Verify" or "Weave & Verify")
When I ask to **"Verify"** specific logic or **"Weave & Verify"**:
1.  **Generate** the Shell/Hook code as usual (if not already present).
2.  **Create** a temporary test file if one doesn't exist.
3.  **Execute** the test using the terminal.
4.  **Analyze** the terminal output:
    * **Green?** Delete the temp test (optional) and report success.
    * **Red?** Read the error, FIX the Shell code, and RERUN the test.
    * **Repeat** until Green.

## 5. The "Annotate" Protocol (Trigger: "Annotate")
**Goal:** Transform an existing ("Legacy") repository into the Sovereign `Core/Shell` architecture.
When I type **"Annotate"**:

### Phase 1: Architectural Scan
1.  **Map** the current file structure.
2.  **Identify** "Pure Logic" candidates (Utils, Helpers, Algorithms, Math) vs "Impure" candidates (Components, API Routes, DB Models).
3.  **Propose** a migration plan:
    * Move `[Pure Files]` -> `src/core/`.
    * Move `[Impure Files]` -> `src/shell/`.

### Phase 2: Restructuring (The Migration)
1.  **Create** the directories `src/core` and `src/shell` (if missing).
2.  **Move** the identified pure files to `src/core`.
    * *Refactor:* If a file is mixed, extract the pure functions to `src/core` and keep the side effects in `src/shell`.
3.  **Move** the infrastructure files to `src/shell`.

### Phase 3: The Wiring Fix
1.  **Update Imports:** Scan all moved files and fix their import paths (e.g., `../../utils` -> `@core/utils`).
2.  **Sanitize Core:** Check `src/core` files for accidentally moved side effects (e.g., `console.log`, `import axios`). Remove them or inject them as dependencies.
3.  **Report:** "Repository Annotated. Logic separated to `src/core`. Infrastructure moved to `src/shell`."