# Miner-focused scan scope and evidence model

This document describes intended coverage. It is not a claim that the current prototype implements every check. The initial implementation includes only conservative process-name and command-line heuristics for possible mining software plus basic disk-space checks.

## Collection principles

- Read-only by default; no system mutation during scanning.
- Prefer documented OS APIs and stable commands over parsing undocumented internals.
- Record source, timestamp, platform, permissions, and coverage limitations.
- Treat command failures and inaccessible locations as **not assessed**, not safe.
- Avoid uploading collected information. Reports remain local unless a user explicitly exports or shares them.
- Never execute suspicious files or load them into a scanner process.
- Do not classify an item as malicious solely because it is unfamiliar, unsigned, located in a user directory, resource-intensive, or listening on a port.

## Planned audit modules

### 1. System baseline
- OS name/version/build and architecture.
- Available disk space and filesystem capacity.
- Memory/CPU inventory where exposed.
- Last known update status only when reliably accessible.
- Scan coverage and required permissions.

### 2. Processes and miner indicators
- Process name, PID, parent PID where available, executable path and owner.
- CPU/memory usage snapshots, with sampling interval disclosed.
- Publisher/signature metadata where the platform exposes it.
- Match known miner executable names and explicit Stratum-plus-pool/account command-line patterns for review; do not terminate processes.
- Treat a match as a lead, not a verdict: names can be spoofed, miners can be renamed, and legitimate mining applications may match.

### 3. Startup and persistence
- Windows: user startup folders, Run/RunOnce keys, scheduled tasks and service metadata where safely queryable.
- macOS: LaunchAgents/LaunchDaemons and login items, subject to OS permissions.
- Record command, target path, publisher/signature metadata and persistence scope where available.
- Do not disable or remove entries automatically.

### 4. Files and suspicious artifacts
- User-selected folders and documented persistence locations.
- File metadata and cryptographic hash; signature status where supported.
- No recursive full-disk scan by default. Scope, estimated duration, and privacy implications must be shown before broader scans.
- No file execution, deletion, or quarantine without a separate reviewed remediation workflow.

### 5. Network context
- Listening sockets and owning process where available.
- Remote connection metadata only as needed and with clear privacy disclosure.
- Port numbers, IP addresses, or process names alone are not proof of compromise.
- No packet interception or intrusive network probing.

### 6. Native security posture
- Firewall and supported endpoint protection status.
- OS security settings and disk encryption status where available.
- Secure Boot / platform integrity signals where supported.
- Report unavailable signals honestly; never disable a protection to improve a benchmark.

### 7. Performance and optimization
- Startup impact and background resource use.
- Disk space pressure and system resource contention.
- OS power/performance mode and game-related settings where supported.
- Official driver and OS update guidance.
- Recommendations must state the expected benefit, measurement, trade-off, rollback, and platform applicability.

## Evidence and confidence

Each finding should use a transparent evidence class:

- **Observed:** a directly collected value or artifact.
- **Heuristic:** a rule suggests something deserves review; not proof.
- **Corroborated:** multiple independent signals support a concern.
- **Confirmed:** only when a trusted detection source or independently validated evidence justifies the label.

Confidence must reflect evidence quality and corroboration, not severity. Severity describes potential impact; confidence describes how strongly the evidence supports the finding. These must not be conflated.

## False-positive controls

- Maintain allowlist mechanisms that are visible, scoped, and reversible.
- Include benign explanations and vendor/OS context.
- Never treat all unsigned software, developer tools, VPNs, remote support apps, overlays, or uncommon ports as malicious.
- Provide a way to mark a finding as expected without deleting evidence from the report.
- Test detection rules against benign fixtures and known false-positive cases.

## Coverage reporting

A completed scan should report:
- areas inspected;
- areas skipped and why;
- permission limitations;
- checks that failed;
- time taken;
- definitions/rule version;
- whether any result is a heuristic rather than a confirmed detection.

“No findings” must never be presented as proof that the system is clean.
