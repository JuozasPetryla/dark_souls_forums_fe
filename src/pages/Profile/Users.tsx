import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

interface RelationResponse {
  id: number;
  user_a_id: number;
  user_b_id: number;
  type: "friend" | "blocked";
  status: "pending" | "accepted" | "declined";
  updated_at: string;
}

interface UserResponse {
  id: number;
  username: string;
  role: string;
  status?: string;
}

export default function RelatedUsers() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRelations() {
      try {
        const relations = await api.get<RelationResponse[]>("/user-relations/list");
        const relationList = relations;

        const detailedUsers: UserResponse[] = [];

        for (const rel of relationList) {
          const currentUserId = Number(localStorage.getItem("user_id"));

          const otherUserId =
            rel.user_a_id === currentUserId ? rel.user_b_id : rel.user_a_id;

          const userResponse = await api.get<UserResponse>(`/users/${otherUserId}`);
          detailedUsers.push(userResponse);
        }

        setUsers(detailedUsers);

      } catch (error) {
        console.error("Failed to load related users:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRelations();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center text-lg opacity-70">
        Susietų naudotojų nerasta.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">Susietų naudotojų sąrašas</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Vardas</th>
              <th>Rolė</th>
              <th>Statusas</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <th>{index + 1}</th>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={`badge ${
                      user.status === "online"
                        ? "badge-success"
                        : "badge-neutral"
                    }`}
                  >
                    {user.status === "online" ? "Prisijungęs" : "Atsijungęs"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
