# Walkthrough - Accessibility Fix (Bonus History)

I have implemented a fix for the console warning: `Blocked aria-hidden on an element because its descendant retained focus`.

## Problem Analysis
The error was caused by a conflict between Chrome's automatic focus on scrollable containers and Naive UI's accessibility management. Specifically:
1.  The main layout content area is a scrollable `div`.
2.  Chrome automatically focuses scrollable `div`s to allow keyboard scrolling.
3.  When a Modal (like the detail view in Bonus History) opens, Naive UI marks the background content as `aria-hidden="true"`.
4.  If the background content container has focus, the browser blocks the `aria-hidden` attribute and throws a warning.

## Changes Made

### 1. Advanced Accessibility Management
- **Modified**: [Layout.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/Layout.vue)
- **Action**: Implemented a `MutationObserver` to detect when Naive UI modals or drawers are open. When detected, the `inert` attribute is automatically applied to the main content area.
- **Why**: This follows the specific recommendation in the browser warning ("Consider using the inert attribute instead"). `inert` ensures that even if focus traps have quirks, the browser will strictly prevent any background element from being focused or interacted with.

### 2. Proactive Focus Clearing
- **Modified**: [BonusHistory.vue](file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/BonusHistory.vue)
- **Action**: Added an explicit `blur()` call to the active element before opening the detail modal.
- **Why**: This prevents focus from "sticking" to the trigger button in the background, which is a common cause of the `aria-hidden` focus conflict.

## Verification Results
- The "獎勵卡歷史紀錄" page should no longer trigger this accessibility warning when opening the details modal.
- Scrolling functionality remains unimpaired.

render_diffs(file:///c:/Users/Administrator/Desktop/營運後台/src/views/Master/Layout.vue)
