import type { Task } from "../types/task";

const users = ["AJ", "RK", "SP", "MK", "TS", "VR"];
const priorities = ["low", "medium", "high", "critical"] as const;
const statuses = ["todo", "inprogress", "inreview", "done"] as const;

const adjectives = ["Fix", "Build", "Update", "Review", "Refactor", "Test", "Deploy", "Migrate", "Document", "Audit"];
const nouns = ["login page", "API endpoint", "dashboard", "database", "auth flow", "UI components", "test suite", "CI pipeline", "error handler", "cache layer"];

export function generateTasks(count = 500): Task[] {
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const due = new Date();
    due.setDate(due.getDate() + Math.floor(Math.random() * 30) - 10);

    const hasStart = Math.random() > 0.3;
    const start = hasStart
      ? new Date(due.getTime() - Math.random() * 7 * 86400000)
      : undefined;

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    tasks.push({
      id: `task-${i}`,
      title: `${adj} ${noun} #${i}`,
      assignee: users[Math.floor(Math.random() * users.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      startDate: start?.toISOString(),
      dueDate: due.toISOString(),
    });
  }

  return tasks;
}