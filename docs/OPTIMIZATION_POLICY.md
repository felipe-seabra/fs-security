# Optimization policy

FS Security aims to improve security, reliability, and responsiveness without unsafe “debloating” or unsupported performance promises.

## Profiles

### Gaming
Optimize for consistent frame times and fewer avoidable background interruptions. Recommendations may include reviewing startup programs, identifying high resource use, checking free space, reviewing OS power/performance options, and directing users to official GPU driver updates.

### Everyday
Optimize for reliability, responsive multitasking, security hygiene, reasonable startup load, update status, disk headroom, and privacy settings.

Both profiles use the same safety requirements. A profile changes recommendation ranking, not the user's consent requirements.

## Required fields for every recommendation

Every proposed change must state:
1. Target and current value/state.
2. Evidence supporting the recommendation.
3. Expected benefit and how it can be measured.
4. Risk, trade-offs, and possible compatibility impact.
5. Reversibility and rollback instructions.
6. Required permissions.
7. Verification procedure and expected result.

If these details cannot be established, the app should present information only—not an executable action.

## Never change silently

- Antivirus/endpoint protection, firewall, or operating-system security controls.
- OS updates or update services.
- Backups, restore mechanisms, accessibility features, or essential system services.
- Unknown startup entries, drivers, kernel extensions, launch daemons, scheduled tasks, or services.
- Registry keys, system configuration files, or power settings without an explicit, itemized approval and supported rollback.
- User files, browser profiles, caches, downloads, logs, or applications.
- BIOS/UEFI settings, CPU/GPU voltage, overclocking, fan curves, or firmware settings.

## No fake optimization

Do not:
- promise a fixed FPS increase without measurement;
- use registry “tweaks” or shell scripts from untrusted sources;
- disable security to reduce background usage;
- terminate processes solely because CPU or memory usage is high;
- remove a component simply because it is unfamiliar or branded as bloatware;
- apply one platform's recommendation to another platform without platform-specific validation.

## Measuring outcomes

Where practical, compare a baseline and post-change measurement under comparable conditions. Report variance and measurement limitations. A change that cannot be verified should be described as unverified, not as an improvement.

## Rollback

Prefer changes that can be reversed through documented OS APIs. Save original values before mutation when appropriate, verify the saved state, and provide an undo path. If reliable rollback is impossible, label the action as non-reversible and require stronger confirmation—or do not offer it.
