---
applyTo: '**'
---

# Playwright CLI Workflow Instructions

## **CRITICAL: Always Use playwright-cli**

**MANDATORY**: When working with browser automation, ALWAYS use `playwright-cli` commands.

### **Primary playwright-cli Commands:**

- `playwright-cli snapshot` - Get current page state and element references
- `playwright-cli click eXX` - Click elements using refs from snapshots
- `playwright-cli type "text"` - Type text into active/focused field
- `playwright-cli fill eXX "text"` - Fill a specific input field
- `playwright-cli goto URL` - Navigate to a URL
- `playwright-cli tab-list` - List all open tabs
- `playwright-cli tab-select N` - Switch to tab by index

### **⚠️ Snapshots: Check Before Capturing**

Before running `playwright-cli snapshot`, **always check `.playwright-cli/` for existing snapshots first**:

```bash
ls .playwright-cli/*.yml 2>/dev/null | tail -5
```

If a recent snapshot already covers the page you need, read it instead of capturing a new one.

If you do need to save a snapshot with a specific name, **always save it inside `.playwright-cli/`** (which is gitignored):

```bash
playwright-cli snapshot --filename=.playwright-cli/my-snapshot.yaml
```

Never save named snapshots to the project root — they are not gitignored there.

### **EFFICIENT WORKFLOW - START HERE:**

**Step 1: Open session and navigate**

```bash
# 1. Open session
playwright-cli open

# 2. Navigate to the app
playwright-cli goto https://your-app-url.com

# 3. Take a snapshot to see elements
playwright-cli snapshot

# 4. Interact using refs from snapshot
playwright-cli click e15
playwright-cli fill e7 "search text"
playwright-cli press Enter
playwright-cli snapshot
```

### **Normal Workflow:**

1. `playwright-cli open` - Start the browser daemon
2. `playwright-cli goto URL` - Navigate to the app
3. `playwright-cli snapshot` - See current page state and element refs
4. Use element refs from the snapshot to interact directly

### **Connection Workflow:**

1. **Always run `playwright-cli open` before any other command.**
2. **Session not open error**: If you see `The browser 'default' is not open, please run open first`, run `playwright-cli open` then retry.
3. **Scan Current Page**: Use `playwright-cli snapshot` to see current page state and element refs
4. **Switch Tabs**: Use `playwright-cli tab-list` and `playwright-cli tab-select N` to navigate windows
5. **Always use element refs**: Use `eXX` values from snapshots, not hardcoded selectors

### **Critical Rules:**

- **Always run `playwright-cli open` before any other command**
- **Always use element refs (`eXX`) from snapshots for reliable targeting**
- **Start every interaction with `playwright-cli open`, then `playwright-cli snapshot`**
