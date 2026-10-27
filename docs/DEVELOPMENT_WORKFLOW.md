# Development workflow

FS Security uses short-lived branches and pull requests. Do not commit feature work directly to `main`.

## Branch naming

- `feat/<topic>` — new capability
- `fix/<topic>` — bug fix
- `test/<topic>` — test-only work
- `docs/<topic>` — documentation-only changes

## Pull request checklist

Every pull request should include:

1. A narrow, reviewable scope.
2. The reason for the change and a short implementation summary.
3. Tests added or updated for behavior changes.
4. CI results for frontend build and Rust tests/lint where relevant.
5. Known limitations, platform-specific behavior, and any privacy or safety implications.
6. Explicit confirmation when a feature is still heuristic or incomplete.

## Merge requirements

The intended repository policy is:

- Pull requests only for changes to `main`.
- Required CI checks must pass before merge.
- No force pushes or deletion of `main`.
- At least one approving review when a separate reviewer is available.
- Prefer squash merges to keep the history readable.

GitHub branch protection/rulesets are repository settings and must be enabled by a repository administrator. The GitHub connection available to this workflow can read repository settings but does not expose a write operation for branch protection, so do not assume the rules are active until verified in GitHub Settings.

## Test expectations

- Rust unit tests cover miner-indicator matching and known benign examples.
- Frontend CI must pass TypeScript checks and production build.
- New cleanup/remediation behavior must include tests for cancellation, authorization, backup/reversal, and failure handling before it is eligible for merge.
- Never use a real miner or destructive cleanup operation as a CI fixture. Use synthetic names, command lines, and temporary test data.

## Security principles

- A heuristic match is not a malware verdict.
- Do not kill processes, delete files, or modify startup entries during scanning.
- Require explicit per-item approval for any future remediation.
- Never upload process lists, command lines, paths, or file hashes to an AI service without a separate, informed opt-in.
