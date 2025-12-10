import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

interface Relation {
  id: number;
  user_a_id: number;
  user_b_id: number;
  type: "friend";
  status: "pending";
}

interface UserProfile {
  id: number;
  nickname: string;
  image: string | null;
}

export default function PendingInvites() {
  const [invites, setInvites] = useState<Relation[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<number, UserProfile>>({});
  const [loading, setLoading] = useState(true);

  const [myId, setMyId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const me = await api.get<UserProfile>("/profiles/profile/me");
        setMyId(me.id);

        const relations = await api.get<Relation[]>("/user-relations/list");

        const pending = relations.filter(
          (r) =>
            r.type === "friend" &&
            r.status === "pending" &&
            r.user_b_id === me.id
        );

        setInvites(pending);

        const profiles: Record<number, UserProfile> = {};

        for (const r of pending) {
          const profile = await api.get<UserProfile>(`/profiles/profile/${r.user_a_id}`);
          profiles[r.user_a_id] = profile;
        }

        setUserProfiles(profiles);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function accept(id: number) {
    await api.post(`/user-relations/${id}/accept`);
    setInvites((prev) => prev.filter((i) => i.id !== id));
  }

  async function decline(id: number) {
    await api.post(`/user-relations/${id}/decline`);
    setInvites((prev) => prev.filter((i) => i.id !== id));
  }

  if (loading || myId === null)
    return (
      <div className="text-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (invites.length === 0)
    return <div className="text-center mt-10 opacity-70">Nėra pakvietimų.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <h1 className="text-3xl font-bold text-center">Draugų pakvietimai</h1>

      {invites.map((invite) => {
        const user = userProfiles[invite.user_a_id];

        return (
          <div
            key={invite.id}
            className="bg-base-200 p-4 rounded-xl flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              {user?.image ? (
                <img
                  src={user.image}
                  className="w-14 h-14 rounded-xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 bg-base-300 rounded-xl flex items-center justify-center">
                  ?
                </div>
              )}

              <span className="font-semibold text-lg">{user?.nickname}</span>
            </div>

            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => accept(invite.id)}
              >
                Priimti
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => decline(invite.id)}
              >
                Atmesti
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
