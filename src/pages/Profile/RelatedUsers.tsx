import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

interface Relation {
  id: number;
  user_a_id: number;
  user_b_id: number;
  type: "friend" | "blocked";
  status: "accepted" | "pending" | "declined";
}

interface UserProfile {
  id: number;
  nickname: string;
  image: string | null;
}

export default function RelatedUsers() {
  const [relations, setRelations] = useState<Relation[]>([]);
  const [profiles, setProfiles] = useState<Record<number, UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const me = await api.get<{ id: number }>("/profiles/profile/me");
        setMyId(me.id);

        const rels = await api.get<Relation[]>("/user-relations/list");

        const list = rels.filter(
          (r) =>
            (r.type === "friend" && r.status === "accepted") ||
            r.type === "blocked"
        );

        setRelations(list);

        const profileMap: Record<number, UserProfile> = {};

        for (const rel of list) {
          const other =
            rel.user_a_id === me.id ? rel.user_b_id : rel.user_a_id;

          const user = await api.get<UserProfile>(`/profiles/profile/${other}`);
          profileMap[other] = user;
        }

        setProfiles(profileMap);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function removeRelation(id: number) {
    await api.delete(`/user-relations/${id}`);
    setRelations((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading || myId === null)
    return (
      <div className="text-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (relations.length === 0)
    return <div className="text-center mt-10 opacity-70">Ryšių nerasta.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">Susietų naudotojų sąrašas</h1>

      {relations.map((rel) => {
        const otherUserId = rel.user_a_id === myId ? rel.user_b_id : rel.user_a_id;
        const user = profiles[otherUserId];

        return (
          <div
            key={rel.id}
            className="flex items-center justify-between bg-base-200 p-4 rounded-xl"
          >
            <div className="flex items-center gap-4">
              {user?.image ? (
                <img src={user.image} className="w-14 h-14 rounded-xl object-cover" />
              ) : (
                <div className="w-14 h-14 bg-base-300 rounded-xl flex items-center justify-center">?</div>
              )}

              <div>
                <div className="font-semibold text-lg">{user?.nickname}</div>
                <div className="opacity-60">
                  {rel.type === "friend" ? "Draugas" : "Užblokuotas"}
                </div>
              </div>
            </div>

            <button
              className="btn btn-sm btn-error"
              onClick={() => removeRelation(rel.id)}
            >
              {rel.type === "friend" ? "Išmesti iš draugų" : "Atblokuoti"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
