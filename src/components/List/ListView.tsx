import { useRef, useState, useCallback, useEffect } from "react";
import { useTaskStore, getFilteredSortedTasks } from "../../store/useTaskStore";
import type { SortField } from "../../store/useTaskStore";
import ListRow from "./ListRow";

const ROW_HEIGHT = 48;
const BUFFER = 5;

function ListView() {
  const allState = useTaskStore((s) => s);
  const tasks = getFilteredSortedTasks(allState);

  const sortField = useTaskStore((s) => s.sortField);
  const sortDir = useTaskStore((s) => s.sortDir);
  const setSort = useTaskStore((s) => s.setSort);

  const containerRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  // ✅ Measure container height dynamically
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateHeight = () => {
      setContainerHeight(el.clientHeight);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // ✅ Optimized scroll handler (no excessive re-renders)
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          setScrollTop(containerRef.current.scrollTop);
        }
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  const totalHeight = tasks.length * ROW_HEIGHT;

  const shouldVirtualize = totalHeight > containerHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const visibleCount =
    Math.ceil(containerHeight / ROW_HEIGHT) + BUFFER * 3;

  const endIndex = Math.min(tasks.length, startIndex + visibleCount);

  const visibleTasks = shouldVirtualize
    ? tasks.slice(startIndex, endIndex)
    : tasks;

  const offsetY = shouldVirtualize ? startIndex * ROW_HEIGHT : 0;

  const SortHeader = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => {
    const active = sortField === field;

    return (
      <th
        onClick={() => setSort(field)}
        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-1">
          {label}
          <span
            className={`transition-opacity ${
              active ? "opacity-100" : "opacity-30"
            }`}
          >
            {active && sortDir === "asc" ? "↑" : "↓"}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="px-4">
      {/* Table Container */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortHeader field="title" label="Title" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-36">
                Assignee
              </th>
              <SortHeader field="priority" label="Priority" />
              <SortHeader field="dueDate" label="Due Date" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-36">
                Status
              </th>
            </tr>
          </thead>
        </table>

        {/* Scrollable Body */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="overflow-y-auto"
          style={{ height: "60vh" }} // ✅ fixed viewport-based height
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <div className="text-4xl mb-2">🔍</div>
              <p className="font-medium">No tasks match your filters</p>
              <button
                onClick={() => useTaskStore.getState().clearFilters()}
                className="mt-3 text-sm text-indigo-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : !shouldVirtualize ? (
            // ✅ Small dataset (no virtualization)
            <table className="w-full table-fixed">
              <tbody>
                {tasks.map((task) => (
                  <ListRow key={task.id} task={task} />
                ))}
              </tbody>
            </table>
          ) : (
            // ✅ Virtualized rendering
            <div
              style={{
                height: totalHeight,
                position: "relative",
                willChange: "transform",
              }}
            >
              <table
                className="w-full table-fixed"
                style={{
                  position: "absolute",
                  top: offsetY,
                  left: 0,
                  right: 0,
                }}
              >
                <tbody>
                  {visibleTasks.map((task) => (
                    <ListRow key={task.id} task={task} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-2 text-right">
        Showing {tasks.length} task{tasks.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default ListView;