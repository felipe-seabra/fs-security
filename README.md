# FS Security

**Local-first system security auditing and optimization for Windows and macOS.**

FS Security is an open-source desktop application being developed to help people understand system security, startup behaviour, performance bottlenecks, and safe optimization opportunities—with evidence, plain-language explanations, and explicit user approval before any system change.

> [!WARNING]
> **Early development — not ready for production use.** The current repository is a prototype. Real system scanning, malware detection, remediation, optimization actions, and signed installers are not yet implemented. Do not rely on this project to detect or remove malware, and do not run it with administrator/root privileges.

## Goals

- **Security audit:** review processes, startup and persistence locations, suspicious files, network listeners/connections, system protections, and update status.
- **Evidence before labels:** distinguish observed facts, heuristics, and confirmed threats. An unsigned app, unfamiliar process, or open port is not automatically malware.
- **System health:** identify update, storage, startup-load, resource-usage, and configuration issues that may affect reliability or performance.
- **Two optimization profiles:** recommendations for **Gaming** and **Everyday use**, with a clear explanation of trade-offs.
- **User-controlled changes:** show the exact target, expected benefit, risks, reversibility, and verification steps. Never apply changes silently.
- **Verification:** rescan affected areas and report whether a change worked.
- **Privacy by default:** local analysis and local reports; no telemetry or upload of scanned files by default.
- **Cross-platform:** Windows and macOS, with platform-specific checks rather than pretending both operating systems expose the same controls.

## Planned audit areas

| Area | Examples of checks |
| --- | --- |
| Processes | Process identity, executable path where available, publisher/signature evidence where supported, unusual execution context |
| Startup and persistence | Login items, scheduled tasks/services on Windows, LaunchAgents/LaunchDaemons and login items on macOS |
| Files | User-selected folders, common persistence locations, hashes and metadata; no automatic deletion |
| Network | Listening ports and owning processes where available; connections are contextual evidence, not proof of compromise |
| Native protections | Firewall, OS security features, encryption status and protection configuration where the OS exposes reliable signals |
| Updates | OS and security-update status, with links to official update settings |
| Performance | CPU/memory pressure, startup load, disk space, background activity and resource-heavy processes |
| Gaming | Power/performance mode availability, background workload review, game overlays/startup apps, storage headroom and graphics-driver update guidance |
| Everyday use | Startup simplicity, disk headroom, update hygiene, resource use, privacy-relevant settings and reliability |
| Reports | Findings, evidence, confidence, impact, recommended next step and post-change verification |

These are product goals, **not a claim that every check is currently available**. See [the roadmap](docs/ROADMAP.md) and [audit scope](docs/SCAN_SCOPE.md).

## Safety model

1. **Read-only scan first.** A scan must not delete files, kill processes, disable services, alter security settings, or change power settings.
2. **Explain each finding.** Show the evidence, source, confidence, possible false positives, and why the item matters.
3. **Separate detection from remediation.** Recommendations are not executed automatically.
4. **Explicit, per-action approval.** Before a change, show the exact target and expected side effects.
5. **Prefer reversible actions.** Where safe and supported, create a backup or quarantine record and document rollback.
6. **Least privilege.** Request elevation only for a specific action that genuinely requires it, never for a routine scan.
7. **Verify afterward.** Check the resulting state and retain a local action log.
8. **No “magic boost” claims.** Recommendations must be measurable, explain trade-offs, and avoid disabling security protections for performance.

Read [the threat model](docs/threat-model.md) and [optimization policy](docs/OPTIMIZATION_POLICY.md).

## Installation and usage

### End users

**No official installer is available yet.** Windows `.exe` and macOS `.dmg` packages will be published under [GitHub Releases](https://github.com/felipe-seabra/fs-security/releases) only after the application has working platform checks, tests, and build workflows.

When a verified release is available:

1. Open the project's [Releases page](https://github.com/felipe-seabra/fs-security/releases).
2. Download the asset matching your operating system and CPU architecture.
3. Verify the release notes and checksum, when provided.
4. On macOS, open the `.dmg` and move the app to Applications. If macOS warns that the app is not notarized, do not bypass the warning unless you have independently verified the release and understand the risk. Official releases should eventually be signed and notarized.
5. On Windows, run the installer or `.exe` from the verified release. Do not run as administrator unless a specific, documented action requires it.
6. Start with a **read-only scan**. Review findings and export a report before considering any change.
7. Choose Gaming or Everyday recommendations only after the scan. Inspect every proposed action individually and approve only changes you understand.
8. Re-run the relevant checks after a change and review the verification result.

Until a release is published, these are the intended user steps—not instructions for an already functional scanner.

### Developers: run the current prototype

Requirements: Node.js LTS, npm, and Rust with Cargo. Tauri's native prerequisites differ by OS; consult the [Tauri v2 prerequisites](https://v2.tauri.app/start/prerequisites/).

```bash
git clone https://github.com/felipe-seabra/fs-security.git
cd fs-security
npm install
npm run tauri dev
```

To build the frontend:

```bash
npm run build
```

The current prototype does **not** perform a real system scan or remediation. Do not interpret sample interface entries as findings from your device.

## Development status

- [x] Public repository and initial project structure
- [x] Safety principles, threat model, and user-guide draft
- [ ] Real, read-only Windows inventory and audit checks
- [ ] Real, read-only macOS inventory and audit checks
- [ ] Evidence-backed finding rules and false-positive handling
- [ ] Gaming and Everyday recommendation engine
- [ ] Per-action approval, rollback/backup model, and action history
- [ ] Reports and post-action verification
- [ ] Automated tests and platform-specific CI
- [ ] Windows packaging and macOS packaging, signing/notarization guidance

## Documentation

- [User guide: installation and use](docs/USER_GUIDE.md)
- [Audit scope and evidence model](docs/SCAN_SCOPE.md)
- [Optimization policy](docs/OPTIMIZATION_POLICY.md)
- [Architecture](docs/architecture.md)
- [Threat model](docs/threat-model.md)
- [Roadmap](docs/ROADMAP.md)
- [Security reporting](SECURITY.md)
- [Contributing](CONTRIBUTING.md)

## Privacy

The intended default is on-device processing. The app should not upload file contents, process lists, paths, or reports. Any future online reputation lookup must be opt-in and clearly explain which metadata would be sent. Never submit private files or sensitive reports to public issue trackers.

## Contributing

Contributions should include tests for detection rules, explain false-positive risks, document platform limitations, and avoid destructive defaults. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Disclaimer

FS Security is an evolving open-source project, not a substitute for a supported endpoint protection product or a professional incident response investigation. It must never claim a device is clean solely because a scan found no issues.
