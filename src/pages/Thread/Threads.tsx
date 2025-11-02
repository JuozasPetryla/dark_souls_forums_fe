import { useParams, Link } from "react-router-dom";

export default function Threads() {
  const { themeId } = useParams<{ themeId: string }>();

  const mockThemes = [
    { id: 1, title: "Kaip nugalėti Ornstein ir Smough?" },
    { id: 2, title: "Geriausi ginklai pradedantiesiems" },
  ];

  const mockPosts = [
    {
      id: 1,
      themeId: 1,
      author: "Solaire",
      date: "2025-10-22",
      content: "Patariu laikytis arti Ornstein ir naudoti riedėjimą į vidų.",
    },
    {
      id: 2,
      themeId: 1,
      author: "Gwyn",
      date: "2025-10-23",
      content: "Naudoju magiją ir laikau juos atokiau. Veikia puikiai!",
    },
    {
      id: 3,
      themeId: 2,
      author: "Artorias",
      date: "2025-10-25",
      content: "Claymore ir Uchigatana puikūs ginklai žaidimo pradžiai.",
    },
  ];

  const theme = mockThemes.find((t) => t.id === Number(themeId));
  const posts = mockPosts.filter((p) => p.themeId === Number(themeId));

  if (!theme) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-error">Tema nerasta 😢</h2>
        <Link to="/" className="btn btn-primary mt-4">
          Atgal į pagrindinį puslapį
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">{theme.title}</h1>

      {posts.length === 0 ? (
        <p className="text-center text-base-content/70">
          Šiai temai dar nėra jokių įrašų.
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              to={`/irasai/${theme.id}/${post.id}`}
              key={post.id}
              className="block bg-base-100 shadow-md rounded-lg p-5 hover:bg-base-200 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">{post.author}</p>
                <p className="text-sm text-base-content/60">
                  {new Date(post.date).toLocaleDateString("lt-LT")}
                </p>
              </div>
              <p className="text-base-content/80 line-clamp-2">{post.content}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link to="/" className="btn btn-outline">
          ← Atgal į temų sąrašą
        </Link>
      </div>
    </div>
  );
}
