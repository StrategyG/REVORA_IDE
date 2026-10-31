# REVORA IDE — Responsive and UX Audit

## Current state

No frontend source, design system, CSS, screenshots, browser build, or running app was available. Desktop, tablet, Android portrait, and Android landscape behavior are all **NOT VERIFIED**. Responsive readiness cannot be inferred from a future CSS breakpoint alone.

## Required interaction model

| Surface | Required behavior / acceptance focus |
|---|---|
| Desktop | Multi-panel IDE layout, resizable explorer/editor/assistant/workbench, keyboard shortcuts, focus management |
| Tablet | Collapsible panels, touch-safe tabs and menus, preserve editor viewport, avoid competing drawers |
| Android portrait | Single-primary-pane navigation, compact workspace switcher, bottom sheet/drawer for secondary tools, touch targets and keyboard-aware layout |
| Android landscape | Reclaim horizontal editor space, panel overlay/collapse, stable virtual keyboard and scroll behavior |
| All sizes | Dirty-state guard, autosave/recovery indicator, reconnect state, accessible labels, contrast and focus visibility |

## Specific test scenarios

- Open, switch, pin, and close multiple files while preserving unsaved state.
- Resize/collapse explorer, AI assistant, and bottom workbench without losing editor selection.
- Open Android virtual keyboard and verify editor viewport, cursor, selection, toolbar, and save status remain usable.
- Rotate Android device with dirty buffers and active tasks; restore layout and editor state.
- Test nested folders, long filenames, wide code lines, long diagnostics, and large diffs without horizontal page overflow.
- Disconnect/reconnect network during autosave and AI streaming; reconcile state without duplicate writes.
- Verify touch targets, screen reader labels, focus order, keyboard navigation, and high zoom.

## Required evidence in later stages

Capture screenshots/video and automated viewport tests for desktop, tablet, Android portrait, and landscape. Record browser/device/version, viewport dimensions, interaction steps, expected/actual outcomes, and defects. No UX claim should be marked PASS without actual test evidence.
