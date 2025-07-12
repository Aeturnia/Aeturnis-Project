# SOP: Server-Client Version Control
**Document ID**: SOP-VERSION-CONTROL-v1.0  
**Effective Date**: 2025-07-12  
**Purpose**: Maintain synchronized versioning between server and client across all agents and development phases

---

## 1. Version Format Standards

### 1.1 Version Structure
```
Server: v{MAJOR}.{MINOR}.{PATCH}
Client: v{MAJOR}.{MINOR}.{PATCH}

Examples:
- Server: v1.0.0
- Client: v1.0.0
```

### 1.2 Version Components
- **MAJOR**: Breaking changes, major features, architectural shifts
- **MINOR**: New features, non-breaking changes, significant updates
- **PATCH**: Bug fixes, minor tweaks, documentation updates

---

## 2. Version Increment Rules

### 2.1 When to Increment MAJOR (X.0.0)
```
Server MAJOR increments when:
- [ ] Database schema incompatible changes
- [ ] API contract breaking changes
- [ ] Authentication system overhaul
- [ ] Moving between implementation phases

Client MAJOR increments when:
- [ ] Complete UI framework change
- [ ] Breaking changes to state management
- [ ] Incompatible with previous server versions
- [ ] Major UX paradigm shifts
```

### 2.2 When to Increment MINOR (x.Y.0)
```
Server MINOR increments when:
- [ ] New API endpoints added
- [ ] New game systems implemented
- [ ] Database migrations (backward compatible)
- [ ] Completing a phase step (e.g., P1-S2)

Client MINOR increments when:
- [ ] New UI components/screens
- [ ] New features that consume new APIs
- [ ] Significant UI improvements
- [ ] New client-side systems
```

### 2.3 When to Increment PATCH (x.y.Z)
```
Server PATCH increments when:
- [ ] Bug fixes
- [ ] Performance optimizations
- [ ] Security patches
- [ ] Configuration changes

Client PATCH increments when:
- [ ] UI bug fixes
- [ ] Style/CSS updates
- [ ] Text/copy changes
- [ ] Asset updates
```

---

## 3. Version Synchronization Protocol

### 3.1 Compatible Version Matrix
```markdown
| Server Version | Compatible Client Versions | Notes |
|---------------|---------------------------|-------|
| v1.0.x        | v1.0.x                   | Must match major.minor |
| v1.1.x        | v1.0.x, v1.1.x          | Backward compatible |
| v2.0.x        | v2.0.x only             | Breaking changes |
```

### 3.2 Version Compatibility Rules
1. **Major versions must match** (Server v2.x.x requires Client v2.x.x)
2. **Server minor version ≥ Client minor version**
3. **Patch versions can differ**
4. **Always test compatibility before deployment**

---

## 4. Version Tracking System

### 4.1 Current Version File
Create and maintain `VERSIONS.md` in project root:
```markdown
# Current Versions
**Last Updated**: 2025-07-12

## Production
- Server: v1.0.0
- Client: v1.0.0

## Development
- Server: v1.1.0-dev
- Client: v1.1.0-dev

## Next Release
- Target Server: v1.1.0
- Target Client: v1.1.0
- Release Date: TBD
```

### 4.2 Version History Log
Maintain `VERSION_HISTORY.md`:
```markdown
# Version History

## v1.1.0 - 2025-07-15
### Server Changes
- Added Quest System API [P2-S2]
- Implemented Party Management [P2-S1]
- Fixed combat calculation bug

### Client Changes
- Added Quest UI components
- Implemented Party interface
- Updated combat animations

### Breaking Changes
- None

### Migration Notes
- Run migration script v1.0-to-v1.1
```

---

## 5. Implementation Report Versioning

### 5.1 Report Naming Convention
```
Format: [TYPE]-[PHASE]-[STEP]_[slug]_server-v[X.Y.Z]_client-v[A.B.C].md

Examples:
- IR-P1-S2_account-system_server-v1.0.0_client-v1.0.0.md
- AR-2025-07-12_security-audit_server-v1.0.1_client-v1.0.0.md
- BF-2025-07-13_login-fix_server-v1.0.2_client-v1.0.1.md
```

### 5.2 Version Tags in Reports
Every report MUST include at the top:
```markdown
**Server Version**: v1.0.0  
**Client Version**: v1.0.0  
```

---

## 6. Git Tagging Strategy

### 6.1 Tag Format
```bash
# Server tags
git tag -a server-v1.0.0 -m "Server Release v1.0.0: MVP Complete"

# Client tags  
git tag -a client-v1.0.0 -m "Client Release v1.0.0: MVP Complete"

# Combined releases
git tag -a release-v1.0.0 -m "Full Release v1.0.0: Server + Client"
```

### 6.2 Branch Protection
```yaml
# Branch naming
main                    # Stable releases only
develop                 # Integration branch
feature/P1-S2-accounts  # Feature branches
release/v1.1.0         # Release preparation
hotfix/v1.0.1          # Emergency fixes
```

---

## 7. Agent Responsibilities

### 7.1 Claude Code (Backend)
- **Owns**: Server version decisions
- **Updates**: `package.json` version in server workspace
- **Creates**: Server changelog entries
- **Tags**: Server releases in git

### 7.2 Replit Agent (Frontend)  
- **Owns**: Client version decisions
- **Updates**: `package.json` version in client workspace
- **Creates**: Client changelog entries
- **Ensures**: UI compatibility with server version

### 7.3 ChatGPT (QA/Architecture)
- **Validates**: Version compatibility
- **Reviews**: Version increment decisions
- **Maintains**: VERSIONS.md and VERSION_HISTORY.md
- **Enforces**: Versioning standards

### 7.4 Human Orchestrator
- **Approves**: Major version changes
- **Decides**: Release timing
- **Coordinates**: Cross-version dependencies
- **Signs off**: Production deployments

---

## 8. Phase-Based Version Progression

### 8.1 Expected Version Timeline
```
Phase 1 (MVP):        v1.0.0 - v1.15.0
Phase 2 (Alpha):      v2.0.0 - v2.8.0
Phase 3 (Beta):       v3.0.0 - v3.9.0
Phase 4 (Release):    v4.0.0 - v4.6.0
Post-Release:         v5.0.0+
```

### 8.2 Phase Transition Protocol
1. Complete all phase steps
2. Run full regression testing
3. Create phase completion report
4. Tag phase snapshot
5. Increment major version
6. Update all documentation

---

## 9. Version Announcement Template

### 9.1 Internal Announcement
```markdown
## Version Update: [Component] v[X.Y.Z]

**Date**: YYYY-MM-DD  
**Component**: Server/Client  
**Previous Version**: vX.Y.Z  
**New Version**: vX.Y.Z  

### Changes
- Feature: [Description] [Catalog Tag]
- Fix: [Description]
- Update: [Description]

### Required Actions
- [ ] Update local environment
- [ ] Run migrations (if applicable)
- [ ] Review breaking changes
- [ ] Update documentation

### Compatibility Notes
- Compatible with: [versions]
- Incompatible with: [versions]
```

---

## 10. Emergency Version Procedures

### 10.1 Hotfix Versioning
```
Scenario: Critical bug in production v1.2.0

1. Create hotfix branch from v1.2.0 tag
2. Fix issue
3. Increment patch: v1.2.1
4. Test thoroughly
5. Deploy with expedited process
6. Backport fix to develop branch
```

### 10.2 Version Rollback
```bash
# If v1.2.0 has critical issues:
1. Document issue in INCIDENTS.md
2. Revert to previous stable (v1.1.5)
3. Tag failed version: server-v1.2.0-failed
4. Communicate to all agents
5. Plan fix for v1.2.1 or v1.3.0
```

---

## 11. Compliance Checklist

### 11.1 Before Version Increment
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Migration scripts ready
- [ ] Compatibility verified
- [ ] Changelog prepared
- [ ] Team notified

### 11.2 After Version Release
- [ ] Git tags created
- [ ] VERSIONS.md updated
- [ ] VERSION_HISTORY.md updated
- [ ] Announcement sent
- [ ] Monitoring increased
- [ ] Rollback plan ready

---

## 12. Quick Reference

### 12.1 Version Commands
```bash
# Check current versions
yarn workspace server version
yarn workspace client version

# Update versions
yarn workspace server version --new-version 1.1.0
yarn workspace client version --new-version 1.1.0

# Tag releases
git tag -a server-v1.1.0 -m "Server v1.1.0"
git tag -a client-v1.1.0 -m "Client v1.1.0"
git push origin --tags
```

### 12.2 Version Status Badge
Add to project README:
```markdown
![Server Version](https://img.shields.io/badge/server-v1.0.0-blue)
![Client Version](https://img.shields.io/badge/client-v1.0.0-green)
![Compatibility](https://img.shields.io/badge/compatibility-✓-success)
```

---

## 13. Appendix: Version Decision Tree

```
Need to change version?
│
├─ Breaking change? ──────► Increment MAJOR (X.0.0)
│
├─ New feature? ─────────► Increment MINOR (x.Y.0)
│
├─ Bug fix only? ────────► Increment PATCH (x.y.Z)
│
└─ Documentation only? ──► No version change
```

---

**Document Maintenance**: This SOP must be reviewed and updated whenever versioning practices change. All agents must acknowledge understanding of these procedures before making version changes.

**Last Reviewed By**: ChatGPT (QA/Architecture)  
**Next Review Date**: 2025-08-12