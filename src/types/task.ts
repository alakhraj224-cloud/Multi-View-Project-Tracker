export type Status = "todo" | "inprogress" | "inreview" | "done";
export type Priority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: Priority;
  status: Status;
  startDate?: string;
  dueDate: string;
}