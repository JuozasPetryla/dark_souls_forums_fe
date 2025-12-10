import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {api} from "../../api/apiClient.ts";

type Game = {
  id: number;
  name: string;
  hours_played: number;
};

export default function GameStats() {
  const { userId } = useParams();
  const isMyProfile = !userId;

  const [games, setGames] = useState<Game[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const endpoint = isMyProfile
        ? "profiles/profile/me/games"
        : `profiles/profile/${userId}/games`;

      try {
        const res = await api.get<Game[]>(endpoint);
        setGames(res);
      } catch (error) {
        setError("Nepavyko įkelti žaidimų statistikos.");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !games) {
    return (
      <div className="text-center mt-10 text-lg opacity-70">
        {error ?? "Nepavyko įkelti žaidimų statistikos."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-primary">
        Žaidimų statistika
      </h1>

      {games.length === 0 && (
        <p className="text-center opacity-60 mt-6">
          Žaidimai nerasti arba Steam paskyra nebuvo susieta.
        </p>
      )}

      <div className="grid gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="card bg-base-200 shadow-lg border border-base-300"
          >
            <div className="card-body">
              <h2 className="card-title text-lg sm:text-xl">{game.name}</h2>

              <div className="text-sm text-base-content/80">
                <p>
                  <strong>Laikas žaidime:</strong> {game.hours_played} val.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}