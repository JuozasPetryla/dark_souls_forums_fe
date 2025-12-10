import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/apiClient";

export function CreatePostForm() {
  const { themeId } = useParams<{ themeId: string }>();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [summary, setSummary] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!themeId) {
      alert("Tema nerasta.");
      return;
    }

    try {
      const response = await api.post("/posts/create", {
        title,
        content,
        summary: summary || null,
        topic_id: Number(themeId)
      });

      console.log("Created post:", response);

      setTitle("");
      setContent("");
      setSummary("");
      navigate(`/irasai/${themeId}`);

    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Klaida kuriant įrašą. Patikrinkite duomenis.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-base-100 shadow-md rounded-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Sukurti naują įrašą</h1>

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
            Sukurti įrašą
          </button>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => navigate(`/irasai/${themeId}`)}
          >
            Atšaukti
          </button>
        </div>
      </form>
    </div>
  );
}
