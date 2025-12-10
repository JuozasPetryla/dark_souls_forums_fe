import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/apiClient";
import type { ThemeRequest } from "../types/Theme";
import type { AuthUser } from "../types/Auth";

export function CreateThemeForm() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const token = localStorage.getItem("access_token");

  type UploadImageResponse = {
    url: string;
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    const fetchCurrentUser = async () => {
      //const token = localStorage.getItem("JWT");
      try {
        const res = await api.get<AuthUser>("auth/me");
        // console.log("USER RESPONSE:", res.role);
        setCurrentUserRole(res.role);
        // console.log("CURRENT USER ROLE:", res.role)
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };

    fetchCurrentUser();
  }, [token]);

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
      let imageUrl = "";

      // 1. Upload image if user selected one
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadRes = await api.post<UploadImageResponse>("/topics/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        imageUrl = uploadRes.url; // backend returns the URL
      }

      // 2. Create topic using the returned image URL
      const createdTopic = await api.post<ThemeRequest>("/topics/create", {
        title,
        description,
        image_link: imageUrl
      });

      console.log("Created topic:", createdTopic);

      setTitle("");
      setDescription("");
      setImage(null);
      setPreview(null);
      navigate("/");

    } catch (error) {
      console.error("Failed to create topic:", error);
      alert("Klaida kuriant temą. Patikrinkite duomenis.");
    }
  };

  if (currentUserRole !== "admin") {
    return (
      <div className="max-w-3xl mx-auto mt-10 bg-base-100 shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Prieiga uždrausta</h1>
        <p className="text-center">Atsiprašome, bet tik administratoriai gali kurti temas.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-base-100 shadow-md rounded-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Sukurti naują temą</h1>

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
            required
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
            Sukurti temą
          </button>
        </div>
      </form>
    </div>
  );
}
