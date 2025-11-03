import {type ChangeEvent, type FormEvent, useState} from "react";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "Dark soulsas",
    email: "dark@souls.com",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-base-100 p-8 rounded-2xl shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Redaguoti profilį
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text font-medium">Vardas</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Įveskite vardą"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">El. paštas</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Įveskite el. paštą"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" className="btn btn-outline btn-secondary">
            Atšaukti
          </button>
          <button type="submit" className="btn btn-primary">
            Išsaugoti pakeitimus
          </button>
        </div>
      </form>
    </div>
  );
}