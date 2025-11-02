import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-base-200 w-full">
      <div className="navbar bg-base-100 shadow-sm w-full max-w-7xl mx-auto px-10">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl font-bold whitespace-nowrap">
            Dark Souls Forums
          </Link>
        </div>

        <div className="flex justify-center flex-grow">
          <ul className="menu menu-horizontal px-1 flex-wrap">
            <li><Link to="/profilis">Profilis</Link></li>
            <li><Link to="/prisijungimas">Prisijungimas</Link></li>
            <li><Link to="/registracija">Registracija</Link></li>
          </ul>
        </div>
      </div>
      
    </div>
  );
}
