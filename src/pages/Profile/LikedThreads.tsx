import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/apiClient";
import type { FavoritePost } from "../../types/Post";

export default function LikedThreads() {
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        const data = await api.get<FavoritePost[]>("posts/favorite");
        setFavorites(data);
      } catch (error) {
        console.error("Nepavyko gauti pamėgtų įrašų:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = async (postId: number) => {
    const confirmRemove = window.confirm("Ar tikrai norite pašalinti šį įrašą iš mėgstamų?");
    if (!confirmRemove) return;

    try {
      await api.delete(`posts/favorite/${postId}`);
      setFavorites(favorites.filter(fav => fav.post.id !== postId));
    } catch (error) {
      console.error("Nepavyko pašalinti iš mėgstamų:", error);
      alert("Klaida šalinant įrašą iš mėgstamų.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">Mėgstami įrašai</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-base-content/70">Dar neturi pamėgtų įrašų.</p>
      ) : (
        <div className="space-y-4">
          {favorites.map((fav) => (
            <div
              key={fav.favorite_id}
              className="p-4 bg-base-100 rounded-lg shadow hover:bg-base-200 transition"
            >
              <h2 className="text-xl font-semibold">{fav.post.title}</h2>
              <p className="text-sm text-base-content/70">
                Autorius: {fav.post.author.nickname} • Tema: {fav.post.topic.title}
              </p>
              <p className="text-sm text-base-content/60">
                Pridėta: {new Date(fav.added_at).toLocaleDateString("lt-LT")}
              </p>
              <div className="mt-3 flex gap-2">
                <Link 
                  to={`/irasai/${fav.post.topic.id}/${fav.post.id}`}
                  className="btn btn-outline btn-sm"
                >
                  Peržiūrėti
                </Link>
                <button
                  onClick={() => removeFavorite(fav.post.id)}
                  className="btn btn-soft btn-secondary btn-sm"
                >
                  Šalinti
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
