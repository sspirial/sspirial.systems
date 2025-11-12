# PR description generator prompt

You are GitHub Copilot (@copilot). Generate a concise PR description for the patch.

Inputs
- Title: {one-line}
- Summary: {short summary}
- Files changed: {list}
- Tests: {how to run & expected outcome}
- Migrations: {yes/no + details}
- Offline/sync impact: {what changes for replicas}
- Risk: low/medium/high
- Rollback: {how to revert}

Output format
- Title:
- Body (3–6 sentences): what changed, why, offline/sync impact, migration/rollback.
- Checklist:
  - [ ] Tests added/updated
  - [ ] Migration (if applicable)
  - [ ] Offline & sync behavior verified
  - [ ] CI green
  - [ ] Linked issue (if any)
  - [ ] Docs updated (if needed)
- How to test locally: step-by-step commands.
- Reviewer notes: highlight schema/materializer changes, worker logic, sync validation updates.