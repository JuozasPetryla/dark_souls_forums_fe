import { Link } from "react-router-dom";
import { api } from "../api/apiClient";
import type { ThemeResponse } from "../types/Theme";
import { useEffect, useState } from "react";

export default function Home() {

  const [themes, setThemes] = useState<ThemeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    async function loadThemes() {
      try {
        const data = await api.get<ThemeResponse[]>("topics/read");
        setThemes(data);
      } catch (error) {
        console.error("Failed to fetch themes:", error);
      } finally {
        setLoading(false);
      }
    }

    loadThemes();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-10 px-4 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Temų sąrašas
        </h1>

        <Link to="/temos-kurimo-forma" className="btn btn-primary">
          ➕ Sukurti naują temą
        </Link>
      </div>

      <div className="space-y-6">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="card bg-base-100 shadow-md hover:shadow-lg transition p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h2 className="text-2xl font-semibold text-primary mb-2 sm:mb-0">
                {theme.title}
              </h2>
              <p className="text-sm text-base-content/60">
                {new Date(theme.modified_at).toLocaleDateString("lt-LT")}
              </p>
            </div>

            <p className="mt-2 text-base-content/80">{theme.description}</p>

            <div className="mt-4 flex flex-wrap justify-between items-center text-sm text-base-content/70">
              <p>Įrašų: 1</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              <Link to={`/irasai/${theme.id}`} className="btn btn-outline btn-sm">
                Peržiūrėti temą
              </Link>
              <Link
                to={`/temos-statistika/${theme.id}`}
                className="btn btn-outline btn-secondary btn-sm"
              >
                Temos statistika
              </Link>
              <Link to={`/temos-redagavimo-forma/${theme.id}`} className="btn btn-soft btn-primary btn-sm">
                Redaguoti temą
              </Link>
              <button className="btn btn-soft btn-secondary btn-sm">
                Šalinti temą
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
