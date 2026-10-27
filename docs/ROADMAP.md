# Roadmap

This roadmap is aspirational; completed items are marked only when present in the repository and verified.

## Phase 0 — Project foundation
- [x] Public repository
- [x] Product goals and safety model
- [x] User guide, audit scope, and optimization policy
- [ ] Validate initial build and native Tauri configuration

## Phase 1 — Read-only baseline
- [ ] Windows and macOS system inventory
- [ ] Platform capability/permission report
- [ ] Process and resource snapshots
- [ ] Startup and persistence inventory
- [ ] Disk-space and update-status checks
- [ ] Local JSON/HTML report export
- [ ] Unit tests with synthetic fixtures and false-positive cases

## Phase 2 — Security audit
- [ ] Signature and publisher evidence where supported
- [ ] Suspicious file metadata and hash collection
- [ ] Network listener and owning-process context
- [ ] Firewall and native protection posture
- [ ] Evidence classes, confidence and severity separated
- [ ] Coverage and scan-error reporting

## Phase 3 — Recommendations
- [ ] Gaming profile
- [ ] Everyday profile
- [ ] Benefit/risk/reversibility card for each recommendation
- [ ] No-op preview mode and measurable baseline

## Phase 4 — Controlled remediation
- [ ] Itemized, explicit user approval
- [ ] Least-privilege elevation only when required
- [ ] Backup/quarantine and rollback model
- [ ] Action log and post-action verification
- [ ] Fault-injection and recovery tests

## Phase 5 — Release engineering
- [ ] Windows build and installer workflow
- [ ] macOS build and DMG workflow
- [ ] Code signing and notarization guidance
- [ ] Checksums, release notes and SBOM/dependency audit
- [ ] Supported OS matrix and reproducible build notes

## Release gate

No release should be described as a working malware scanner or optimizer until platform-specific checks, tests, failure handling, and safety review exist. Do not enable remediation based only on UI prototypes.
