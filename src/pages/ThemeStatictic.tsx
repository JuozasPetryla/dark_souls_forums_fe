import { useParams, Link } from "react-router-dom";

export default function ThemeStatistic() {
  const { themeId } = useParams<{ themeId: string }>();

  const mockStats = [
    {
      themeId: 1,
      title: "Kaip nugalėti Ornstein ir Smough?",
      totalPosts: 12,
      mostActiveUser: "Solaire",
      avgReplies: 8.4,
      lastUpdated: "2025-11-02",
    },
    {
      themeId: 2,
      title: "Geriausi ginklai pradedantiesiems",
      totalPosts: 5,
      mostActiveUser: "Artorias",
      avgReplies: 3.2,
      lastUpdated: "2025-10-30",
    },
  ];

  const stat = mockStats.find((s) => s.themeId === Number(themeId));

  if (!stat) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-error">Temos statistika nerasta 😢</h2>
        <Link to="/" className="btn btn-primary mt-4">
          Atgal į pagrindinį puslapį
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {stat.title} – Temos statistika
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="stat bg-base-200 rounded-xl shadow p-4">
            <div className="stat-title text-sm text-base-content/70">
              Įrašų skaičius
            </div>
            <div className="stat-value text-primary">{stat.totalPosts}</div>
          </div>

          <div className="stat bg-base-200 rounded-xl shadow p-4">
            <div className="stat-title text-sm text-base-content/70">
              Vidutinis atsakymų skaičius
            </div>
            <div className="stat-value text-secondary">{stat.avgReplies}</div>
          </div>

          <div className="stat bg-base-200 rounded-xl shadow p-4 col-span-1 sm:col-span-2">
            <div className="stat-title text-sm text-base-content/70">
              Aktyviausias naudotojas
            </div>
            <div className="stat-value text-accent font-semibold">
              {stat.mostActiveUser}
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-base-content/60">
          Atnaujinta: {stat.lastUpdated}
        </p>

        <div className="text-center mt-8 space-x-3">
          <Link to="/" className="btn btn-outline">
            ← Atgal į pagrindinį
          </Link>
          <Link to={`/irasai/${themeId}`} className="btn btn-primary">
            Žiūrėti įrašus
          </Link>
        </div>
      </div>
    </div>
  );
}
