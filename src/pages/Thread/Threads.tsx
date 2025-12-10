import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";
import type { PostResponse } from "../../types/Post";
import type { ThemeResponse } from "../../types/Theme";

export default function Threads() {
  const { themeId } = useParams<{ themeId: string }>();
  const [theme, setTheme] = useState<ThemeResponse | null>(null);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const loadData = async () => {
      if (!themeId) return;

      setLoading(true);
      try {
        const [allPosts, topicData] = await Promise.all([
          api.get<PostResponse[]>("posts/read"),
          api.get<ThemeResponse>(`topics/read/${themeId}`)
        ]);

        setTheme(topicData);
        setPosts(allPosts.filter((post) => post.topic.id === Number(themeId)));
      } catch (error) {
        console.error("Nepavyko gauti įrašų:", error);
        setTheme(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [themeId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-error">Tema nerasta 😢</h2>
        <Link to="/" className="btn btn-primary mt-4">
          Atgal į pagrindinį puslapį
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-center sm:text-left">{theme.title}</h1>
        { token &&
          <Link to={`/irasai/${themeId}/naujas`} className="btn btn-primary">
            ➕ Sukurti naują įrašą
          </Link>
        }
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-base-content/70">
          Šiai temai dar nėra jokių įrašų.
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              to={`/irasai/${theme.id}/${post.id}`}
              key={post.id}
              className="block bg-base-100 shadow-md rounded-lg p-5 hover:bg-base-200 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-sm text-base-content/70">{post.author.nickname}</p>
                </div>
                <p className="text-sm text-base-content/60">
                  {new Date(post.modified_at || post.created_at).toLocaleDateString("lt-LT")}
                </p>
              </div>
              <p className="text-base-content/80 line-clamp-2">{post.summary || "Nėra santraukos"}</p>
              <div className="mt-2 text-sm text-base-content/60">
                Peržiūros: {post.view_count}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link to="/" className="btn btn-outline">
          ← Atgal į temų sąrašą
        </Link>
      </div>
    </div>
  );
}
