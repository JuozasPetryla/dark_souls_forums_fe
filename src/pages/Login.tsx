import { useState, type FormEvent } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login data:", { email, password });
    alert("Prisijungta (mock) ✅");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Prisijungimas</h1>

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

          <button type="submit" className="btn btn-primary w-full mt-4">
            Prisijungti
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
