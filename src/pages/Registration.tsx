import { useState, type FormEvent } from "react";
import { api } from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import type { RegistrationResponse } from "../types/Auth";

export default function Registration() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      return setErrorMsg("Slaptažodžiai nesutampa ⚠️");
    }

    setLoading(true);

    try {
      const response = await api.post<RegistrationResponse>("/auth/register", {
        nickname,
        email,
        password
      });

      const token: string = response.access_token;

      localStorage.setItem("access_token", token);

      alert("Registracija sėkminga!");

      navigate("/profilis");

    } catch (err: any) {
      console.error("Registration failed:", err);

      if (err.response?.status === 409) {
        setErrorMsg("Vardas arba el. paštas jau užimti.");
      } else {
        setErrorMsg("Registracijos klaida. Bandykite dar kartą.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Registracija</h1>

        {errorMsg && (
          <div className="alert alert-error mb-4">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Slapyvardis</span>
            </label>
            <input
              type="text"
              placeholder="Įveskite slapyvardį"
              className="input input-bordered w-full"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">El. paštas</span>
            </label>
            <input
              type="email"
              placeholder="Įveskite el. paštą"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Slaptažodis</span>
            </label>
            <input
              type="password"
              placeholder="Įveskite slaptažodį"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Pakartokite slaptažodį</span>
            </label>
            <input
              type="password"
              placeholder="Pakartokite slaptažodį"
              className="input input-bordered w-full"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? "Registruojama..." : "Registruotis"}
          </button>

          <p className="text-center mt-3 text-sm">
            Jau turi paskyrą?{" "}
            <a href="/prisijungimas" className="link link-primary">
              Prisijunk čia
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
