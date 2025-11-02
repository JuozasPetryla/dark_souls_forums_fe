import { useState, type FormEvent } from "react";

export default function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Slaptažodžiai nesutampa ⚠️");
      return;
    }

    console.log("Registration data:", { username, email, password });
    alert("Registracija sėkminga (mock) 🎉");

    setUsername("");
    setEmail("");
    setPassword("");
    setConfirm("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Registracija</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Vartotojo vardas</span>
            </label>
            <input
              type="text"
              placeholder="Įveskite vardą"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          <button type="submit" className="btn btn-primary w-full mt-4">
            Registruotis
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
