import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTaskStore } from "../store/useTaskStore";

export function useSyncFiltersWithURL() {
  const [params, setParams] = useSearchParams();
  const setFilters = useTaskStore((s) => s.setFilters);
  const filters = useTaskStore((s) => s.filters);

  // Load from URL
  useEffect(() => {
    const status = params.get("status")?.split(",") || [];
    const priority = params.get("priority")?.split(",") || [];
    const assignee = params.get("assignee")?.split(",") || [];
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    setFilters({
      status: status as any,
      priority: priority as any,
      assignee,
      dueDateFrom: from,
      dueDateTo: to,
    });
  }, []);

  // Update URL
  useEffect(() => {
    const newParams: any = {};

    if (filters.status.length) newParams.status = filters.status.join(",");
    if (filters.priority.length) newParams.priority = filters.priority.join(",");
    if (filters.assignee.length) newParams.assignee = filters.assignee.join(",");
    if (filters.dueDateFrom) newParams.from = filters.dueDateFrom;
    if (filters.dueDateTo) newParams.to = filters.dueDateTo;

    setParams(newParams);
  }, [filters]);
}