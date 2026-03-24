import { useTaskStore } from "../../store/useTaskStore";
import type { Task, Status } from "../../types/task";

interface Props {
  task: Task;
  style?: React.CSSProperties;
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "inreview", label: "In Review" },
  { value: "done", label: "Done" },
];

function formatDueDate(dueDate: string): { label: string; cls: string } {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.floor((dueDay.getTime() - today.getTime()) / 86400000);

  if (diffDays === 0) return { label: "Due Today", cls: "text-amber-600 font-semibold" };
  if (diffDays < -7) return { label: `${Math.abs(diffDays)}d overdue`, cls: "text-red-600 font-semibold" };
  if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, cls: "text-red-500" };
  return {
    label: due.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    cls: "text-gray-500",
  };
}

function ListRow({ task, style }: Props) {
  const updateTask = useTaskStore((s) => s.updateTask);
  const { label, cls } = formatDueDate(task.dueDate);

  return (
    <tr style={style} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-2 text-sm text-gray-800 max-w-[220px] truncate">{task.title}</td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
            {task.assignee}
          </div>
          <span className="text-sm text-gray-600">{task.assignee}</span>
        </div>
      </td>
      <td className="px-4 py-2">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority.toUpperCase()}
        </span>
      </td>
      <td className={`px-4 py-2 text-sm ${cls}`}>{label}</td>
      <td className="px-4 py-2">
        <select
          value={task.status}
          onChange={(e) => updateTask(task.id, { status: e.target.value as Status })}
          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}

export default ListRow;