import { useTaskStore } from "../../store/useTaskStore";
import type { Status, Task } from "../../types/task";
import TaskCard from "./TaskCard";

interface Props {
  title: string;
  status: Status;
  tasks: Task[];
}

const COLUMN_COLORS: Record<Status, string> = {
  todo: "border-t-gray-400",
  inprogress: "border-t-blue-500",
  inreview: "border-t-amber-500",
  done: "border-t-green-500",
};

function KanbanColumn({ title, status, tasks }: Props) {
  const draggingTaskId = useTaskStore((s) => s.draggingTaskId);
  const updateTask = useTaskStore((s) => s.updateTask);
  const setDraggingTask = useTaskStore((s) => s.setDraggingTask);
  const setDragPosition = useTaskStore((s) => s.setDragPosition);
  const setDragOriginStatus = useTaskStore((s) => s.setDragOriginStatus);

  const handlePointerUp = () => {
    if (draggingTaskId) {
      updateTask(draggingTaskId, { status });
      setDraggingTask(null);
      setDragPosition(null);
      setDragOriginStatus(null);
    }
  };

  const isDragTarget = !!draggingTaskId;

  return (
    <div
      onPointerUp={handlePointerUp}
      className={`bg-gray-50 rounded-lg border-t-4 ${COLUMN_COLORS[status]} w-72 flex-shrink-0 flex flex-col transition-colors ${
        isDragTarget ? "bg-blue-50 ring-2 ring-blue-200" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200">
        <h2 className="font-semibold text-sm text-gray-700">{title}</h2>
        <span className="text-xs bg-gray-200 text-gray-600 font-medium px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-xs text-center">No tasks here.<br />Drag one over!</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;