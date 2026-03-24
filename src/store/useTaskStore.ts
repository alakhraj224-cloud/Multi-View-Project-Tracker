import { create } from "zustand";
import type { Task, Status, Priority } from "../types/task";
import { generateTasks } from "../data/generateTasks";

export type SortField = "title" | "priority" | "dueDate";
export type SortDir = "asc" | "desc";

export interface CollabUser {
  id: string;
  initials: string;
  color: string;
  activeTaskId: string | null;
}

export interface Filters {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dueDateFrom: string;
  dueDateTo: string;
}

interface TaskState {
  tasks: Task[];

  draggingTaskId: string | null;
  dragPosition: { x: number; y: number } | null;
  dragOriginStatus: Status | null;

  sortField: SortField;
  sortDir: SortDir;

  filters: Filters;

  collabUsers: CollabUser[];

  setDraggingTask: (id: string | null) => void;
  setDragPosition: (pos: { x: number; y: number } | null) => void;
  setDragOriginStatus: (status: Status | null) => void;

  updateTask: (id: string, updates: Partial<Task>) => void;

  setSort: (field: SortField) => void;

  setFilters: (f: Partial<Filters>) => void;
  clearFilters: () => void;

  setCollabUsers: (users: CollabUser[]) => void;
  updateCollabUser: (id: string, taskId: string | null) => void;
}

const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const getDefaultFilters = (): Filters => ({
  status: [],
  priority: [],
  assignee: [],
  dueDateFrom: "",
  dueDateTo: "",
});

const collabColors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444"];
const collabInitials = ["JD", "KL", "NP", "ZW"];

const initialTasks = generateTasks(500);

const initialCollabUsers: CollabUser[] = collabInitials.map((initials, i) => ({
  id: `collab-${i}`,
  initials,
  color: collabColors[i],
  activeTaskId: initialTasks[Math.floor(Math.random() * 20)].id,
}));

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,

  draggingTaskId: null,
  dragPosition: null,
  dragOriginStatus: null,

  sortField: "dueDate",
  sortDir: "asc",

  filters: getDefaultFilters(),

  collabUsers: initialCollabUsers,

  setDraggingTask: (id) => set({ draggingTaskId: id }),
  setDragPosition: (pos) => set({ dragPosition: pos }),
  setDragOriginStatus: (status) => set({ dragOriginStatus: status }),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  setSort: (field) =>
    set((state) => ({
      sortField: field,
      sortDir:
        state.sortField === field && state.sortDir === "asc"
          ? "desc"
          : "asc",
    })),

  setFilters: (f) =>
    set((state) => ({
      filters: { ...state.filters, ...f },
    })),

  clearFilters: () =>
    set({
      filters: getDefaultFilters(), // ✅ fresh object
    }),

  setCollabUsers: (users) => set({ collabUsers: users }),

  updateCollabUser: (id, taskId) =>
    set((state) => ({
      collabUsers: state.collabUsers.map((u) =>
        u.id === id ? { ...u, activeTaskId: taskId } : u
      ),
    })),
}));

// ✅ Filter + Sort helper (safe + clean)
export function getFilteredSortedTasks(state: TaskState): Task[] {
  const { tasks, filters, sortField, sortDir } = state;

  let result = tasks.filter((t) => {
    if (filters.status.length && !filters.status.includes(t.status)) return false;
    if (filters.priority.length && !filters.priority.includes(t.priority)) return false;
    if (filters.assignee.length && !filters.assignee.includes(t.assignee)) return false;

    if (filters.dueDateFrom && new Date(t.dueDate) < new Date(filters.dueDateFrom))
      return false;

    if (filters.dueDateTo && new Date(t.dueDate) > new Date(filters.dueDateTo))
      return false;

    return true;
  });

  result.sort((a, b) => {
    let cmp = 0;

    if (sortField === "title") {
      cmp = a.title.localeCompare(b.title);
    } else if (sortField === "priority") {
      cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    } else if (sortField === "dueDate") {
      cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    return sortDir === "asc" ? cmp : -cmp;
  });

  return result;
}