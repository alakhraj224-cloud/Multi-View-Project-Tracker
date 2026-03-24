import { useState } from "react";

import KanbanView from "./components/Kanban/KanbanView";
import ListView from "./components/List/ListView";
import TimelineView from "./components/Timeline/TimelineView";

import FilterBar from "./components/Filters/FilterBar";
import PresenceBar from "./components/Presence/PresenceBar";

import { useSyncFiltersWithURL } from "./hooks/useSyncFiltersWithURL";
import { useCollabSimulation } from "./hooks/useCollabSimulation";

type ViewType = "kanban" | "list" | "timeline";

function App() {
  const [view, setView] = useState<ViewType>("kanban");

  // ✅ Sync filters with URL
  useSyncFiltersWithURL();

  // ✅ Start collaboration simulation
  useCollabSimulation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <h1 className="text-lg font-semibold">Project Tracker</h1>

        {/* View Switch */}
        <div className="flex gap-2">
          {["kanban", "list", "timeline"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as ViewType)}
              className={`px-3 py-1 text-sm rounded border transition ${
                view === v
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Collaboration Presence */}
      <PresenceBar />

      {/* Filters */}
      <FilterBar />

      {/* Views */}
      <div className="p-4">
        {view === "kanban" && <KanbanView />}
        {view === "list" && <ListView />}
        {view === "timeline" && <TimelineView />}
      </div>
    </div>
  );
}

export default App;