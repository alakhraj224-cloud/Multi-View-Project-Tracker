import type { CollabUser } from "../../store/useTaskStore";

function PresenceAvatar({ user }: { user: CollabUser }) {
  return (
    <div
      className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center border-2 border-white"
      style={{ backgroundColor: user.color }}
    >
      {user.initials}
    </div>
  );
}

export default PresenceAvatar;