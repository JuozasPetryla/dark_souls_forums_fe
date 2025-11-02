import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export function Themes() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

    alert("Tema sukurta");

    setTitle("");
    setDescription("");
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-base-100 shadow-md rounded-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Sukurti naują temą
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
            Sukurti temą
          </button>
        </div>
      </form>
    </div>
  );
}
