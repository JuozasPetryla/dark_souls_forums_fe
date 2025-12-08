import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setLoggedIn(!!token);
  }, [location]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    }

    localStorage.removeItem("access_token");
    delete api.defaults?.headers?.common?.Authorization;

    setLoggedIn(false);

    navigate("/prisijungimas");
  };

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
            {loggedIn && (
              <>
                <li><Link to="/profilis">Profilis</Link></li>
                <li><button onClick={handleLogout} className="btn btn-ghost">Atsijungti</button></li>
              </>
            )}

            {!loggedIn && (
              <>
                <li><Link to="/prisijungimas">Prisijungimas</Link></li>
                <li><Link to="/registracija">Registracija</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
