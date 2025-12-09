import type { Comment } from "../pages/Thread/CommentsSection"; 
import type { Dispatch, SetStateAction } from "react";

export const handleVote = async (
  comment: Comment,
  vote: "positive" | "negative",
  setComments: Dispatch<SetStateAction<Comment[]>>
) => {
  const token = localStorage.getItem("access_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    if (comment.userVote === vote && comment.rating_id) {
      // DELETE vote
      const res = await fetch(`http://localhost:8000/api/v1/comments_rating/delete/${comment.rating_id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Delete vote failed");

      setComments(prev =>
        prev.map(c =>
          c.id === comment.id ? { ...c, userVote: null, rating_id: undefined } : c
        )
      );
      return;
    }

    if (comment.rating_id) {
      // UPDATE vote
      const res = await fetch(`http://localhost:8000/api/v1/comments_rating/update/${comment.rating_id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ rating: vote }),
      });
      if (!res.ok) throw new Error("Update vote failed");

      setComments(prev =>
        prev.map(c => (c.id === comment.id ? { ...c, userVote: vote } : c))
      );
    } else {
      // CREATE vote
      const res = await fetch("http://localhost:8000/api/v1/comments_rating/create", {
        method: "POST",
        headers,
        body: JSON.stringify({ comment_id: comment.id, rating: vote }),
      });
      if (!res.ok) throw new Error("Create vote failed");

      const data = await res.json();
      setComments(prev =>
        prev.map(c =>
          c.id === comment.id ? { ...c, userVote: vote, rating_id: data.rating_id } : c
        )
      );
    }
  } catch (err) {
    console.error(err);
    alert("Voting error");
  }
};