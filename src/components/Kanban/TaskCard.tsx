import { useTaskStore } from "../../store/useTaskStore";
import type { Task, Priority } from "../../types/task";

const PRIORITY_COLORS: Record<Priority, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

function formatDueDate(dueDate: string): {
  label: string;
  overdue: boolean;
  urgent: boolean;
} {
  const due = new Date(dueDate);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffDays = Math.floor(
    (dueDay.getTime() - today.getTime()) / 86400000
  );

  if (diffDays === 0)
    return { label: "Due Today", overdue: false, urgent: true };

  if (diffDays < 0)
    return {
      label:
        diffDays < -7
          ? `${Math.abs(diffDays)}d overdue`
          : `${Math.abs(diffDays)}d overdue`,
      overdue: true,
      urgent: false,
    };

  return {
    label: due.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    overdue: false,
    urgent: false,
  };
}

interface Props {
  task: Task;
}

function TaskCard({ task }: Props) {
  const setDraggingTask = useTaskStore((s) => s.setDraggingTask);
  const setDragPosition = useTaskStore((s) => s.setDragPosition);
  const setDragOriginStatus = useTaskStore((s) => s.setDragOriginStatus);

  const draggingTaskId = useTaskStore((s) => s.draggingTaskId);
  const collabUsers = useTaskStore((s) => s.collabUsers);

  const isDragging = draggingTaskId === task.id;

  const activeUsers = collabUsers.filter(
    (u) => u.activeTaskId === task.id
  );

  const { label, overdue, urgent } = formatDueDate(task.dueDate);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingTask(task.id);
    setDragOriginStatus(task.status);
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingTaskId === task.id) {
      setDragPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePointerUp = () => {
    setDraggingTask(null);
    setDragPosition(null);
    setDragOriginStatus(null);
  };

  // Placeholder while dragging
  if (isDragging) {
    return (
      <div className="h-[90px] bg-blue-100 rounded-lg border-2 border-dashed border-blue-300" />
    );
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      title={`${task.title} (${task.startDate ?? "No start"} → ${task.dueDate})`}
      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing select-none hover:shadow-md transition-all duration-200"
    >
      {/* Title */}
      <p className="text-sm font-medium text-gray-800 mb-2 leading-tight">
        {task.title}
      </p>

      {/* Priority */}
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          PRIORITY_COLORS[task.priority]
        }`}
      >
        {task.priority.toUpperCase()}
      </span>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-2">
        {/* Assignee */}
        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
          {task.assignee}
        </div>

        {/* Due date */}
        <span
          className={`text-[10px] font-medium ${
            overdue
              ? "text-red-600"
              : urgent
              ? "text-amber-600"
              : "text-gray-400"
          }`}
        >
          {label}
        </span>
      </div>

      {/* Collaboration avatars */}
      {activeUsers.length > 0 && (
        <div className="flex mt-2">
          {activeUsers.slice(0, 2).map((u, i) => (
            <div
              key={u.id}
              style={{
                backgroundColor: u.color,
                marginLeft: i === 0 ? 0 : -6,
              }}
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold border-2 border-white transition-all"
            >
              {u.initials}
            </div>
          ))}

          {activeUsers.length > 2 && (
            <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-[8px] border-2 border-white -ml-1">
              +{activeUsers.length - 2}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskCard;