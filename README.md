# HR Workflow Designer

A visual workflow designer for HR processes built with React + React Flow. Design, test, and export internal workflows like onboarding, leave approval, and document verification.

## Features

- **Visual Canvas** - Drag and drop nodes to create workflows
- **5 Node Types** - Start, Task, Approval, Automated, End
- **Node Configuration** - Click any node to edit its properties
- **Templates** - Pre-built workflows (Onboarding, Leave Request, Document Verification)
- **Import/Export** - JSON format for saving and sharing workflows
- **Test Simulation** - Run workflow with real-time logs

## Folder Structure

```
src/
├── api/                    # Mock API layer
│   └── workflowApi.ts      # Simulation & export functions
├── components/
│   ├── canvas/
│   │   ├── NodeSidebar.tsx    # Add nodes + templates
│   │   └── ImportDialog.tsx   # Import modal
│   ├── forms/
│   │   └── NodeFormPanel.tsx  # Node config forms
│   ├── nodes/
│   │   └── *.tsx          # Custom node components
│   └── sandbox/
│       └── SandboxPanel.tsx    # Test runner
├── store/
│   └── workflowStore.ts   # Zustand state management
├── types/
│   └── index.ts           # TypeScript types
└── App.tsx                # Main app component
```

## Tech Stack

- React 19 + TypeScript
- React Flow (@xyflow/react)
- Zustand (state management)
- Tailwind CSS
- Vite

## Assumptions Made

1. **Single End Node** - Workflow must have exactly one End node
2. **Linear Flow** - No parallel branches (one path execution)
3. **No Persistence** - Workflows are not saved (refresh clears canvas)
4. **Mock Data** - Simulation uses simulated data (no real backend)
5. **JSON Import/Export** - Primary way to save/share workflows

## Running locally

I've used `bun`, we can user nay other package manager of our choice

```bash
# Install dependencies
bun install

# Run development server
bun run dev

```

Open `http://localhost:5173` in your browser.

## Usage

1. **Add Nodes** - Drag from sidebar or click "Use Prebuilt Templates"
2. **Connect** - Drag from node's right handle to next node's left handle
3. **Configure** - Click any node to edit its properties in the right panel
4. **Test** - Click "Test" tab → "Run Workflow" to simulate execution
5. **Export** - Click "Export" in header to download JSON

You can use prebuilt tempates present in the sidebar of the aplication to save your time of building the flow from scratch.
