import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import type { ThemeStatistics } from "../types/Theme";
import { api } from "../api/apiClient";

export default function ThemeStatistic() {
  const { themeId } = useParams<{ themeId: string }>();
  const [viewerCount, setViewerCount] = useState(0);
  const [stats, setStats] = useState<ThemeStatistics>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTheme() {
      try {
        const data = await api.get<ThemeStatistics>(`topics/read/statistics/${themeId}`);
        console.log("Fetched theme statistics:", data);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch themes:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTheme();
  }, []);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/topic/${themeId}`);
    
    ws.onmessage = (event) => {
      setViewerCount(parseInt(event.data));
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [themeId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-10 px-4 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!stats) {
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
          {stats.title} – Temos statistika
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="stat bg-base-200 rounded-xl shadow p-4">
            <div className="stat-title text-sm text-base-content/70">
              Įrašų skaičius
            </div>
            <div className="stat-value text-primary">{stats.totalPosts}</div>
          </div>

          <div className="stat bg-base-200 rounded-xl shadow p-4">
            <div className="stat-title text-sm text-base-content/70">
              Komentarų skaičius
            </div>
            <div className="stat-value text-secondary">{stats.totalComments}</div>
          </div>

          <div className="stat bg-base-200 rounded-xl shadow p-4">
            <div className="stat-title text-sm text-base-content/70">
              Temos peržiūrų skaičius
            </div>
            <div className="stat-value text-primary">{stats.totalViews}</div>
          </div>

          <div className="stat bg-base-200 rounded-xl shadow p-4">
            <div className="stat-title text-sm text-base-content/70">
              Dabartinių žiūrovų skaičius
            </div>
            <div className="stat-value text-secondary">{viewerCount}</div>
          </div>
        </div>

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
