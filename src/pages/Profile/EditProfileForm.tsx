import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import callAPI from "../../utils/api";

type UserUpdateData = {
  nickname?: string | null;
  bio?: string | null;
  playing_class?: string | null;
  origin_country?: string | null;
  address?: string | null;
  city?: string | null;
  discord_id?: string | null;
  name?: string | null;
  surname?: string | null;
  postal_code?: string | null;
  phone_number?: string | null;
};

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserUpdateData>({});
  const [loading, setLoading] = useState(true);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch existing user data
  useEffect(() => {
    const loadProfile = async () => {
      const res = await callAPI("profiles/profile/me", true, { method: "GET" });

      if (res.statusCode === 200 && res.body) {
        const u = res.body;
        setFormData({
          nickname: u.nickname,
          bio: u.bio,
          playing_class: u.playing_class,
          origin_country: u.origin_country,
          address: u.address,
          city: u.city,
          discord_id: u.discord_id,
          name: u.name,
          surname: u.surname,
          postal_code: u.postal_code,
          phone_number: u.phone_number,
        });
      } else {
        setErrorMsg("Nepavyko įkelti profilio duomenų.");
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const res = await callAPI("profiles/profile/me", true, {
      method: "PATCH",
      body: formData,
    });

    if (res.statusCode === 200) {
      setSuccessMsg("Profilis sėkmingai atnaujintas.");
      navigate(0); // refresh page cleanly
    } else if (res.statusCode === 409) {
      setErrorMsg("Slapyvardis jau užimtas.");
    } else {
      setErrorMsg("Įvyko klaida atnaujinant profilį.");
    }
  };

  if (loading) {
    return (
      <div className="mt-10 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-base-100 p-8 rounded-2xl shadow-md mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Redaguoti profilį
      </h2>

      {successMsg && (
        <div className="alert alert-success mb-4">
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="alert alert-error mb-4">
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nickname */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Slapyvardis</span>
          </label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Name */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Vardas</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Surname */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Pavardė</span>
          </label>
          <input
            type="text"
            name="surname"
            value={formData.surname ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Aprašymas</span>
          </label>
          <textarea
            name="bio"
            value={formData.bio ?? ""}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Playing class */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Klasė žaidime</span>
          </label>
          <input
            type="text"
            name="playing_class"
            value={formData.playing_class ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* City */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Miestas</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Country */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Šalis</span>
          </label>
          <input
            type="text"
            name="origin_country"
            value={formData.origin_country ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Address */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Adresas</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Postal code */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Pašto kodas</span>
          </label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Phone number */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Telefono numeris</span>
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Discord */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Discord ID</span>
          </label>
          <input
            type="text"
            name="discord_id"
            value={formData.discord_id ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="btn btn-outline btn-secondary"
            onClick={() => navigate("/profilis/mano")}
          >
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