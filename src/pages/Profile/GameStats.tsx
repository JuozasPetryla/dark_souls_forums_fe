import { useState } from "react";

const mockData = [
      {
        id: 1,
        name: "Dark Souls: Prepare to Die Edition",
        playtimeHours: 124,
        achievementsUnlocked: 35,
        totalAchievements: 41,
        lastPlayed: "2024-10-14",
      },
      {
        id: 2,
        name: "Dark Souls II: Scholar of the First Sin",
        playtimeHours: 98,
        achievementsUnlocked: 31,
        totalAchievements: 38,
        lastPlayed: "2024-09-27",
      },
      {
        id: 3,
        name: "Dark Souls III",
        playtimeHours: 156,
        achievementsUnlocked: 43,
        totalAchievements: 43,
        lastPlayed: "2024-11-02",
      },
    ];

export default function GameStats() {
  const [games, setGames] = useState(mockData);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-primary">
        Žaidimų statistika
      </h1>

    <div className="grid gap-6">
      {games.map((game) => {
        const progress =
          (game.achievementsUnlocked / game.totalAchievements) * 100;
        return (
          <div
            key={game.id}
            className="card bg-base-200 shadow-lg border border-base-300"
          >
            <div className="card-body">
              <h2 className="card-title text-lg sm:text-xl">
                {game.name}
              </h2>

              <div className="grid sm:grid-cols-2 gap-2 text-sm text-base-content/80">
                <p>
                  <strong>Laikas:</strong> {game.playtimeHours}h
                </p>
                <p>
                  <strong>Paskutinį kartą žaista:</strong> {game.lastPlayed}
                </p>
                <p>
                  <strong>Pasiekimai:</strong>{" "}
                  {game.achievementsUnlocked}/{game.totalAchievements}
                </p>
              </div>

              <div className="mt-2">
                <progress
                  className="progress progress-primary w-full"
                  value={progress}
                  max="100"
                ></progress>
                <p className="text-xs text-right mt-1">
                  {progress.toFixed(1)}% complete
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}