

## Plan: Rebuild the 14-Day Plan Viewer with Custom Layout

### What changes

The current `PlanViewer` uses a generic task-type system (task/milestone/deliverable). The new design splits each day into **Operator** and **Creator** sections with a clean, execution-focused layout, plus "Add Script / Content Here" placeholders on relevant days.

### Data model change

Update the `PlanDay` and `PlanTask` interfaces in `ViewMyPlan.tsx`:
- Replace `type: "task" | "milestone" | "deliverable"` with `role: "operator" | "creator"`
- Remove `icon` field from tasks
- Add optional `contentSlot?: boolean` to `PlanDay` for days that need "Add Script / Content Here" sections (Days 3–9)

### Database update

Delete the existing Aaron plan from `client_plans` table and insert a new one with the hardcoded 14-day plan data matching the exact content provided, structured as:
```json
[
  {
    "day": 1,
    "title": "Product Lock + Direction",
    "summary": "Lock full product direction and confirm positioning.",
    "tasks": [
      { "title": "Lock product direction", "description": "Define core outcome...", "role": "operator" },
      { "title": "Review direction", "description": "Confirm alignment...", "role": "creator" }
    ],
    "contentSlot": false
  },
  ...
]
```

### PlanViewer rebuild (`src/components/plan/PlanViewer.tsx`)

- Each day card splits into two columns (stacked on mobile): **Operator Side** (left, blue accent) and **Creator Side** (right, green accent)
- Connecting vertical line with day number badges between cards
- On days 3–9, add a styled placeholder block: "Add Script / Content Here"
- Clean transitions using framer-motion (fade + slide in from bottom)
- Completion card at the end updated to say "Ready for Launch" instead of generic text

### PlanAdminOverlay + DashboardPlans

- Update to match the new data shape (`role` instead of `type`)
- The AI `structure-plan` edge function prompt updated to use `role: "operator" | "creator"` instead of `type`

### Files to modify
1. **`src/pages/ViewMyPlan.tsx`** — Update interfaces (`PlanTask`, `PlanDay`)
2. **`src/components/plan/PlanViewer.tsx`** — Full rebuild with operator/creator split layout
3. **`supabase/functions/structure-plan/index.ts`** — Update JSON schema in prompts to use `role`
4. **`src/components/plan/DashboardPlans.tsx`** — Minor type updates
5. **Database** — Delete old Aaron plan, insert new one with exact content provided

