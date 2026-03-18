# JEE Notes

## Current State
App has a sidebar with: Dashboard, Physics, Chemistry, Mathematics, Bookmarks views. Notes are managed per subject. No formula reference section exists.

## Requested Changes (Diff)

### Add
- New `formula-sheet` SidebarView
- Sidebar nav item: "Formula Sheet" with a suitable icon (e.g. FileText or BookMarked)
- New page `FormulaSheet.tsx` with static JEE formula content organized by subject and chapter
- App.tsx routing for the new view

### Modify
- `SidebarView` type to include `"formula-sheet"`
- Sidebar navItems array to include Formula Sheet entry
- App.tsx to render `<FormulaSheetPage />` when view === "formula-sheet"

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/pages/FormulaSheet.tsx` with:
   - Accordion or tabbed layout for Maths, Physics, Chemistry
   - Each subject has chapters listed below
   - Maths: Limits, Differentiation, Integration, Trigonometry, Matrices
   - Physics: Kinematics, NLM, Work Power Energy, Rotation, Modern Physics
   - Chemistry: Mole Concept, Thermodynamics, Chemical Kinetics, Electrochemistry
   - Each chapter shows important JEE formulas with proper headings, spacing, and mobile-friendly layout
2. Update `Sidebar.tsx` SidebarView type + navItems
3. Update `App.tsx` to route to FormulaSheetPage
