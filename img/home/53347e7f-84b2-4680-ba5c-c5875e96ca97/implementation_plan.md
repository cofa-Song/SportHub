# Dashboard Beautification & Theme Toggle

Enhance the visual appeal of the operations dashboard and implement a theme switcher to support both standard (Light) and Eye Protection (Dark) modes.

## User Review Required

> [!IMPORTANT]
> This update will significantly change the visual style of the application, moving from a standard layout to a modern "Glassmorphism" design with semi-transparent elements and vibrant accents.

## Proposed Changes

### Core Theme System

#### [MODIFY] [App.vue](file:///c:/Users/Administrator/Desktop/%E7%87%9F%E9%81%8B%E5%BE%8C%E5%8F%B0/src/App.vue)
- Import `darkTheme` from `naive-ui`.
- Reactively switch `theme` prop in `NConfigProvider` based on `configStore.theme`.

### Layout Enhancement

#### [MODIFY] [Layout.vue](file:///c:/Users/Administrator/Desktop/%E7%87%9F%E9%81%8B%E5%BE%8C%E5%8F%B0/src/views/Master/Layout.vue)
- **Header**: Add a theme switch toggle with Sun/Moon icons next to the Logout button.
- **Glassmorphism**: Apply semi-transparent background, blur filters, and thin borders to the Sidebar, Header, and Content cards.
- **Sidebar**: Update styling for better spacing and active state indication.
- **Transitions**: Add smooth transitions between theme changes.

### Global Design System

#### [MODIFY] [style.css](file:///c:/Users/Administrator/Desktop/%E7%87%9F%E9%81%8B%E5%BE%8C%E5%8F%B0/src/style.css)
- Define CSS custom properties for vibrant accents (primary-blue, success-green, etc.).
- Add global utility classes for glassmorphic effects.
- Implement entrance animations for page content.

## Verification Plan

### Manual Verification
1. **Theme Toggle**: Click the toggle button in the header; ensure the entire UI (including tables and modals) switches between light and dark modes instantly.
2. **Persistence**: Refresh the page; verify that the last selected theme is remembered.
3. **Visual Quality**: Check that the text is legible in both modes and that the "premium" feel (transparency, shadows) is consistent across components.
4. **Responsive**: Ensure the layout remains functional on various screen sizes.
