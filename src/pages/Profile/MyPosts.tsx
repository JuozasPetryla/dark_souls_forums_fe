import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/apiClient";
import type { PostResponse } from "../../types/Post";

interface CurrentUser {
  id: number;
  nickname: string;
}

export default function MyPosts() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyPosts = async () => {
      setLoading(true);
      try {
        const [allPosts, currentUser] = await Promise.all([
          api.get<PostResponse[]>("posts/read"),
          api.get<CurrentUser>("auth/me")
        ]);

        const myPosts = allPosts.filter(post => post.author.id === currentUser.id);
        setPosts(myPosts);
      } catch (error) {
        console.error("Nepavyko gauti įrašų:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadMyPosts();
  }, []);

  const deletePost = async (postId: number) => {
    const confirmDelete = window.confirm("Ar tikrai norite ištrinti šį įrašą? Šis veiksmas yra negrįžtamas.");
    if (!confirmDelete) return;

    try {
      await api.delete(`posts/delete/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Nepavyko ištrinti įrašo:", error);
      alert("Klaida trinant įrašą. Bandykite dar kartą.");
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
      <h1 className="text-3xl font-bold text-center">Mano įrašai</h1>

      {posts.length === 0 ? (
        <p className="text-center text-base-content/70">Dar neturite sukurtų įrašų.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-base-100 rounded-lg shadow hover:bg-base-200 transition"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-base-content/70">
                Tema: {post.topic.title} • Peržiūros: {post.view_count}
              </p>
              <p className="text-sm text-base-content/60">
                Sukurta: {new Date(post.created_at).toLocaleDateString("lt-LT")}
              </p>
              <div className="mt-3 flex gap-2">
                <Link 
                  to={`/irasai/${post.topic.id}/${post.id}`}
                  className="btn btn-outline btn-sm"
                >
                  Peržiūrėti
                </Link>
                <button
                  onClick={() => deletePost(post.id)}
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
