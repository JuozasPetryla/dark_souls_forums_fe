import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/apiClient";
import type { ThemeRequest, ThemeResponse } from "../types/Theme";

export function EditThemeForm() {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response: ThemeResponse = await api.get(`/topics/read/${themeId}`);
        const topic = response;

        setTitle(topic.title);
        setDescription("");
        setPreview(null);
      } catch (error) {
        console.error("Failed to fetch topic:", error);
        alert("Nepavyko gauti temos duomenų.");
      }
    };

    if (themeId) fetchTopic();
  }, [themeId]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updatedTopic = await api.put<ThemeRequest>(
        `/topics/update/${themeId}`,
        {
          title,
          image_link: ""
        }
      );

      console.log("Updated topic:", updatedTopic);

      alert("Tema buvo redaguota");
      navigate("/");
    } catch (error) {
      console.error("Failed to update topic:", error);
      alert("Klaida redaguojant temą. Patikrinkite duomenis.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-base-100 shadow-md rounded-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Redaguoti temą</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">
            <span className="label-text font-semibold">Temos pavadinimas</span>
          </label>
          <input
            type="text"
            placeholder="Įveskite temos pavadinimą"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Temos aprašymas</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full min-h-[120px]"
            placeholder="Įveskite temos aprašymą"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Temos nuotrauka</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleImageChange}
          />
          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg max-h-60 object-contain border border-base-300"
              />
            </div>
          )}
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Redaguoti temą
          </button>
        </div>
      </form>
    </div>
  );
}
