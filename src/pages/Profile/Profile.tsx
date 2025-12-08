import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

interface UserProfile {
  id: number;
  last_login_at: string;
  nickname: string;
  image: string | null;
  bio: string | null;
  playing_class: string | null;
  origin_country: string | null;
  address: string | null;
  city: string | null;
  discord_id: string | null;
  name: string | null;
  surname: string | null;
  postal_code: string | null;
  phone_number: string | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get<UserProfile>("/profiles/profile/me");
        setProfile(response);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function deleteProfile() {
    const confirmed = window.confirm("Ar tikrai norite ištrinti profilį? Tai neatstatoma.");
    if (!confirmed) return;

    try {
      await api.delete("/profile/delete");
      alert("Profilis ištrintas sėkmingai.");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete profile:", error);
      alert("Nepavyko ištrinti profilio.");
    }
  }

  async function connectSteam() {
    const steamId = prompt("Įveskite savo Steam ID:");

    if (!steamId) return;

    try {
      await api.post("/profile/steam/add", steamId);

      alert("Steam paskyra sėkmingai susieta!");
    } catch (error) {
      console.error("Failed to link Steam account:", error);
      alert("Nepavyko susieti Steam paskyros.");
    }
  }

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
        Nepavyko įkelti profilio.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <h1 className="text-4xl font-bold text-center">Mano profilis</h1>

      <div className="bg-base-100 p-6 rounded-xl shadow-md text-left space-y-4 flex flex-col sm:flex-row gap-6">

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

        <div className="flex-1 space-y-1">
          <p><strong>Slapyvardis:</strong> {profile.nickname}</p>

          {profile.name || profile.surname ? (
            <p><strong>Vardas:</strong> {profile.name} {profile.surname}</p>
          ) : null}

          <p><strong>Paskutinį kartą prisijungė:</strong> {new Date(profile.last_login_at).toLocaleString("lt-LT")}</p>

          {profile.bio && <p><strong>Aprašymas:</strong> {profile.bio}</p>}

          {profile.playing_class && (
            <p><strong>Klasė:</strong> {profile.playing_class}</p>
          )}
          {profile.origin_country && (
            <p><strong>Šalis:</strong> {profile.origin_country}</p>
          )}
          {profile.discord_id && (
            <p><strong>Discord:</strong> {profile.discord_id}</p>
          )}
          {profile.phone_number && (
            <p><strong>Telefono nr.:</strong> {profile.phone_number}</p>
          )}
          {(profile.address || profile.city || profile.postal_code) && (
            <p><strong>Adresas:</strong> {profile.address}, {profile.city}, {profile.postal_code}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="megstami-irasai" className="btn btn-outline btn-primary">
          Pamegti įrašai
        </Link>

        <Link to="naudotoju-sarasas" className="btn btn-outline btn-secondary">
          Susietų naudotojų sąrašas
        </Link>

        <button className="btn btn-primary" onClick={connectSteam}>
          Susieti Steam paskyrą
        </button>

        <Link to="zaidimu-statistika" className="btn btn-outline btn-primary">
          Žaidimų statistika
        </Link>

        <Link to="redaguoti" className="btn btn-soft btn-primary">
          Redaguoti
        </Link>

        <button className="btn btn-soft btn-secondary" onClick={deleteProfile}>
          Šalinti profilį
        </button>
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
