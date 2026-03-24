import { useTaskStore } from "../../store/useTaskStore";
import PresenceAvatar from "./PresenceAvatar";

function PresenceBar() {
  const users = useTaskStore((s) => s.collabUsers);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b">
      <div className="flex -space-x-2">
        {users.map((u) => (
          <PresenceAvatar key={u.id} user={u} />
        ))}
      </div>

      <p className="text-sm text-gray-600">
        {users.length} people are viewing this board
      </p>
    </div>
  );
}

export default PresenceBar;