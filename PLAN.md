# Prototype — Implementation Plan

## Vision

A personal learning visualization tool with two sections: **Algorithm Patterns** and **System Design**. The core UX is a **mindmap-style roadmap** (inspired by neetcode.io/roadmap) where nodes are clickable and expandable. The design philosophy is **recall-first**: click a topic → space to think/recall → expand to verify.

System Design cases follow the **6-step delivery framework** (inspired by hellointerview.com): Requirements → Core Entities → API/Interface → Data Flow → High-Level Design → Deep Dives.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 19 + TypeScript | Match NeuralRipper |
| Build | Vite | Match NeuralRipper |
| Styling | Tailwind CSS 4 + shadcn/ui | Match NeuralRipper |
| Mindmap/Roadmap | **React Flow** | Interactive node graph with zoom/pan, custom nodes, edge animations |
| Code Highlighting | **Shiki** | Theme-aware syntax highlighting with per-line control |
| Animations | **Framer Motion** | Smooth expand/collapse, step-through animations, data flow paths |
| Routing | **React Router v7** | Deep linking: `/algo/dp/0-1-knapsack/lc-416`, `/system-design/uber` |
| Icons | lucide-react | Match NeuralRipper |

No backend. All content is defined as TypeScript data files.

---

## Design System

Inherit NeuralRipper's aesthetic:
- Dark background (`oklch(0.10 0.02 260)`)
- Cyan accent (`#06B6D4` / `cyan-400`)
- JetBrains Mono font throughout
- Terminal/retro-futuristic feel
- Border-based cards, no shadows, sharp or minimal radius

---

## Project Structure

```
Prototype/
├── src/
│   ├── App.tsx                          # Top-level layout + router
│   ├── main.tsx                         # Entry point
│   ├── index.css                        # Global styles (same theme as NeuralRipper)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx             # Top nav bar (Algorithms | System Design)
│   │   │   └── Breadcrumb.tsx           # Navigation breadcrumb trail
│   │   │
│   │   ├── mindmap/
│   │   │   ├── MindmapCanvas.tsx        # React Flow canvas wrapper
│   │   │   ├── TopicNode.tsx            # Custom React Flow node for topics
│   │   │   ├── CategoryNode.tsx         # Custom node for top-level categories
│   │   │   └── MindmapEdge.tsx          # Custom animated edge
│   │   │
│   │   ├── common/
│   │   │   ├── RecallCard.tsx           # "What do you remember?" expandable card
│   │   │   ├── CodeBlock.tsx            # Shiki-powered syntax highlighting
│   │   │   ├── StepProgress.tsx         # Numbered step indicator (1-6 for SD)
│   │   │   ├── AnimationPlayer.tsx      # Reusable animation controller (play/pause/step/speed)
│   │   │   └── DataFlowAnimation.tsx    # Animated path through architecture diagram
│   │   │
│   │   ├── algorithms/
│   │   │   ├── AlgoRoadmap.tsx          # Mindmap view of all algorithm categories
│   │   │   ├── PatternPage.tsx          # Sub-pattern detail (e.g., 0-1 Knapsack overview)
│   │   │   ├── ProblemPage.tsx          # Single LC problem with solutions + viz
│   │   │   ├── SolutionView.tsx         # Code + visualization split view
│   │   │   └── visualizers/
│   │   │       ├── DPTableViz.tsx       # Animated DP table fill
│   │   │       ├── ArrayPointerViz.tsx  # Two pointer / sliding window on array
│   │   │       ├── TreeViz.tsx          # Tree traversal visualization
│   │   │       └── GraphViz.tsx         # Graph BFS/DFS visualization
│   │   │
│   │   ├── system-design/
│   │   │   ├── SDRoadmap.tsx            # Mindmap view of all SD cases
│   │   │   ├── CasePage.tsx             # Single case container with 6-step layout
│   │   │   └── steps/
│   │   │       ├── RequirementsStep.tsx  # Step 1: FR + NFR lists
│   │   │       ├── CoreEntitiesStep.tsx  # Step 2: Entity cards/table
│   │   │       ├── ApiInterfaceStep.tsx  # Step 3: REST/gRPC endpoint definitions
│   │   │       ├── DataFlowStep.tsx      # Step 4: Sequential data flow diagram
│   │   │       ├── HighLevelDesignStep.tsx # Step 5: React Flow architecture diagram
│   │   │       │   # Custom React Flow node types (ServiceNode, DatabaseNode,
│   │   │       │   # QueueNode, CacheNode, ClientNode, LoadBalancerNode) are
│   │   │       │   # defined inline or in a single ArchitectureNodes.tsx co-located here.
│   │   │       │   # They render different shapes/icons per component type on the diagram.
│   │   │       └── DeepDivesStep.tsx     # Step 6: Expandable deep dive sections
│   │   │
│   │   └── ui/                          # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── collapsible.tsx
│   │       ├── tabs.tsx
│   │       └── ...
│   │
│   ├── data/                            # Static content — no backend needed
│   │   │                                # Components import from here to render.
│   │   │                                # Adding a new case/pattern = adding a new data file.
│   │   ├── algorithms/
│   │   │   ├── index.ts                 # Re-exports all pattern categories
│   │   │   ├── binary-search.ts         # Binary search patterns + problems
│   │   │   ├── dp.ts                    # DP patterns + problems
│   │   │   ├── sliding-window.ts        # Sliding window patterns + problems
│   │   │   └── ...
│   │   │
│   │   └── system-design/
│   │       ├── index.ts                 # Re-exports all SD cases
│   │       ├── uber.ts                  # Uber case (all 6 steps of content)
│   │       ├── whatsapp.ts              # WhatsApp case
│   │       ├── youtube.ts               # YouTube case
│   │       └── ...
│   │
│   ├── hooks/
│   │   ├── useAnimationPlayer.ts        # Animation state (step, speed, playing)
│   │   └── useRecall.ts                 # Recall mode state (hidden/revealed)
│   │
│   ├── types/
│   │   ├── algorithm.ts                 # Algorithm data types
│   │   └── system-design.ts             # System design data types
│   │
│   └── lib/
│       └── utils.ts                     # cn() utility
│
├── PLAN.md
├── LICENSE
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

---

## Data Models

### Algorithm Types

```typescript
interface PatternCategory {
  id: string;                  // "dp"
  name: string;                // "Dynamic Programming"
  subPatterns: SubPattern[];
}

interface SubPattern {
  id: string;                  // "0-1-knapsack"
  name: string;                // "0-1 Knapsack"
  pseudocode: string;          // Template code
  keyInsight: string;          // Core "aha" moment
  complexity: { time: string; space: string };
  problems: Problem[];
}

interface Problem {
  lcNumber: number;            // 416
  title: string;               // "Partition Equal Subset Sum"
  difficulty: "Easy" | "Medium" | "Hard";
  solutions: Solution[];
}

interface Solution {
  name: string;                // "2D DP" or "1D Optimized"
  code: string;
  steps?: VisualizationStep[]; // Optional animation sync
}

interface VisualizationStep {
  lineNumbers: number[];       // Code lines to highlight
  description: string;         // "Fill dp[1][3] = True"
  state: Record<string, unknown>; // Viz-specific snapshot (grid, pointers, etc.)
}
```

### System Design Types

```typescript
interface SystemDesignCase {
  id: string;                  // "uber"
  name: string;                // "Uber"
  description: string;         // "Real-time ride-hailing platform"

  // The 6 steps — each is just structured content
  requirements: {
    functional: string[];      // ["Rider requests a ride", ...]
    nonFunctional: string[];   // ["Low-latency matching", ...]
  };
  coreEntities: CoreEntity[];
  apiInterface: ApiEndpoint[];
  dataFlow: string[];          // Ordered descriptions: ["Rider sends request", "API Gateway routes...", ...]
  highLevelDesign: {
    nodes: ArchNode[];
    edges: ArchEdge[];
  };
  deepDives: DeepDive[];
}

interface CoreEntity {
  name: string;                // "Ride"
  fields: { name: string; type: string }[];
}

interface ApiEndpoint {
  method: string;              // "POST"
  path: string;                // "/v1/rides"
  description: string;
  body?: string;               // Request/response example as code string
}

// React Flow node for Step 5 architecture diagram
interface ArchNode {
  id: string;                  // "ride-service"
  type: "service" | "database" | "cache" | "queue" | "client" | "lb";
  label: string;               // "Ride Service"
  position: { x: number; y: number };
  description?: string;        // Shown on click
}

// `type` controls how the node renders on the diagram:
//   service  → rounded rect + gear icon
//   database → cylinder shape
//   cache    → rect + lightning icon
//   queue    → rect + wave icon
//   client   → phone/browser icon
//   lb       → diamond shape
// All implemented in a single <ArchitectureNode> component that switches on `type`.

interface ArchEdge {
  source: string;
  target: string;
  label?: string;              // "REST", "gRPC", "WebSocket"
}

interface DeepDive {
  title: string;               // "How does real-time location tracking work?"
  content: string;             // Markdown
}
```

---

## UX Design — Mindmap Navigation

### How the Mindmap Works

The roadmap is a **React Flow canvas** with custom-styled nodes. It looks like a visual tree/flowchart (similar to neetcode.io/roadmap).

#### Algorithm Roadmap (left-to-right layout)

```
                                                          ┌─ LC 704. Binary Search
                         ┌─ Binary Search (3) ────────────┤
                         │                                └─ LC 33. Search Rotated
                         │
                         │                    ┌─ 0-1 Knapsack ──────┬─ LC 416. Partition
 ALGORITHMS ─────────────┼─ DP (12) ─────────┤                     └─ LC 494. Target Sum
                         │                    └─ Complete Knapsack ─── LC 322. Coin Change
                         │
                         ├─ Sliding Window (5) ──── ...
                         │
                         └─ Graph (6) ──── ...

 (click a node to expand its children → click again to collapse)
 (click a leaf problem node to navigate to its detail page)
```

#### System Design Roadmap (left-to-right layout)

```
                         ┌─ Uber (ride-hailing)
                         │
 SYSTEM DESIGN ──────────┼─ WhatsApp (messaging)
                         │
                         ├─ YouTube (streaming)
                         │
                         └─ Dropbox (file storage)

 (click a case node to navigate to its 6-step case page)
```

### Interaction Flow

1. **Initial view**: The mindmap shows top-level category nodes
2. **Click a category** → child nodes animate into view (Framer Motion layout animation), edges draw in
3. **Click a child node** → navigates to the detail page (pattern page or SD case page)
4. **Collapse**: Click the category again or use a collapse button to hide children

### Recall-First UX

When navigating to a detail page (pattern or SD case), the content is **hidden by default** behind a `RecallCard`:

```
┌─────────────────────────────────────────────────┐
│  0-1 Knapsack                                   │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  🧠 What do you remember?                 │  │
│  │                                           │  │
│  │  Try to recall:                           │  │
│  │  - The recurrence relation                │  │
│  │  - Time & space complexity                │  │
│  │  - When to use this pattern               │  │
│  │                                           │  │
│  │  [ Reveal Answer ]                        │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  (after clicking "Reveal Answer":)              │
│                                                 │
│  Recurrence: dp[i][w] = max(dp[i-1][w], ...)   │
│  Time: O(n * W)  Space: O(W)                   │
│  Key Insight: Each item is used at most once    │
│                                                 │
│  Pseudocode:                                    │
│  ┌───────────────────────────────────────────┐  │
│  │ for i in range(n):                        │  │
│  │   for w in range(W, wt[i]-1, -1):        │  │
│  │     dp[w] = max(dp[w], dp[w-wt[i]]+v[i]) │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Problems:                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │ LC 416     │ │ LC 494     │ │ LC 1049    │  │
│  │ Medium     │ │ Medium     │ │ Medium     │  │
│  └────────────┘ └────────────┘ └────────────┘  │
└─────────────────────────────────────────────────┘
```

Same pattern for System Design — each of the 6 steps has its own RecallCard:

```
Step 1: Requirements
┌──────────────────────────────────────────┐
│  🧠 What are the functional and          │
│     non-functional requirements?         │
│                                          │
│  [ Reveal ]                              │
└──────────────────────────────────────────┘

Step 2: Core Entities
┌──────────────────────────────────────────┐
│  🧠 What are the core entities?          │
│                                          │
│  [ Reveal ]                              │
└──────────────────────────────────────────┘

... and so on for all 6 steps
```

---

## UX Design — System Design Case Page

Each case page follows the **6-step structure** with a horizontal step progress bar at the top:

```
 ① Requirements → ② Core Entities → ③ API → ④ Data Flow → ⑤ High-Level Design → ⑥ Deep Dives
 ━━━━━━━━━━━━━━━   ━━━━━━━━━━━━━━   ━━━━━   ━━━━━━━━━━━   ━━━━━━━━━━━━━━━━━━━   ━━━━━━━━━━━
```

All steps are visible on the page as a vertical scroll (not tabbed), so you can see the full flow. Each step has a recall card that can be expanded.

### Step 5 — High-Level Design (The Diagram)

This is the centerpiece. A React Flow interactive diagram with:

- A single `<ArchitectureNode>` component that renders differently based on `type` (see data model above)
- Dark/cyan themed to match the rest of the app
- Edges with labels (REST, gRPC, WebSocket, pub/sub)
- Click any node → shows its `description` in a detail panel below

---

## UX Design — Algorithm Problem Page

When clicking a specific LC problem from the mindmap or pattern page:

```
┌────────────────────────────────────────────────────────────────────┐
│  DP > 0-1 Knapsack > LC 416. Partition Equal Subset Sum (Medium)  │
│                                                                    │
│  [Solution 1: 2D DP]  [Solution 2: 1D Optimized]                  │
│                                                                    │
│  ┌─── Code ──────────────────┬─── Visualization ────────────────┐ │
│  │                           │                                   │ │
│  │  def canPartition(nums):  │   (DP table / array / tree viz)  │ │
│  │    total = sum(nums)      │                                   │ │
│  │  ► if total % 2:          │   Synced with code highlighting  │ │
│  │      return False         │                                   │ │
│  │    ...                    │                                   │ │
│  │                           │                                   │ │
│  └───────────────────────────┴───────────────────────────────────┘ │
│                                                                    │
│  [◀] [▶ Play] [▶▶]   Step 3/12   Speed: [1x]                     │
│  "Check if total is odd — if so, impossible to partition equally"  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Project Scaffold + Core Layout
**Goal**: Standing app with navigation, theming, and routing

- [ ] Initialize Vite + React + TypeScript project
- [ ] Install dependencies (Tailwind, shadcn/ui, React Router, React Flow, Framer Motion, Shiki, lucide-react)
- [ ] Set up Tailwind with NeuralRipper's dark theme (colors, fonts, spacing)
- [ ] Create `AppShell` with top nav bar: **Algorithms** | **System Design**
- [ ] Set up React Router with route structure
- [ ] Create `Breadcrumb` component for navigation trail

### Phase 2: Mindmap Component (Shared)
**Goal**: Reusable mindmap canvas that both sections use

- [ ] Build `MindmapCanvas` wrapper around React Flow (dark theme, controls, zoom)
- [ ] Build `CategoryNode` custom node (top-level: "DP", "Binary Search" / "Uber", "WhatsApp")
- [ ] Build `TopicNode` custom node (sub-topics, problems)
- [ ] Build `MindmapEdge` custom animated edge
- [ ] Implement click-to-expand: clicking a category node reveals children with Framer Motion animation
- [ ] Implement click-to-navigate: clicking a leaf node routes to detail page

### Phase 3: System Design — Data + Case Page (Priority)
**Goal**: First complete SD case (Uber) with all 6 steps

- [ ] Define `SystemDesignCase` type definitions
- [ ] Create Uber case data file (`data/system-design/uber.ts`) with all 6 steps populated
- [ ] Build `SDRoadmap` — mindmap view showing all SD cases
- [ ] Build `CasePage` — container with 6-step vertical scroll layout
- [ ] Build `StepProgress` — horizontal step indicator at top
- [ ] Build `RecallCard` — expandable "what do you remember?" component
- [ ] Build `RequirementsStep` — functional/non-functional requirement lists
- [ ] Build `CoreEntitiesStep` — entity cards with fields
- [ ] Build `ApiInterfaceStep` — endpoint definitions with CodeBlock
- [ ] Build `DataFlowStep` — sequential numbered flow
- [ ] Build `HighLevelDesignStep` — React Flow architecture diagram
  - [ ] Define custom node types inline (service, database, queue, cache, client, LB) with distinct shapes/icons
  - [ ] Style nodes with dark/cyan theme
  - [ ] Click node → expand detail panel below
- [ ] Build `DeepDivesStep` — collapsible deep dive sections

### Phase 4: Animation Player (Reusable Utility)
**Goal**: Reusable step-through animation controller

- [ ] Build `AnimationPlayer` component (play/pause/step-forward/step-back/speed)
- [ ] Build `useAnimationPlayer` hook (state management for step, playing, speed)
- [ ] Build `DataFlowAnimation` — highlights edges/nodes in sequence on the React Flow diagram
- [ ] Integrate animation into `HighLevelDesignStep` (animate a request path through the architecture)

### Phase 5: System Design — More Cases
**Goal**: Add 2-3 more SD cases

- [ ] Create WhatsApp case data
- [ ] Create YouTube case data
- [ ] Create Dropbox case data (or Twitter/Instagram)
- [ ] Verify all cases render correctly with the existing components

### Phase 6: Algorithms — Data + Pattern Page
**Goal**: First complete algorithm pattern (DP) with problems

- [ ] Define algorithm type definitions
- [ ] Create DP pattern data (`data/algorithms/dp.ts`) with sub-patterns + problems
- [ ] Build `AlgoRoadmap` — mindmap view showing all algorithm categories
- [ ] Build `PatternPage` — sub-pattern overview (pseudocode, recurrence, complexity, key insight)
- [ ] Build `ProblemPage` — LC problem with solution tabs
- [ ] Build `SolutionView` — code + visualization split view
- [ ] Build `CodeBlock` component with Shiki + line highlighting
- [ ] Build `useRecall` hook for recall-first UX

### Phase 7: Algorithm Visualizers
**Goal**: Interactive step-through visualizations

- [ ] Build `DPTableViz` — animated grid that fills cell by cell, highlights dependencies
- [ ] Build `ArrayPointerViz` — pointer movement on array (binary search, two pointer, sliding window)
- [ ] Integrate visualizers with `AnimationPlayer` and `SolutionView`
- [ ] Sync code line highlighting with visualization steps

### Phase 8: More Algorithm Patterns
**Goal**: Flesh out remaining patterns

- [ ] Create Binary Search pattern data + problems
- [ ] Create Sliding Window pattern data + problems
- [ ] Create Graph pattern data + problems
- [ ] Build `TreeViz` and `GraphViz` visualizers as needed

### Phase 9: Polish + Integration
**Goal**: Production-ready, linkable from NeuralRipper

- [ ] Responsive design (mobile-friendly mindmap with touch gestures)
- [ ] Keyboard navigation (arrow keys to traverse mindmap, Enter to expand, Esc to collapse)
- [ ] URL deep linking works for all routes
- [ ] Performance optimization (lazy load case data, code-split by route)
- [ ] Add link from NeuralRipper's nav bar to Prototype
- [ ] Deploy (same infrastructure as NeuralRipper or separate)

---

## Route Structure

```
/                               → Redirect to /system-design
/algorithms                     → Algorithm mindmap roadmap
/algorithms/:patternId          → Pattern category page (e.g., /algorithms/dp)
/algorithms/:patternId/:subId   → Sub-pattern page (e.g., /algorithms/dp/0-1-knapsack)
/algorithms/:patternId/:subId/:problemId
                                → Problem page (e.g., /algorithms/dp/0-1-knapsack/lc-416)
/system-design                  → System design mindmap roadmap
/system-design/:caseId          → Case page (e.g., /system-design/uber)
```

---

## Content to Populate (Initial)

### System Design Cases (Phase 3 + 5)
1. **Uber** — ride-hailing (geospatial, real-time matching, location tracking)
2. **WhatsApp** — messaging (WebSocket, message queue, E2E encryption, presence)
3. **YouTube** — video streaming (upload pipeline, transcoding, CDN, recommendation)
4. **Dropbox** — file storage (chunking, sync, dedup, conflict resolution)

### Algorithm Patterns (Phase 6 + 8)
1. **DP** — 0-1 Knapsack, Complete Knapsack, LIS, State Machine (LC 416, 494, 322, 518, 300, 121)
2. **Binary Search** — standard, rotated, answer-based (LC 704, 33, 875)
3. **Sliding Window** — fixed, variable, two pointer (LC 239, 76, 3, 11)
4. **Graph** — BFS/DFS, Topological Sort, Union Find (LC 200, 207, 323)

---

## NeuralRipper Integration

Prototype is a standalone Vite app that gets embedded into NeuralRipper as a new tab. Since NeuralRipper uses simple state-driven tabs (no router), integration is straightforward:

1. **Build Prototype** as a static bundle (`npm run build` → `dist/`)
2. **Deploy separately** to its own URL (e.g., `prototype.yourdomain.com`)
3. **Add a "Prototype" tab** in NeuralRipper's `App.tsx` `TABS` array
4. **Render an `<iframe>`** pointing to the deployed Prototype URL when the tab is active, or alternatively render a simple external link/button that opens it in a new tab

That's it. Both apps share the same visual theme (dark/cyan/JetBrains Mono) so it feels seamless. No shared dependencies, no monorepo, no build coupling — just a link or iframe.

If later we want tighter coupling (e.g., shared auth, no iframe), we can move Prototype into NeuralRipper as a React Router route and import its components directly. But iframe/link-out is the simplest starting point.

---

## Notes

- No backend — all data is static TypeScript files
- Adding new content = adding a new data file, no component changes
- System Design is built first per user request
- AnimationPlayer is a reusable utility — works on diagrams, code views, or any step-through content
- RecallCard wraps any content: shows a prompt, user recalls, clicks "Reveal" to verify
