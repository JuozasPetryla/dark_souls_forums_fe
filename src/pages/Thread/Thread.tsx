import {useParams, Link, Outlet, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import CommentsSection from "./CommentsSection";
import { api } from "../../api/apiClient";
import type { PostDetail } from "../../types/Post";

interface CurrentUser {
  id: number;
  nickname: string;
}

export default function Thread() {
  const { themeId, postId } = useParams<{ themeId: string; postId: string }>();
  const [showComments, setShowComments] = useState(false);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      
      setLoading(true);
      try {
        const data = await api.get<PostDetail>(`posts/read/${postId}`);
        setPost(data);
      } catch (error) {
        console.error("Nepavyko gauti įrašo:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await api.get<CurrentUser>("auth/me");
        setCurrentUser(user);
      } catch (error) {
        console.error("Nepavyko gauti naudotojo:", error);
        setCurrentUser(null);
      }
    };

    loadCurrentUser();
  }, []);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!postId) return;

      setCheckingFavorite(true);
      try {
        const favorites = await api.get<any[]>("posts/favorite");
        const isFav = favorites.some(fav => fav.post.id === Number(postId));
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Nepavyko patikrinti mėgstamų:", error);
        setIsFavorite(false);
      } finally {
        setCheckingFavorite(false);
      }
    };

    checkIfFavorite();
  }, [postId]);

  const handleDelete = async () => {
    if (!postId || !post) return;

    const confirmDelete = window.confirm("Аr tikrai norite ištrinti šį įrašą? Šis veiksmas yra negrįžtamas.");
    if (!confirmDelete) return;

    try {
      await api.delete(`posts/delete/${postId}`);
      alert("Įrašas sėkmingai ištrintas.");
      navigate(`/irasai/${post.topic.id}`);
    } catch (error) {
      console.error("Nepavyko ištrinti įrašo:", error);
      alert("Klaida trinant įrašą.");
    }
  };

  const toggleFavorite = async () => {
    if (!postId) return;

    try {
      if (isFavorite) {
        await api.delete(`posts/favorite/${postId}`);
        setIsFavorite(false);
      } else {
        await api.post(`posts/favorite/${postId}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Nepavyko pakeisti mėgstamų:", error);
      alert("Klaida keičiant mėgstamus įrašus.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-error">Įrašas nerastas 😢</h2>
        <Link to={`/irasai/${themeId}`} className="btn btn-primary mt-4">
          Atgal į įrašus
        </Link>
      </div>
    );
  }

  return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-base-100 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-semibold text-xl">{post.title}</h2>
                <p className="text-sm text-base-content/60">{post.author.nickname}</p>
              </div>
              {currentUser && !checkingFavorite && (
                <button
                  onClick={toggleFavorite}
                  className="p-2 rounded-full hover:bg-base-200 transition-colors"
                  title={isFavorite ? "Pašalinti iš mėgstamų" : "Pridėti į mėgstamus"}
                  style={{ background: 'transparent' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isFavorite ? "#ef4444" : "transparent"}
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    className="w-7 h-7"
                    style={{ 
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="text-right text-sm text-base-content/60">
              <p>{new Date(post.modified_at || post.created_at).toLocaleDateString("lt-LT")}</p>
              <p>Peržiūros: {post.view_count}</p>
            </div>
          </div>

          <p className="text-base-content/80 leading-relaxed whitespace-pre-line">{post.content}</p>
        </div>

        {currentUser && currentUser.id === post.author.id && (
          <div className="mt-4 flex gap-2 justify-end">
            <Link
              to={`/irasai/${post.topic.id}/${postId}/redaguoti`}
              className="btn btn-soft btn-primary btn-sm"
            >
              Redaguoti įrašą
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-soft btn-secondary btn-sm"
            >
              Šalinti įrašą
            </button>
          </div>
        )}

        <div className="text-center mt-10 space-x-3">
          <Link to={`/irasai/${post.topic.id}`} className="btn btn-outline">
            ← Atgal į įrašus
          </Link>
          <Link to="/" className="btn btn-outline">
            Pagrindinis
          </Link>
          <button
        className="btn btn-soft btn-primary"
        onClick={() => setShowComments((prev) => !prev)}
      >
        {showComments ? "Slėpti komentarus" : "Rodyti komentarus"}
      </button>

      {showComments && (
        <div className="mt-6">
          <CommentsSection />
        </div>
      )}
        </div>

        <div className="mt-8">
          <Outlet/>
        </div>
      </div>
  );
}
