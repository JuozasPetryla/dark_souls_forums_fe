import { Link, Outlet } from "react-router-dom";

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <h1 className="text-4xl font-bold text-center">Mano profilis</h1>

      <div className="bg-base-100 p-6 rounded-xl shadow-md text-left space-y-2">
        <p><strong>Vardas:</strong> Dark soulsas</p>
        <p><strong>El. paštas:</strong> dark@souls.com</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="megstami-irasai" className="btn btn-outline btn-primary">Pamegti irasai</Link>
        <Link to="naudotoju-sarasas" className="btn btn-outline btn-secondary">Susietu naudotoju sarasas</Link>
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}