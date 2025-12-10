import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/apiClient";
import type { PostDetail } from "../../types/Post";
import { GenerateSummaryButton } from "../../components/GenerateSummaryButton";

export function EditPostForm() {
  const { themeId, postId } = useParams<{ themeId: string; postId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: number } | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      setLoading(true);
      try {
        const [post, user] = await Promise.all([
          api.get<PostDetail>(`posts/read/${postId}`),
          api.get<{ id: number }>("auth/me")
        ]);
        setTitle(post.title);
        setContent(post.content);
        setSummary(post.summary || "");
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        alert("Nepavyko gauti įrašo duomenų.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!postId) return;

    try {
      await api.put(`posts/update/${postId}`, {
        title,
        content,
        summary: summary || null
      });

      console.log("Updated post");
      navigate(`/irasai/${themeId}/${postId}`);

    } catch (error) {
      console.error("Failed to update post:", error);
      alert("Klaida redaguojant įrašą. Patikrinkite duomenis.");
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
    <div className="max-w-3xl mx-auto mt-10 bg-base-100 shadow-md rounded-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Redaguoti įrašą</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">
            <span className="label-text font-semibold">Įrašo pavadinimas</span>
          </label>
          <input
            type="text"
            placeholder="Įveskite įrašo pavadinimą"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Santrauka (neprivaloma)</span>
          </label>
          {currentUser && (
            <div className="mb-3">
              <GenerateSummaryButton
                postId={Number(postId)}
                currentSummary={summary || null}
                isAuthor={true}
                onSummaryGenerated={(newSummary) => setSummary(newSummary)}
              />
            </div>
          )}
          <input
            type="text"
            placeholder="Trumpa įrašo santrauka"
            className="input input-bordered w-full"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Turinys</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full min-h-[200px]"
            placeholder="Įveskite įrašo turinį"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="text-center flex gap-3 justify-center">
          <button type="submit" className="btn btn-primary">
            Išsaugoti pakeitimus
          </button>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => navigate(`/irasai/${themeId}/${postId}`)}
          >
            Atšaukti
          </button>
        </div>
      </form>
    </div>
  );
}
