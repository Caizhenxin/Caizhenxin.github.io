# Fix GitHub Pages route.meta undefined error

## TL;DR

> **Quick Summary**: The Yun theme's App.vue accesses `route.meta` immediately during initialization, but during static site generation (SSG) the Vue Router's `route` object may be undefined, causing a blank site with only background color. This plan ensures every route has a defined `meta` property via Valaxy's `extendRoute` hook and adds a fallback in the theme if needed.
> 
> **Deliverables**: Updated `valaxy.config.ts` with `extendRoute` to guarantee `meta.layout` exists, optional custom layout component, and updated deployment verification.
> 
> **Estimated Effort**: Short
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Update config → Build & test → Deploy

## Context

### Original Request
User's Valaxy + Yun theme blog shows blank white/blue background on GitHub Pages with console errors:
```
TypeError: Cannot read properties of undefined (reading 'meta')
    at s.leftSidebar.isOpen (index.*.js:25:3183)
...
```
Local development works fine.

### Interview Summary
- Local `pnpm dev` works, showing posts and content.
- GitHub Actions deployment succeeds but site renders blank.
- Errors indicate `route` is undefined in theme's App.vue watcher.
- Previously removed `pages/index.vue` causing reliance on theme's index.vue.
- GitHub Pages base path is `/`.

### Metis Review
**Identified Gaps** (addressed):
- Missing guarantee that `route.meta` exists for all routes.
- Need to ensure root route matches a component with proper meta.
- Potential timing issue where watcher fires before router ready.

## Work Objectives

### Core Objective
Ensure the Vue Router's `route` object is properly defined with `meta.layout` for all routes when the Yun theme's App.vue initializes, eliminating the undefined property errors.

### Concrete Deliverables
- `valaxy.config.ts`: Add `extendRoute` hook to ensure every route has `meta` with default `layout`.
- (Optional) `layouts/custom.vue`: Custom layout if needed.
- Updated README with verification steps.

### Definition of Done
- [ ] Local build produces site with content visible.
- [ ] GitHub Actions deployment completes without errors.
- [ ] Accessing https://caizhenxin.github.io/ shows blog posts (not just background).
- [ ] Console shows no `Cannot read properties of undefined (reading 'meta')` or `(reading 'path')` errors.

### Must Have
- Site displays blog posts and UI elements (banner, post list, etc.).
- No routing-related undefined property errors in console.

### Must NOT Have (Guardrails)
- Do not modify theme source code in `node_modules/` (upstream changes will be lost).
- Do not remove essential files like `pages/posts/*.md`.
- Do not change site title or theme unless required.

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: YES (Valaxy/Vue Router)
- **Automated tests**: None (rely on Agent-Executed QA Scenarios)
- **Framework**: Valaxy built-in SSR/SSG validation

### QA Policy
Every task MUST include agent-executed QA scenarios:
- **Frontend/UI**: Use Playwright to load deployed site, assert presence of post titles, check console for errors.
- **API/Backend**: N/A
- **Library/Module**: Validate built HTML contains expected content.

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Preparation — config updates):
├── Task 1: Update valaxy.config.ts with extendRoute [quick]
├── Task 2: Verify local build succeeds [quick]
└── Task 3: Run local preview and check for errors [quick]

Wave 2 (Deployment & Verification):
├── Task 4: Commit and push to trigger GitHub Actions [quick]
├── Task 5: Wait for deployment completion [quick]
├── Task 6: Verify deployed site via Playwright (check content, no errors) [unspecified-high]
└── Task 7: Update README with verification steps [quick]

Critical Path: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6
Parallel Speedup: ~50% faster than sequential
```

### Agent Dispatch Summary
- **1**: **3** — T1-T3 → `quick`
- **2**: **4** — T4-T5 → `quick`, T6 → `unspecified-high`, T7 → `quick`

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.

- [ ] 1. Update valaxy.config.ts with extendRoute to ensure meta.layout exists

  **What to do**:
  - Edit `valaxy.config.ts` to add `extendRoute` function under `router` that ensures `route.meta` exists and sets default `layout` if missing.
  - Keep existing `base: '/'` configuration.

  **Must NOT do**:
  - Do not alter `siteConfig` or `themeConfig` unnecessarily.
  - Do not remove existing router configuration.

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > Reason: Simple configuration edit, well-defined scope.
  > **Skills**: [`git-master`]
  > - `git-master`: For committing changes safely.

  **Parallelization**:
  - **Can Run In Parallel**: YES (with other config tasks)
  - **Parallel Group**: Wave 1 (with Tasks 2,3)
  - **Blocks**: Task 2 (local build verification)
  - **Blocked By**: None (can start immediately)

  **References**:
  - Valaxy docs: `valaxy.config.ts#router.extendRoute` - Ensures route meta is extended before component composition.
  - Theme source: `node_modules/valaxy-theme-yun/App.vue:25` - Shows usage of `route.meta.layout`.

  **Why Each Reference Matters**:
  - The `extendRoute` hook is the correct place to guarantee each route has a `meta` object before Vue Router renders components.
  - The theme's App.vue watches `route.meta.layout`; ensuring this exists prevents the undefined error.

  **Acceptance Criteria**:
  - [ ] File `valaxy.config.ts` contains `router.extendRoute` function.
  - [ ] Function ensures `route.meta` is an object and sets `route.meta.layout = route.meta.layout || 'default'` if missing.
  - [ ] Local build passes: `pnpm build` exits with code 0.

  **QA Scenarios**:

  > **Scenario: Valid extendRoute implementation**
    Tool: Node (Bash)
    Preconditions: valaxy.config.ts exists, pnpm installed
    Steps:
      1. Extract the extendRoute function from valaxy.config.ts
      2. Call it with a mock route object `{}` and verify it returns `{ meta: { layout: 'default' } }`
      3. Call it with `{ meta: { layout: 'custom' } }` and verify layout remains 'custom'
    Expected Result: Both tests pass, function returns route with meta.layout defined.
    Failure Indicators: Function throws error, returns undefined, or missing meta.layout.
    Evidence: .sisyphus/evidence/task-1-extendRoute-test.json

  > **Scenario: Local build success**
    Tool: Bash (pnpm)
    Preconditions: Dependencies installed, valaxy.config.ts updated
    Steps:
      1. Run `pnpm build`
      2. Verify exit code is 0
      3. Confirm dist/index.html exists
    Expected Result: Build succeeds, dist/ contains index.html and assets.
    Failure Indicators: Non-zero exit code, missing dist/index.html.
    Evidence: .sisyphus/evidence/task-1-build-success.log

- [ ] 2. Verify local build succeeds and site renders correctly

  **What to do**:
  - Run `pnpm preview` locally (or serve dist with a static server) and check that the page shows blog posts and UI.
  - Ensure no console errors related to route.meta.

  **Must NOT do**:
  - Do not rely solely on visual inspection; check for errors in console.

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > Reason: Simple verification of build output.
  > **Skills**: [`playwright`]
  > - `playwright`: To automate browser verification if needed, but manual check suffices for quick task.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1,3)
  - **Blocks**: Task 3 (final local verification)
  - **Blocked By**: Task 1 (config update must succeed first)

  **References**:
  - Local preview URL: `http://localhost:4859/`
  - Built dist location: `./dist/`

  **Why Each Reference Matters**:
  - Previewing the built site confirms that the config changes produce a working site before deployment.

  **Acceptance Criteria**:
  - [ ] `pnpm build` succeeds.
  - [ ] Previewing `dist/index.html` shows at least one post title (e.g., "博客搭建历程").
  - [ ] No console errors of type "Cannot read properties of undefined (reading 'meta')".

  **QA Scenarios**:

  > **Scenario: Check for post titles in built HTML**
    Tool: Bash (grep)
    Preconditions: dist/index.html exists
    Steps:
      1. grep -i "博客搭建历程" dist/index.html || true
      2. grep -i "vue3" dist/index.html || true
    Expected Result: At least one post title found in HTML.
    Failure Indicators: No matches for known post titles.
    Evidence: .sisyphus/evidence/task-2-posts-found.txt

  > **Scenario: Console error check (manual)**
    Tool: Playwright (chromium)
    Preconditions: Local preview server running on port 4859
    Steps:
      1. Launch browser to http://localhost:4859/
      2. Wait for network idle
      3. Evaluate `window.console.error` calls or check page.evaluate(() => [...]) for errors containing "Cannot read properties of undefined"
    Expected Result: No such errors.
    Failure Indicators: Any matching error found.
    Evidence: .sisyphus/evidence/task-2-console-errors.png

- [ ] 3. Run local preview and verify no errors

  **What to do**:
  - Start `pnpm dev` in background, wait for it to be ready, then use Playwright to fetch the page and check for errors.
  - Stop the dev server after verification.

  **Must NOT do**:
  - Do not leave dev server running indefinitely.

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > Reason: Simple dev server verification.
  > **Skills**: [`playwright`]
  > - `playwright`: To automate checking of dev server.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1,2)
  - **Blocks**: None (final verification before commit)
  - **Blocked By**: Task 2 (build verification)

  **References**:
  - Dev server command: `pnpm dev`
  - Expected ready message: `✔ [valaxy] server ready.`

  **Why Each Reference Matters**:
  - Ensures the configuration works in development mode as well, catching any SSR-specific issues.

  **Acceptance Criteria**:
  - [ ] Dev server starts without error.
  - [ ] Loaded page contains blog post titles.
  - [ ] Console lacks route.meta undefined errors.

  **QA Scenarios**:

  > **Scenario: Dev server health check**
    Tool: Bash + Playwright
    Preconditions: pnpm installed
    Steps:
      1. Start `pnpm dev` in background, capture its PID
      2. Wait for line containing "server ready" in output
      3. Use Playwright to navigate to http://localhost:4859/
      4. Check for presence of post titles and absence of console errors
      5. Kill the dev server process
    Expected Result: Server starts, page loads correctly, no errors.
    Failure Indicators: Server fails to start, page missing content, errors present.
    Evidence: .sisyphus/evidence/task-3-dev-server-verification.json

- [ ] 4. Commit changes and push to main branch to trigger GitHub Actions

  **What to do**:
  - git add valaxy.config.ts
  - git commit -m "fix: ensure route.meta exists via extendRoute to fix GitHub Pages blank screen"
  - git push origin main

  **Must NOT do**:
  - Do not push unrelated changes.
  - Do not push to other branches.

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > Reason: Standard git operations.
  > **Skills**: [`git-master`]
  > - `git-master`: For safe commits.

  **Parallelization**:
  - **Can Run In Parallel**: NO (must wait for prior verification)
  - **Parallel Group**: Wave 2 (standalone)
  - **Blocks**: Task 5 (wait for deployment)
  - **Blocked By**: Task 3 (local verification must pass)

  **References**:
  - GitHub repo: https://github.com/Caizhenxin/Caizhenxin.github.io
  - Workflow file: .github/workflows/deploy.yml

  **Why Each Reference Matters**:
  - Pushing to main triggers the deploy workflow that builds and publishes to gh-pages.

  **Acceptance Criteria**:
  - [ ] Commit created successfully.
  - [ ] Push accepted by GitHub (no errors).
  - [ ] GitHub Actions workflow queued or in progress.

  **QA Scenarios**:

  > **Scenario: Verify push success**
    Tool: Bash (git)
    Preconditions: Local main branch ahead of remote
    Steps:
      1. git push origin main
      2. Check output for "To https://github.com/..." and no error messages
    Expected Result: Push completes without rejection.
    Failure Indicators: Push fails with authentication or other error.
    Evidence: .sisyphus/evidence/task-4-push-output.txt

- [ ] 5. Wait for GitHub Actions deployment to complete

  **What to do**:
  - Monitor the deploy workflow until it completes (success or failure).
  - Timeout after 10 minutes.

  **Must NOT do**:
  - Do not proceed to verification until workflow finishes.

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > Reason: Waiting involves uncertain duration; needs patience.
  > **Skills**: [] (no specific skill, just waiting)

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (standalone)
  - **Blocks**: Task 6 (deployment verification)
  - **Blocked By**: Task 4 (push must be sent)

  **References**:
  - GitHub Actions URL: https://github.com/Caizhenxin/Caizhenxin.github.io/actions
  - Workflow name: Deploy to GitHub Pages

  **Why Each Reference Matters**:
  - We must ensure the deployment succeeded before checking the live site.

  **Acceptance Criteria**:
  - [ ] Deploy workflow completes with status "success".
  - [ ] No errors in build or deploy steps.
  - [ ] Artifact `github-pages` produced.

  **QA Scenarios**:

  > **Scenario: Check workflow completion**
    Tool: Bash (gh api) or manual polling via curl (if gh not available)
    Preconditions: Push sent to main
    Steps:
      1. Use `gh run list --workflow=deploy.yml --limit=1` to get latest run ID
      2. Use `gh run watch <ID>` or poll until status is completed
      3. Record conclusion (success/failure)
    Expected Result: conclusion == "success"
    Failure Indicators: conclusion == "failure" or timeout.
    Evidence: .sisyphus/evidence/task-5-workflow-conclusion.txt

- [ ] 6. Verify deployed site via Playwright (check content, no errors)

  **What to do**:
  - Use Playwright to navigate to https://caizhenxin.github.io/
  - Wait for network idle.
  - Assert that the page contains expected text (e.g., "博客搭建历程").
  - Capture console errors and ensure none match the route.meta undefined pattern.
  - Take a screenshot for evidence.

  **Must NOT do**:
  - Do not ignore console errors; they must be absent.

  **Recommended Agent Profile**:
  > **Category**: `unspecified-high`
  > Reason: Involves network and browser automation.
  > **Skills**: [`playwright`]
  > - `playwright`: Essential for UI verification and console error checking.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (standalone)
  - **Blocks**: Task 7 (final documentation)
  - **Blocked By**: Task 5 (deployment must succeed)

  **References**:
  - Live site: https://caizhenxin.github.io/
  - Selectors: `.YunPostList` or any post title element.
  - Console error pattern: "Cannot read properties of undefined (reading 'meta')"

  **Why Each Reference Matters**:
  - Direct verification of the live site ensures the fix works in production.
  - Checking console errors confirms the specific issue is resolved.

  **Acceptance Criteria**:
  - [ ] Page loads successfully (HTTP 200).
  - [ ] At least one post title is visible in the DOM.
  - [ ] No console errors containing "Cannot read properties of undefined (reading 'meta')" or "(reading 'path')".
  - [ ] Site layout shows banner and post list (not just blank background).

  **QA Scenarios**:

  > **Scenario: Live site content check**
    Tool: Playwright
    Preconditions: Deploy workflow succeeded
    Steps:
      1. Launch browser to https://caizhenxin.github.io/
      2. Wait for selector `.YunPostList` or any element containing known post text
      3. Extract text content of the page
      4. Verify it contains a known post title (e.g., "博客搭建历程")
      5. Evaluate `console.error` overwritten array to check for forbidden errors
    Expected Result: Post title present, no forbidden errors.
    Failure Indicators: Missing post title, or forbidden errors present.
    Evidence: .sisyphus/evidence/task-6-live-site-verification.json

  > **Scenario: Screenshot for visual confirmation**
    Tool: Playwright
    Preconditions: Same as above
    Steps:
      1. Take full page screenshot
      2. Save to .sisyphus/evidence/task-6-screenshot.png
    Expected Result: Screenshot shows blog content, not just blank blue/white background.
    Failure Indicators: Screenshot shows only background color with no text.
    Evidence: .sisyphus/evidence/task-6-screenshot.png

- [ ] 7. Update README with verification steps and troubleshooting

  **What to do**:
  - Add a section to README.md under "常见问题" (Common Issues) about the route.meta error and how it was fixed.
  - Include steps to verify locally and on GitHub Pages.

  **Must NOT do**:
  - Do not remove existing useful information.

  **Recommended Agent Profile**:
  > **Category**: `quick`
  > Reason: Simple documentation update.
  > **Skills**: [] (none required)

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (standalone)
  - **Blocks**: None (final task)
  - **Blocked By**: Task 6 (verification must succeed)

  **References**:
  - Existing README: README.md
  - Section to update: 常见问题

  **Why Each Reference Matters**:
  - Future maintainers will know how to avoid/reproduce and fix the issue.

  **Acceptance Criteria**:
  - [ ] README.md updated with new troubleshooting section.
  - [ ] Section clearly describes the symptom, cause, and solution.
  - [ ] No existing content removed unintentionally.

  **QA Scenarios**:

  > **Scenario: README contains fix description**
    Tool: Bash (grep)
    Preconditions: README.md exists
    Steps:
      1. grep -i "route.meta" README.md || true
      2. grep -i "extendRoute" README.md || true
    Expected Result: At least one of the keywords appears.
    Failure Indicators: Neither keyword found.
    Evidence: .sisyphus/evidence/task-7-readme-update.txt

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `tsc --noEmit` + linter + `bun test`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp).
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

## Commit Strategy

- **1**: `fix(scope): desc` — valaxy.config.ts, npm test

## Success Criteria

### Verification Commands
```bash
pnpm build && echo "Build succeeded"
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass