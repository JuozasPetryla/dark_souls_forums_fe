import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
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
  steam_id: string | null;
};


export default function Profile() {
  const { userId } = useParams();
  const isMyProfile = !userId;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSteamModal, setShowSteamModal] = useState(false);
  const [steamInput, setSteamInput] = useState("");
  const [steamMode, setSteamMode] = useState<"input" | "success" | "error">("input");


  const navigate = useNavigate();

  const f = (v: string | null) => v ?? "-";

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleString("lt-LT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const load = async () => {
        setLoading(true);
        setError(null);

        const endpoint = isMyProfile
          ? "profiles/profile/me"
          : `profiles/profile/${userId}`;

        try {
          const res = await api.get<UserProfile>(endpoint);

          setProfile(res);
          setLoading(false);
        } catch (error) {
          setError("Nepavyko įkelti profilio.");
            setLoading(false);
        }
      };

      load();
  }, [userId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }


  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto mt-20 text-center text-lg opacity-70">
        Nepavyko įkelti profilio.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 space-y-10">

      {/* Title */}
      <h1 className="text-4xl font-bold text-center tracking-tight">
        {isMyProfile ? "Mano profilis" : `Naudotojo profilis: ${profile.nickname}`}
      </h1>

      {/* Profile card */}
      <div className="bg-base-100 p-8 rounded-2xl shadow-md border border-base-300 space-y-6">

        {/* Header section */}
        <div className="space-y-2">
          <div className="text-2xl font-semibold">{profile.nickname}</div>
          <div className="text-sm opacity-70">
            Paskutinį kartą prisijungė: {formatDate(profile.last_login_at)}
          </div>

          {profile.bio && (
            <p className="mt-2 leading-relaxed">
              <strong>Aprašymas:</strong> {profile.bio}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="divider text-sm">Asmeninė informacija</div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

          <p><strong>Vardas:</strong> {f(profile.name)}</p>
          <p><strong>Pavardė:</strong> {f(profile.surname)}</p>
          <p><strong>Šalis:</strong> {f(profile.origin_country)}</p>
          <p><strong>Miestas:</strong> {f(profile.city)}</p>

          <p><strong>Telefono nr.:</strong> {f(profile.phone_number)}</p>
          <p><strong>Discord:</strong> {f(profile.discord_id)}</p>
          <p><strong>Steam ID:</strong> {f(profile.steam_id)}</p>

          <p><strong>Klasė žaidime:</strong> {f(profile.playing_class)}</p>

          <p>
            <strong>Adresas:</strong>{" "}
            {`${f(profile.address)}, ${f(profile.city)}, ${f(profile.postal_code)}`}
          </p>

        </div>
      </div>

      {/* Navigation Buttons */}
      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-3">

        <Link to="mano-irasai" className="btn btn-outline btn-primary">Mano įrašai</Link>

        <Link to="megstami-irasai" className="btn btn-outline btn-primary">Pamėgti įrašai</Link>

        <Link to="draugu-pakvietimai" className="btn btn-outline btn-primary">
          Draugų pakvietimai
        </Link>

        <Link to="naudotoju-sarasas" className="btn btn-outline btn-secondary">
          Ryšių sąrašas
        </Link>

        <Link to="zaidimu-statistika" className="btn btn-outline btn-primary">
          Žaidimų statistika
        </Link>


        {isMyProfile && (
          <>
            <button className="btn btn-primary" onClick={() => setShowSteamModal(true)}>
              Susieti Steam paskyrą
            </button>

        <Link to="redaguoti" className="btn btn-soft btn-primary">
          Redaguoti
        </Link>

            <button className="btn btn-soft btn-error" onClick={() => setShowDeleteModal(true)}>
              Šalinti profilį
            </button>
          </>
        )}
      </div>

      {/* DELETE PROFILE MODAL */}
        {showDeleteModal && (
          <dialog open className="modal modal-open">
            <div className="modal-box space-y-6">

              <h3 className="text-2xl font-bold text-error">
                Ar tikrai norite ištrinti profilį?
              </h3>

              <p className="text-sm opacity-80 leading-relaxed">
                Šis veiksmas yra <strong>negrįžtamas</strong>. Visa paskyros informacija,
                veikla ir susieti duomenys bus visam laikui pašalinti.
              </p>

              {/* User info */}
              <div className="p-4 rounded-lg bg-base-200 text-sm space-y-1">
                <p><strong>Slapyvardis:</strong> {profile.nickname}</p>
                <p><strong>Paskutinį kartą prisijungė:</strong> {formatDate(profile.last_login_at)}</p>
              </div>

              <div className="modal-action flex justify-end gap-3">

                {/* Cancel */}
                <button
                  className="btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Atšaukti
                </button>

                {/* Confirm delete */}
                <button
                  className="btn btn-error"
                  onClick={async () => {

                    try {
                      await api.delete("/profiles/delete");
                      localStorage.removeItem("access_token");
                      navigate("/");
                    } catch (error) {
                      navigate(0);
                    }

                    setShowDeleteModal(false);
                  }}
                >
                  Taip, ištrinti
                </button>
              </div>
            </div>

            {/* Clicking outside closes modal */}
            <form
              method="dialog"
              className="modal-backdrop backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
          </dialog>
        )}

        {/* STEAM CONNECT MODAL */}
        {showSteamModal && (
          <dialog open className="modal modal-open">
            <div className="modal-box space-y-6">

              {/* Modal Title */}
              <h3 className="text-2xl font-bold">
                Susieti Steam paskyrą
              </h3>

              {/* INPUT MODE */}
              {steamMode === "input" && (
                <>
                  <p className="text-sm opacity-80">
                    Įveskite savo Steam ID.
                  </p>

                  <input
                    type="text"
                    placeholder="Pvz.: 76561198012345678"
                    className="input input-bordered w-full"
                    value={steamInput}
                    onChange={(e) => setSteamInput(e.target.value)}
                  />

                  <div className="modal-action flex justify-end gap-3">
                    {/* Cancel */}
                    <button
                      className="btn"
                      onClick={() => {
                        setShowSteamModal(false);
                        setSteamInput("");
                        setSteamMode("input");
                      }}
                    >
                      Atšaukti
                    </button>

                    {/* Submit */}
                    <button
                      className="btn btn-primary"
                      disabled={!steamInput.trim()}
                      onClick={async () => {
                        try {
                          api.post(
                            "/profiles/profile/steam/add",
                            steamInput,
                            { headers: { "Content-Type": "text/plain" } }
                          );
                          setSteamMode("success");
                          setProfile({ ...profile, steam_id: steamInput });
                        } catch (error) {
                          setSteamMode("error");
                        }

                        setSteamInput("");
                      }}
                    >
                      Susieti
                    </button>
                  </div>
                </>
              )}

              {/* SUCCESS MODE */}
              {steamMode === "success" && (
                <>
                  <div className="p-4 rounded-lg bg-green-200 text-green-900 font-medium">
                    Steam paskyra sėkmingai susieta!
                  </div>

                  <div className="modal-action justify-end">
                    <button
                      className="btn"
                      onClick={() => {
                        setShowSteamModal(false);
                        setSteamMode("input");
                      }}
                    >
                      Uždaryti
                    </button>
                  </div>
                </>
              )}

              {/* ERROR MODE */}
              {steamMode === "error" && (
                <>
                  <div className="p-4 rounded-lg bg-red-200 text-red-900 font-medium">
                    Klaida: nepavyko susieti Steam paskyros.
                  </div>

                  <div className="modal-action justify-end">
                    <button
                      className="btn"
                      onClick={() => {
                        setShowSteamModal(false);
                        setSteamMode("input");
                      }}
                    >
                      Uždaryti
                    </button>
                  </div>
                </>
              )}

            </div>

            {/* Outside click closes modal */}
            <form
              method="dialog"
              className="modal-backdrop backdrop-blur-sm"
              onClick={() => {
                setShowSteamModal(false);
                setSteamMode("input");
              }}
            />
          </dialog>
        )}

      <Outlet />
    </div>
  );
}
