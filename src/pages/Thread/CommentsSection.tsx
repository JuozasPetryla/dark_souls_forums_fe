export default function CommentsSection() {
  const comments = [
    {
      id: 1,
      author: "Solaire of Astora",
      date: "2025-10-31",
      text: "Praise the Sun! ☀️",
    },
    {
      id: 2,
      author: "Knight Artorias",
      date: "2025-11-01",
      text: "The abyss may consume me, but not my will.",
    },
    {
      id: 3,
      author: "Siegmeyer of Catarina",
      date: "2025-11-03",
      text: "Hmm... mmm! I think I'll have another adventure.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-base-200 p-6 rounded-box shadow-md mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-center text-primary">
        Komentarai
      </h2>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-base-100 p-4 rounded-box border border-base-300"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-primary">
                {comment.author}
              </span>
              <span className="text-xs opacity-60">{comment.date}</span>
            </div>
            <p className="text-sm leading-relaxed">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}