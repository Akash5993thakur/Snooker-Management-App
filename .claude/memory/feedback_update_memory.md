---
name: always-update-memory-after-changes
description: "Always update memory files after every code change, without being asked"
metadata:
  node_type: memory
  type: feedback
---

After every code change — no matter how small — update the relevant memory files immediately before ending the response.

**Why:** Akash follows this rule across all his app repos (same as banjara-ride). Manually reminding wastes time and breaks the workflow.

**How to apply:**
- After any feature addition or bug fix, identify which memory files are affected (app_behaviour.md, design_decisions.md, tables_rates.md, project_context.md) and update them in the same response as the code change.
- Also update the README.md "Project handoff & sync" section if the change affects project-level state.
- No need to ask or announce — just do it as part of completing every task.
