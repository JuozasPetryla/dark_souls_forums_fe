import { useState, type FormEvent } from "react";
import { api } from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import type { LoginResponse } from "../types/Auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const token: string = response.access_token;

      localStorage.setItem("access_token", token);

      alert("Prisijungta sėkmingai!");
      navigate("/profilis/mano");

    } catch (err: any) {
      console.error("Login failed:", err);

      if (err.response?.status === 401) {
        setErrorMsg("Neteisingi prisijungimo duomenys.");
      } else {
        setErrorMsg("Įvyko klaida jungiantis. Bandykite dar kartą.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Prisijungimas</h1>

        {errorMsg && (
          <div className="alert alert-error mb-4">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? "Jungiama..." : "Prisijungti"}
          </button>

          <p className="text-center mt-3 text-sm">
            Neturi paskyros?{" "}
            <a href="/registracija" className="link link-primary">
              Registruokis čia
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
