const mockLikedThreads = [
  { id: 1, title: "Kaip nugalėti Ornstein ir Smough?", author: "Solaire", likes: 128 },
  { id: 2, title: "Mano mėgstamas buildas", author: "Artorias", likes: 87 },
  { id: 3, title: "Kas geriau – parry ar dodge?", author: "Gwyn", likes: 56 },
];

export default function LikedThreads() {
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">Mėgstami įrašai</h1>

      {mockLikedThreads.length === 0 ? (
        <p className="text-center text-base-content/70">Dar neturi pamėgtų įrašų.</p>
      ) : (
        <div className="space-y-4">
          {mockLikedThreads.map((thread) => (
            <div
              key={thread.id}
              className="p-4 bg-base-100 rounded-lg shadow hover:bg-base-200 transition"
            >
              <h2 className="text-xl font-semibold">{thread.title}</h2>
              <p className="text-sm text-base-content/70">
                Autorius: {thread.author} • Patinka: ❤️ {thread.likes}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
