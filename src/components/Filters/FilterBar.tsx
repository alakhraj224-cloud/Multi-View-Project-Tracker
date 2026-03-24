import { useTaskStore } from "../../store/useTaskStore";
import type { Status, Priority } from "../../types/task";

function FilterBar() {
  const { filters, setFilters, clearFilters } = useTaskStore();

  const toggleArrayValue = (
    key: "status" | "priority" | "assignee",
    value: string
  ) => {
    const current = filters[key];

    const exists = (current as string[]).includes(value);

    setFilters({
      [key]: exists
        ? (current as string[]).filter((v) => v !== value)
        : [...(current as string[]), value],
    });
  };

  return (
    <div className="p-4 bg-white border-b flex flex-wrap gap-3 items-center">
      
      {/* Status */}
      {(["todo", "in-progress", "in-review", "done"] as Status[]).map((s) => (
        <button
          key={s}
          onClick={() => toggleArrayValue("status", s)}
          className={`px-2 py-1 border rounded ${
            filters.status.includes(s) ? "bg-blue-500 text-white" : ""
          }`}
        >
          {s}
        </button>
      ))}

      {/* Priority */}
      {(["critical", "high", "medium", "low"] as Priority[]).map((p) => (
        <button
          key={p}
          onClick={() => toggleArrayValue("priority", p)}
          className={`px-2 py-1 border rounded ${
            filters.priority.includes(p) ? "bg-red-500 text-white" : ""
          }`}
        >
          {p}
        </button>
      ))}

      {/* Clear */}
      {(filters.status.length ||
        filters.priority.length ||
        filters.assignee.length) > 0 && (
        <button
          onClick={clearFilters}
          className="ml-auto text-sm text-indigo-600 hover:underline"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default FilterBar;