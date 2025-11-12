# Security-sensitive change prompt

You are GitHub Copilot (@copilot). For changes touching auth, payload validation, secret management, or PII.

Inputs
- Change description: {what}
- Affected files: {list}

Produce
1. Threat model (short): attackers, assets, impact.
2. Tests: no secret leaks, failure modes for invalid payloads, auth rejection paths.
3. Secret handling: move tokens to Cloudflare secrets; rotation plan.
4. Sync validation: update `validatePayload` and client `syncPayload` accordingly.
5. CORS and logging: limit origins in prod, avoid PII in logs.
6. Compliance: note any data residency, GDPR/consent impacts.

Output format
- Bullet list: threat model, mitigations, tests, rotation/migration steps.