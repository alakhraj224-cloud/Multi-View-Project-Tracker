import { useTaskStore } from "../../store/useTaskStore";

const statuses = ["todo", "inprogress", "review", "done"];
const priorities = ["critical", "high", "medium", "low"];
const assignees = ["Alice", "Bob", "Charlie", "David", "Eve", "Ravi"];

function FilterBar() {
  const filters = useTaskStore((s) => s.filters);
  const setFilters = useTaskStore((s) => s.setFilters);
  const clearFilters = useTaskStore((s) => s.clearFilters);

  const toggle = (key: "status" | "priority" | "assignee", value: string) => {
    const current = filters[key];

    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    setFilters({ [key]: updated });
  };

  const hasActive =
    filters.status.length ||
    filters.priority.length ||
    filters.assignee.length ||
    filters.dueDateFrom ||
    filters.dueDateTo;

  return (
    <div className="p-4 border-b bg-white flex flex-wrap gap-4 items-center">
      {/* Status */}
      <div>
        <p className="text-xs font-semibold mb-1">Status</p>
        <div className="flex gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => toggle("status", s)}
              className={`px-2 py-1 text-xs rounded border ${
                filters.status.includes(s as any)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <p className="text-xs font-semibold mb-1">Priority</p>
        <div className="flex gap-2">
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => toggle("priority", p)}
              className={`px-2 py-1 text-xs rounded border ${
                filters.priority.includes(p as any)
                  ? "bg-red-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Assignee */}
      <div>
        <p className="text-xs font-semibold mb-1">Assignee</p>
        <div className="flex gap-2 flex-wrap">
          {assignees.map((a) => (
            <button
              key={a}
              onClick={() => toggle("assignee", a)}
              className={`px-2 py-1 text-xs rounded border ${
                filters.assignee.includes(a)
                  ? "bg-green-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div>
        <p className="text-xs font-semibold mb-1">Due Date</p>
        <div className="flex gap-2">
          <input
            type="date"
            value={filters.dueDateFrom || ""}
            onChange={(e) => setFilters({ dueDateFrom: e.target.value })}
            className="border px-2 py-1 text-xs rounded"
          />
          <input
            type="date"
            value={filters.dueDateTo || ""}
            onChange={(e) => setFilters({ dueDateTo: e.target.value })}
            className="border px-2 py-1 text-xs rounded"
          />
        </div>
      </div>

      {hasActive && (
        <button
          onClick={clearFilters}
          className="ml-auto text-sm text-indigo-600 hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

export default FilterBar;