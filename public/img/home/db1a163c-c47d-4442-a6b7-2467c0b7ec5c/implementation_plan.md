# Competition Blog Frontend Implementation Plan

## Development Principles
- **Scalability & Maintainability**: Architecture designed for easy expansion and long-term maintenance.
- **User Experience**: Mandatory loading states/animations for all asynchronous operations.
- **Code Quality**: Concise, self-documenting code with strategic comments for complex logic.
- **High Modularity**: Component-driven development to minimize duplication and maintenance costs.
- **RWD Optimization**: All screens and components must be optimized for responsive web design across various devices.



## Proposed Changes

### Multi-language Support (i18n)
- [NEW] Implement `next-intl` or a custom lightweight i18n context provider.
- [NEW] Create dictionary files: `zh-TW.json`, `zh-CN.json`, `en.json`.
- [MODIFY] Wrap the application in an i18n provider for dynamic translation.

### Design System (Bright Theme)
- [MODIFY] Update `globals.css` to use a light-themed color palette:
  - Background: Off-white/slate-50.
  - Surface: White with subtle shadows.
  - Brand: High-contrast emerald/navy accents.
- [MODIFY] Ensure all shared components (`Card`, `ScoreCard`, `PostCard`) adapt to the bright theme while maintaining the "premium" feel.

### Layout & UI Refinement
- [MODIFY] `Footer.tsx`:
  - Switch to a dark theme (`bg-brand-heading`) for a high-end feel.
  - Fix Threads icon with correct SVG path.
  - Adjust typography and link styles for dark background contrast.
- [NEW] `BackToTop.tsx`:
  - Implement scroll-to-top component with threshold detection (>400px).
  - Add smooth scroll and fade-in/out animations.
- [MODIFY] `RootLayout.tsx`:
  - Integrate `BackToTop` component globally.


### Navigation & Ticker Upgrade
- [MODIFY] `Header.tsx`: 
  - Fix dropdown hover gap by adding a transparent bridge between the menu and trigger.
  - Implement mobile hamburger menu and SideMenu overlay.
  - Ensure Level 1 & Level 2 navigation is accessible on mobile via an accordion or expanded list.
- [NEW] `LiveTicker.tsx`:

  - Implement a fixed top marquee for real-time scores.
  - Fields: `match_id`, `sport_type`, `status` (PRE, LIVE, FINAL), `teams`, `match_info`.
  - Logic: Auto-scroll with hover-pause, click to navigate.
  - Styling: High-contrast, compact design to maximize readability.

### Updated Core Features
- [MODIFY] `types/index.ts`: Update `Match` type or add `TickerMatch` for specialized ticker data.
- [MODIFY] `api.ts`: Add `getTickerMatches` mock function.
- [MODIFY] `RootLayout.tsx`: Place `LiveTicker` above `Header`.
- [MODIFY] `page.tsx`: Use translation keys and adapt to new layout.



### Homepage Redesign
- [NEW] **Banner Carousel**: Implement a full-width hero slider using `framer-motion` or standard CSS for ads and featured content (`target="_blank"` support).
- [NEW] **Horizontal Ad Section**: Fixed banner location below the hero.
- [NEW] **Hot Articles Grid**: 3x2 grid layout displaying exactly 6 cards.
- [NEW] **Latest News Slider**: Multi-page slider (4 items/page, 2 pages) for news.
- [NEW] **Featured Specials**: Zigzag presentation (Top-Left and Bottom-Right) for graphic-heavy features.
- [NEW] **Dual Column Section**:
  - Left: Article feed with 4 items/page and functional pagination.
  - Right: Match sidebar (3 games) + Sticky Ad.



### Specification Alignment
- [MODIFY] **Z-Index Layering**:
  - `LiveTicker`: set to `z-[1000]`.
  - `Header`: set to `z-[999]`.
  - `BackToTop`: set to `z-[998]`.
  - `Main` & `Footer`: set to `relative z-1`.
- [MODIFY] **Data Flow & Navigation**:
  - Refactor `Header.tsx` to fetch navigation from `/api/layout/navigation`.
  - Implement a mock service for API-driven navigation.
- [MODIFY] **Interactions & Performance**:
  - Implement `throttle` for `isScrolled` and `BackToTop` visibility logic.
  - Adjust RWD breakpoint for SideMenu to `1024px` (Tailwind `lg`).
- [MODIFY] **Edge Case Handling**:
  - Update `LiveTicker` to show "No matches" message when data is empty.
  - Add "Connecting" visual state for API failures.

### Automated Tests
- `npm run build`: Verify production build stability.
- `npx tsc`: Type check all files.

### Manual Verification
- Verify responsive layouts on desktop and mobile.
- Check lighthouse scores for SEO and Performance.
- Test real-time score updates simulation.
