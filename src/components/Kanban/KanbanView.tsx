import { useTaskStore } from "../../store/useTaskStore";
import type { Status } from "../../types/task";
import KanbanColumn from "./KanbanColumn";
import { getFilteredSortedTasks } from "../../store/useTaskStore";

const COLUMNS: { key: Status; title: string }[] = [
  { key: "todo", title: "To Do" },
  { key: "inprogress", title: "In Progress" },
  { key: "inreview", title: "In Review" },
  { key: "done", title: "Done" },
];

function KanbanView() {
  const allState = useTaskStore((s) => s);
  const tasks = getFilteredSortedTasks(allState);
  const draggingTaskId = useTaskStore((s) => s.draggingTaskId);
  const dragPosition = useTaskStore((s) => s.dragPosition);
  const dragOriginStatus = useTaskStore((s) => s.dragOriginStatus);
  const setDraggingTask = useTaskStore((s) => s.setDraggingTask);
  const setDragPosition = useTaskStore((s) => s.setDragPosition);
  const setDragOriginStatus = useTaskStore((s) => s.setDragOriginStatus);
  const updateTask = useTaskStore((s) => s.updateTask);

  const draggingTask = tasks.find((t) => t.id === draggingTaskId);

  const grouped: Record<Status, typeof tasks> = {
    todo: [],
    inprogress: [],
    inreview: [],
    done: [],
  };
  tasks.forEach((t) => grouped[t.status].push(t));

  // Global pointer move — tracks drag anywhere on screen
  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingTaskId) {
      setDragPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // If pointer released outside a column — snap back
  const handlePointerUp = () => {
    if (draggingTaskId && dragOriginStatus) {
      updateTask(draggingTaskId, { status: dragOriginStatus });
      setDraggingTask(null);
      setDragPosition(null);
      setDragOriginStatus(null);
    }
  };

  return (
    <div
      className="relative"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="flex gap-4 p-4 overflow-x-auto" style={{ height: "calc(100vh - 140px)" }}>
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.key}
            title={col.title}
            status={col.key}
            tasks={grouped[col.key]}
          />
        ))}
      </div>

      {/* Drag overlay card */}
      {draggingTask && dragPosition && (
        <div
          style={{
            position: "fixed",
            top: dragPosition.y,
            left: dragPosition.x,
            transform: "translate(-50%, -50%) rotate(2deg)",
            pointerEvents: "none",
            zIndex: 1000,
            width: "200px",
            opacity: 0.85,
          }}
          className="bg-white p-3 rounded-lg shadow-2xl border border-blue-300"
        >
          <p className="text-sm font-medium text-gray-800 truncate">{draggingTask.title}</p>
          <p className="text-xs text-gray-400 mt-1">{draggingTask.assignee} · {draggingTask.priority}</p>
        </div>
      )}
    </div>
  );
}

export default KanbanView;