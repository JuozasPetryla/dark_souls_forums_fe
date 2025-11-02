import { Link } from "react-router-dom";

export default function Home() {
  const mockThemes = [
    {
      id: 1,
      title: "Kaip nugalėti Ornstein ir Smough?",
      author: "Solaire of Astora",
      date: "2025-10-20",
      posts: 2,
      description:
        "Taktikos ir patarimai, kaip išgyventi vieną sunkiausių kovų žaidime.",
    },
    {
      id: 2,
      title: "Geriausi ginklai pradedantiesiems",
      author: "Siegmeyer of Catarina",
      date: "2025-10-22",
      posts: 1,
      description: "Palyginame efektyviausius ginklus žaidimo pradžiai.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Temų sąrašas
        </h1>

        <Link to="/temos-forma" className="btn btn-primary">
          ➕ Sukurti naują temą
        </Link>
      </div>

      <div className="space-y-6">
        {mockThemes.map((theme) => (
          <div
            key={theme.id}
            className="card bg-base-100 shadow-md hover:shadow-lg transition p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h2 className="text-2xl font-semibold text-primary mb-2 sm:mb-0">
                {theme.title}
              </h2>
              <p className="text-sm text-base-content/60">
                {new Date(theme.date).toLocaleDateString("lt-LT")}
              </p>
            </div>

            <p className="mt-2 text-base-content/80">{theme.description}</p>

            <div className="mt-4 flex flex-wrap justify-between items-center text-sm text-base-content/70">
              <p>
                Autorius: <span className="font-medium">{theme.author}</span>
              </p>
              <p>Įrašų: {theme.posts}</p>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
