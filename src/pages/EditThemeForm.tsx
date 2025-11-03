import { useState, useMemo } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {useParams, useNavigate} from "react-router-dom";

const mockThemes = [
    {
      id: 1,
      title: "Kaip nugalėti Ornstein ir Smough?",
      author: "Solaire of Astora",
      date: "2025-10-20",
      posts: 2,
      description:
        "Taktikos ir patarimai, kaip išgyventi vieną sunkiausių kovų žaidime.",
    },
    {
      id: 2,
      title: "Geriausi ginklai pradedantiesiems",
      author: "Siegmeyer of Catarina",
      date: "2025-10-22",
      posts: 1,
      description: "Palyginame efektyviausius ginklus žaidimo pradžiai.",
    },
  ];

export function EditThemeForm() {
  const { themeId } = useParams<{ themeId: string }>();
  const selectedTheme = useMemo(
    () => mockThemes.find((t) => t.id === Number(themeId)),
    [themeId]
  );

  const [title, setTitle] = useState<string>(selectedTheme?.title ?? "");
  const [description, setDescription] = useState<string>(selectedTheme?.description ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate()

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      title,
      description,
      imageName: image?.name || "no image",
    });

    alert("Tema buvo redaguota");

    setTitle("");
    setDescription("");
    setImage(null);
    setPreview(null);
    navigate("/")
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-base-100 shadow-md rounded-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Redaguoti temą
      </h1>

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
            required
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
