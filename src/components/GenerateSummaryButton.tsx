import { useState } from "react";
import { api } from "../api/apiClient";

interface GenerateSummaryProps {
  postId: number;
  currentSummary: string | null;
  isAuthor: boolean;
  onSummaryGenerated: (summary: string) => void;
}

export function GenerateSummaryButton({
  postId,
  currentSummary,
  isAuthor,
  onSummaryGenerated
}: GenerateSummaryProps) {
  const [loading, setLoading] = useState(false);
  const [showGenerated, setShowGenerated] = useState(false);

  const handleGenerateSummary = async () => {
    if (!isAuthor) {
      alert("Tik autorius gali generuoti santrauką.");
      return;
    }

    if (currentSummary) {
      alert("Šis įrašas jau turi santrauką.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post<{ summary: string }>(
        `posts/generate-summary/${postId}`
      );

      console.log("Generated summary:", response.summary);
      onSummaryGenerated(response.summary);
      setShowGenerated(true);

      // Hide notification after 3 seconds
      setTimeout(() => setShowGenerated(false), 3000);
    } catch (error) {
      console.error("Nepavyko generuoti santraukos:", error);
      alert("Klaida generuojant santrauką. Bandykite dar kartą.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthor || currentSummary) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleGenerateSummary}
        disabled={loading}
        className="btn btn-sm btn-outline btn-info gap-2"
        title="Generuoti santrauką naudojant AI"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Generavimas...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0m-9 5a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
            Generuoti santrauką
          </>
        )}
      </button>

      {showGenerated && (
        <div className="alert alert-success shadow-lg mt-2">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Santrauka sėkmingai sugeneruota!</span>
          </div>
        </div>
      )}
    </>
  );
}
