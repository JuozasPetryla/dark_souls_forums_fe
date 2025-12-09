import {useParams, Link, Outlet} from "react-router-dom";
import {useState} from "react";
import CommentsSection from "./CommentsSection";

export default function Thread() {
  const { themeId, postId } = useParams<{ themeId: string; postId: string }>();
  const [showComments, setShowComments] = useState(false);


  const mockPosts = [
    {
      id: 1,
      themeId: 1,
      author: "Solaire",
      date: "2025-10-22",
      content:
        "Patariu laikytis arti Ornstein ir naudoti riedėjimą į vidų. Jei turi gerą štangą – naudok ją Smough prieš!",
    },
    {
      id: 2,
      themeId: 1,
      author: "Gwyn",
      date: "2025-10-23",
      content:
        "Naudoju magiją ir laikau juos atokiau. Pirmiausia išjunk Ornstein – tada bus lengviau.",
    },
    {
      id: 3,
      themeId: 2,
      author: "Artorias",
      date: "2025-10-25",
      content: "Claymore ir Uchigatana yra geriausi ginklai pradedantiesiems!",
    },
  ];

  const post = mockPosts.find(
    (p) => p.themeId === Number(themeId) && p.id === Number(postId)
  );

  if (!post) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-error">Įrašas nerastas 😢</h2>
        <Link to={`/irasai/${themeId}`} className="btn btn-primary mt-4">
          Atgal į įrašus
        </Link>
      </div>
    );
  }

  return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-base-100 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl">{post.author}</h2>
            <p className="text-sm text-base-content/60">
              {new Date(post.date).toLocaleDateString("lt-LT")}
            </p>
          </div>

          <p className="text-base-content/80 leading-relaxed">{post.content}</p>
        </div>

        <div className="text-center mt-10 space-x-3">
          <Link to={`/irasai/${themeId}`} className="btn btn-outline">
            ← Atgal į įrašus
          </Link>
          <Link to="/" className="btn btn-outline">
            Pagrindinis
          </Link>
          <button
        className="btn btn-soft btn-primary"
        onClick={() => setShowComments((prev) => !prev)}
      >
        {showComments ? "Slėpti komentarus" : "Rodyti komentarus"}
      </button>

      {showComments && (
        <div className="mt-6">
          <CommentsSection />
        </div>
      )}
        </div>

        <div className="mt-8">
          <Outlet/>
        </div>
      </div>
  );
}
