# User guide: install, scan for hidden miners, review cleanup, and optimize

## Current availability

FS Security is in early development. It is intended as a miner-focused scanner and cleanup assistant, not a full antivirus. The current version performs a limited local inventory and basic heuristic checks for possible mining software; it is not a comprehensive scanner and cannot guarantee that a device is clean. No official `.exe` or `.dmg` installer is available yet.

This guide documents the intended workflow for future verified releases and explains how to run the prototype as a developer.

## 1. Download and install a release

When releases are published:

1. Visit [FS Security Releases](https://github.com/felipe-seabra/fs-security/releases).
2. Select the latest non-draft release. Read its notes, supported OS versions, architecture, known limitations, and checksum/signature information.
3. Download only the asset intended for your OS:
   - **Windows:** signed installer or `.exe` package.
   - **macOS:** signed and notarized `.dmg` for the appropriate architecture.
4. Verify the checksum against the value published with the same release, when available.
5. Install using the operating system's normal process.
6. Launch the application as a standard user. A routine audit should not require administrator/root access.
7. If the operating system reports an invalid signature, untrusted developer, or tampering warning, stop and verify the release. Do not blindly bypass security warnings.

If the Releases page has no assets, a ready-to-install version has not been published.

## 2. First launch

The intended first-run flow is:

1. Review the privacy notice and local report-storage location.
2. Select **Read-only audit**.
3. Choose the areas to inspect. The app should disclose any permission or coverage limitations.
4. Start the scan and allow it to finish. Do not close the app while a scan is running.
5. Review the summary and open findings individually. A possible-miner result is a heuristic lead, not proof: check the executable path, publisher/signature, installation source, and whether you intentionally installed mining software.
6. Export the report if needed, storing it privately. Reports may contain usernames, file paths, process names, and network metadata.

A scan is an assessment, not a guarantee that the device is malware-free.

## 3. Understand findings

Every finding should include:

- **What was observed:** the actual process, file, startup entry, setting, or metric.
- **Evidence:** path, publisher/signature status, hash, parent/owner process, configuration value, timestamp, or other relevant data.
- **Risk:** what could happen and why it matters.
- **Confidence:** how strongly the available evidence supports the conclusion.
- **False-positive notes:** benign reasons the item may exist.
- **Recommended next step:** investigate, update, leave unchanged, or prepare a specific remediation plan.

A high CPU process is not necessarily malware. An unsigned executable is not necessarily malicious. An open port is not necessarily an intrusion. FS Security should not label a threat based on a single weak signal.

## 4. Choose an optimization profile

After the audit, select one of these profiles:

### Gaming

The goal is stable frame times and fewer avoidable interruptions—not a promise of higher FPS.

Recommendations may cover:
- reviewing unnecessary startup apps and background workloads;
- checking free storage and whether games are on a suitable drive;
- reviewing available OS performance/power settings;
- checking official graphics-driver and OS update guidance;
- identifying overlays or capture tools that may add overhead;
- checking CPU, memory, disk and GPU pressure where supported.

The app must explain trade-offs. It must not automatically disable antivirus, firewall, OS updates, backups, accessibility services, or unknown services. Cleanup actions are not yet implemented; the current prototype does not kill processes, quarantine files, or remove persistence. Power and performance changes should be optional, reversible, and supported by the current OS.

### Everyday use

The goal is reliability, security hygiene, responsiveness, and sensible resource use.

Recommendations may cover:
- startup load and background apps;
- OS and security updates;
- disk-space pressure;
- high resource usage;
- supported security settings;
- privacy-relevant permissions and sharing settings;
- redundant apps only when there is clear evidence and the user chooses what to uninstall.

The app must not delete caches, logs, browser data, downloads, or personal files without an explicit, itemized decision.

## 5. Review a proposed change

Before approving any action, read the complete action card:

1. Exact setting, file, service, or startup entry affected.
2. Evidence and reason the change is recommended.
3. Expected benefit and how it will be measured.
4. Risks, compatibility concerns, and possible side effects.
5. Whether the change is reversible and how to undo it.
6. Whether a backup or restore point is available.
7. Whether administrator permission is required and why.

Approve one action at a time. If the impact is unclear, skip it. No batch action should silently include additional items.

## 6. Verify and roll back

After an approved change, the app should:
- record the user's approval and the exact operation;
- confirm the resulting state;
- re-scan the affected area;
- show whether the intended result was achieved;
- provide rollback instructions or a supported undo action when possible.

If verification fails, the app should not repeat a potentially destructive operation automatically. Follow the displayed rollback guidance and consult the relevant official OS support documentation.

## 7. Export and protect a report

Reports should be generated locally. Store them in a private folder, redact personal paths or identifiers before sharing, and never attach a full report to a public issue unless sensitive details have been removed.

## 8. Run the current prototype from source

For contributors, install Node.js LTS, npm, Rust/Cargo, and the OS-specific Tauri prerequisites.

```bash
git clone https://github.com/felipe-seabra/fs-security.git
cd fs-security
npm install
npm run tauri dev
```

Frontend-only build check:

```bash
npm run build
```

The prototype may display sample data. Those examples are not real findings, and the current app does not implement scanning, remediation, or optimization actions.
