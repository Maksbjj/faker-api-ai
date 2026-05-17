# Tracing

Capture detailed execution traces for debugging and analysis. Traces include DOM snapshots, screenshots, network activity, and console logs.

## Basic Usage

```bash
# Start trace recording
playwright-cli tracing-start

# Perform actions
playwright-cli open https://example.com
playwright-cli click e1
playwright-cli fill e2 "test"

# Stop trace recording
playwright-cli tracing-stop
```

## What Traces Capture

| Category        | Details                                            |
| --------------- | -------------------------------------------------- |
| **Actions**     | Clicks, fills, hovers, keyboard input, navigations |
| **DOM**         | Full DOM snapshot before/after each action         |
| **Screenshots** | Visual state at each step                          |
| **Network**     | All requests, responses, headers, bodies, timing   |
| **Console**     | All console.log, warn, error messages              |
| **Timing**      | Precise timing for each operation                  |
