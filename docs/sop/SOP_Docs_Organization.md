# Documentation Organization & File Naming SOP

## Directory Structure
/docs/
  /sop/
  /methodology/
  /phases/
  /implementation-reports/
  /audit-reports/
  /bugfix-reports/
  /phase-completions/
  /guides/
  /api/
  /legal/
  /misc/
  index.md

## File Naming Conventions

- Implementation Reports:  IR-P[phase]-[step]_slug_server-vX.Y.Z_client-vA.B.C.md
- Audit Reports:           AR-YYYY-MM-DD_slug_server-vX.Y.Z_client-vA.B.C.md
- Bug Fix Reports:         BF-YYYY-MM-DD_slug_server-vX.Y.Z_client-vA.B.C.md
- Phase Completion Reports: PC-P[phase]_slug_server-vX.Y.Z_client-vA.B.C.md

Where:
- [phase] = phase number (e.g., P3)
- [step] = step number (e.g., 04)
- slug = a short, descriptive name (e.g., quick-action-toolbar)
- X.Y.Z = Server version at time of report (e.g., 2.3.1)
- A.B.C = Client version at time of report (e.g., 1.9.5)

## Version Tagging Instructions

- At the top of every report, specify:
  - Server Version: vX.Y.Z
  - Client Version: vA.B.C
- Use version numbers from package.json or deployment tags at the time of completion/merge.
- If multiple bugfixes/audits apply to the same version, increment a letter suffix (v2.3.1a).

## Indexing

- Each folder must include an index.md with a bulleted list of reports (filename, summary, date, status).