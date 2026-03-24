import { useTaskStore, getFilteredSortedTasks } from "../../store/useTaskStore";

const DAY_WIDTH = 32;

function getDaysInMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const days = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: days }, (_, i) => i + 1);
}

function getDateIndex(dateStr: string) {
  const d = new Date(dateStr);
  return d.getDate() - 1;
}

function getTodayIndex() {
  return new Date().getDate() - 1;
}

function TimelineView() {
  const state = useTaskStore((s) => s);
  const tasks = getFilteredSortedTasks(state);

  const days = getDaysInMonth();
  const todayIndex = getTodayIndex();

  return (
    <div className="border rounded-lg bg-white overflow-auto">
      {/* Header (Days) */}
      <div className="flex border-b sticky top-0 bg-white z-10">
        <div className="w-48 shrink-0 p-2 font-semibold border-r">
          Task
        </div>

        <div className="flex">
          {days.map((d) => (
            <div
              key={d}
              style={{ width: DAY_WIDTH }}
              className="text-xs text-center border-r py-2"
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="relative">
        {/* Today Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-20"
          style={{ left: 192 + todayIndex * DAY_WIDTH }}
        />

        {tasks.map((task) => {
          const startIndex = task.startDate
            ? getDateIndex(task.startDate)
            : getDateIndex(task.dueDate);

          const endIndex = getDateIndex(task.dueDate);

          const width =
            task.startDate
              ? (endIndex - startIndex + 1) * DAY_WIDTH
              : 6; // marker for no start date

          const left = startIndex * DAY_WIDTH;

          return (
            <div
              key={task.id}
              className="flex border-b items-center h-12"
            >
              {/* Task name */}
              <div className="w-48 shrink-0 px-2 text-sm border-r truncate">
                {task.title}
              </div>

              {/* Timeline row */}
              <div className="relative flex-1 h-full">
                <div
                  title={`${task.title} (${task.startDate ?? "No start"} → ${task.dueDate})`}
                  className={`absolute top-2 h-6 rounded ${
                    task.priority === "critical"
                      ? "bg-red-500"
                      : task.priority === "high"
                      ? "bg-orange-400"
                      : task.priority === "medium"
                      ? "bg-blue-400"
                      : "bg-green-400"
                  }`}
                  style={{
                   left,
                   width,
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No tasks to display
          </div>
        )}
      </div>
    </div>
  );
}

export default TimelineView;