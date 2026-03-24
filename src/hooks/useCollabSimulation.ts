import { useEffect } from "react";
import { useTaskStore } from "../store/useTaskStore";

export function useCollabSimulation() {
  const tasks = useTaskStore((s) => s.tasks);
  const collabUsers = useTaskStore((s) => s.collabUsers);
  const updateUser = useTaskStore((s) => s.updateCollabUser);

  useEffect(() => {
    const interval = setInterval(() => {
      collabUsers.forEach((user) => {
        const randomTask =
          tasks[Math.floor(Math.random() * tasks.length)];

        updateUser(user.id, randomTask.id);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [tasks, collabUsers]);
}