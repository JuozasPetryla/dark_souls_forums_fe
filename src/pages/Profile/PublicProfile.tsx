import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/apiClient";

interface PublicUserProfile {
  id: number;
  nickname: string;
  image: string | null;
  bio: string | null;
  playing_class: string | null;
}

interface RelationStatus {
  relation_exists: boolean;
  id?: number;
  type?: "friend" | "blocked";
  status?: "accepted" | "pending" | "declined";
  initiator?: "me" | "other";
}


export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [relation, setRelation] = useState<RelationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function checkSelf() {
      try {
        const me = await api.get<{ id: number }>("/profiles/profile/me");

        if (id && Number(id) === me.id) {
          navigate("/profilis", { replace: true });
        }
      } catch (err) {
        console.error("Failed to load self", err);
      }
    }

    checkSelf();
  }, [id, navigate]);

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await api.get<PublicUserProfile>(`/profiles/profile/${id}`);
        setProfile(userRes);

        const relationRes = await api.get<RelationStatus>(`/user-relations/status/${id}`);
        setRelation(relationRes);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // ---- API Actions ----

  async function sendFriendRequest() {
    setSending(true);
    try {
      await api.post("/user-relations/create", {
        user_b_id: Number(id),
        type: "friend",
      });
      alert("Pakvietimas išsiųstas!");
      refreshRelation();
    } catch (error: any) {
      alert(error?.response?.data?.detail || "Nepavyko.");
    } finally {
      setSending(false);
    }
  }

  async function acceptRequest() {
    if (!relation) return;
    setSending(true);
    try {
      await api.post(`/user-relations/${relation.id}/accept`);
      refreshRelation();
    } catch {
      alert("Nepavyko priimti.");
    } finally {
      setSending(false);
    }
  }

  async function declineRequest() {
    if (!relation) return;
    setSending(true);
    try {
      await api.post(`/user-relations/${relation.id}/decline`);
      refreshRelation();
    } catch {
      alert("Nepavyko atmesti.");
    } finally {
      setSending(false);
    }
  }

  async function blockUser() {
    setSending(true);
    try {
      await api.post(`/user-relations/${id}/block`);
      alert("Vartotojas užblokuotas.");
      refreshRelation();
    } catch {
      alert("Nepavyko užblokuoti.");
    } finally {
      setSending(false);
    }
  }

  async function unblockUser() {
    if (!relation) return;
    setSending(true);
    try {
      await api.delete(`/user-relations/${relation.id}`);
      alert("Vartotojas atblokuotas.");
      refreshRelation();
    } catch {
      alert("Nepavyko atblokuoti.");
    } finally {
      setSending(false);
    }
  }

  async function removeFriend() {
    if (!relation) return;
    setSending(true);
    try {
      await api.delete(`/user-relations/${relation.id}`);
      alert("Pašalintas iš draugų.");
      refreshRelation();
    } catch {
      alert("Nepavyko pašalinti.");
    } finally {
      setSending(false);
    }
  }

  // Reload status after action
  async function refreshRelation() {
    const res = await api.get<RelationStatus>(`/user-relations/status/${id}`);
    setRelation(res);
  }

  // ---- UI Logic ----

  function renderRelationActions() {
    if (!relation || !relation.relation_exists) {
      return (
        <>
          <button
            onClick={sendFriendRequest}
            disabled={sending}
            className="btn btn-primary"
          >
            Pakviesti į draugus
          </button>

          <button
            onClick={blockUser}
            disabled={sending}
            className="btn btn-error ml-3"
          >
            Blokuoti vartotoją
          </button>
        </>
      );
    }

    // BLOCKED
    if (relation.type === "blocked") {
      return (
        <button onClick={unblockUser} className="btn btn-warning">
          Atblokuoti
        </button>
      );
    }

    // FRIEND Accepted
    if (relation.type === "friend" && relation.status === "accepted") {
      return (
        <button onClick={removeFriend} className="btn btn-error">
          Pašalinti iš draugų
        </button>
      );
    }

    // FRIEND Pending (I SENT)
    if (relation.type === "friend" && relation.status === "pending" && relation.initiator === "me") {
      return (
        <p className="text-sm opacity-70">
          Kvietimas išsiųstas...
        </p>
      );
    }

    // FRIEND Pending (OTHER SENT)
    if (relation.type === "friend" && relation.status === "pending" && relation.initiator === "other") {
      return (
        <>
          <button onClick={acceptRequest} className="btn btn-primary">
            Priimti
          </button>
          <button onClick={declineRequest} className="btn btn-error ml-3">
            Atmesti
          </button>
        </>
      );
    }

    return null;
  }

  // ---- Render ----

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center text-lg opacity-70">
        Vartotojas nerastas.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-base-100 p-6 rounded-xl shadow-md text-left space-y-4">

        {profile.image ? (
          <img
            src={profile.image}
            alt="avatar"
            className="w-32 h-32 object-cover rounded-xl border border-base-300"
          />
        ) : (
          <div className="w-32 h-32 rounded-xl bg-base-200 flex items-center justify-center text-3xl">
            ?
          </div>
        )}

        <h1 className="text-3xl font-bold">{profile.nickname}</h1>

        {profile.bio && <p><strong>Aprašymas:</strong> {profile.bio}</p>}
        {profile.playing_class && <p><strong>Klasė:</strong> {profile.playing_class}</p>}

        <div className="mt-4 flex gap-3">
          {renderRelationActions()}
        </div>
      </div>
    </div>
  );
}
