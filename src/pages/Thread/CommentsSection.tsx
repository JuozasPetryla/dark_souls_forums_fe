import React, { useEffect, useState } from "react";
import { handleVote } from "../../components/handleVote";
import { useParams } from "react-router-dom"
import axios from "axios";

export interface Comment {
  id: number;
  author: string;
  date: string;
  text: string;
  upvotes?: number | null;
  downvotes?: number | null;
  userVote?: "positive" | "negative" | null;
  rating_id?: number | null;
  author_id?: number;
  comment_iq?: number | null
}


export default function CommentSection() {

  const { postId } = useParams();
  const numericPostId = Number(postId);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const token = localStorage.getItem("access_token");
  
  const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: "Bearer " + token }
  });

  useEffect(() => {
    if (!token) return;
    const fetchCurrentUser = async () => {
      //const token = localStorage.getItem("JWT");
      console.log("CALLING:", `${api.defaults.baseURL}/api/v1/auth/me`);
      console.log("TOKEN SENT:", token);
      try {
        const res = await api.get("/api/v1/auth/me");
        console.log("USER RESPONSE:", res.data);
        setCurrentUserId(res.data.id);
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };

    fetchCurrentUser();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const fetchComments = async () => {
      
      try {

        const res = await api.get(`/api/v1/comments/read_all/${numericPostId}`);
        const data = res.data;

        setComments(
          data.comments.map((c: Comment) => ({
            ...c,
            author_id: c.author_id,
            upvotes: c.upvotes ?? 0,
            downvotes: c.downvotes ?? 0,
            userVote: c.userVote ?? null,
            rating_id: c.rating_id || undefined,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [numericPostId, token]);

  const postComment = async () => {
    if (!newComment.trim() || currentUserId === null) return;

    try {
      const res = await api.post("/api/v1/comments/create", {
        content: newComment,
        post_id: numericPostId
      });

      setComments(prev => [
        ...prev,
        {
          id: res.data.comment_id,
          author_id: currentUserId,
          author: res.data.author || "You",
          date: new Date().toISOString().split("T")[0],
          text: newComment,
          upvotes: 0,
          downvotes: 0,
          userVote: null,
          rating_id: null,
          comment_iq: null
        }
      ]);

      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const saveEdit = async (commentId: number) => {
    if (!editingText.trim()) return;
    try {
      await api.put(`/api/v1/comments/update/${commentId}`, { content: editingText });
      setComments(comments.map(c => (c.id === commentId ? { ...c, text: editingText } : c)));
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await api.delete(`/api/v1/comments/delete/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  
  return (<div className="max-w-3xl mx-auto bg-base-200 p-6 rounded-box shadow-md mt-10 space-y-6">
    {/* New Comment */} <div className="space-y-4"> <label className="font-semibold text-indigo-700">
      Palikite komentarą:
      <textarea
        placeholder="Write your comment..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        rows={4}
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
      /> </label> <div className="flex justify-end"> <button className="btn btn-soft btn-primary" onClick={postComment}>
        Post Comment </button> </div> </div>

    <h2 className="text-2xl font-bold text-center text-primary">Komentarai</h2>

    {/* Comments List */}
    {comments.map(comment => (
  <div key={comment.id} className="flex items-start gap-4">
    {/* Comment Content */}
    <div className="flex-1 bg-white p-4 rounded-lg shadow-md border border-gray-200 relative">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-semibold text-gray-800">{comment.author}</span>
          <span className="ml-2 text-xs text-gray-500">{comment.date}</span>
        </div>
        {comment.author_id === currentUserId && (
          <div className="flex gap-2">
            <button
              className="p-1 hover:opacity-70"
              onClick={() => {
                setEditingId(comment.id);
                setEditingText(comment.text);
              }}
            >
              <img src="/src/assets/edit.svg" alt="edit" className="w-5 h-5" />
            </button>
            <button
              className="p-1 hover:opacity-70"
              onClick={() => deleteComment(comment.id)}
            >
              <img src="/src/assets/trash.svg" alt="delete" className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {editingId === comment.id ? (
        <div className="space-y-2 mt-2">
          <textarea
            value={editingText}
            onChange={e => setEditingText(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-black"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => saveEdit(comment.id)} className="btn btn-soft btn-primary">
              Save
            </button>
            <button onClick={() => setEditingId(null)} className="btn btn-soft btn-primary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-1">
          <p className="text-gray-700 leading-relaxed text-left">{comment.text}</p>

          {/* Display IQ if calculated */}
          {comment.comment_iq !== null && (
            <p className="mt-2 font-semibold text-indigo-700">
              Comment IQ: {comment.comment_iq}
            </p>
          )}

          {/* Calculate IQ button if not yet calculated */}
          {comment.comment_iq === null && (
            <button
              className="mt-2 btn btn-sm btn-outline btn-primary"
              onClick={async () => {
                try {
                  const res = await api.post(
                    `/api/v1/comments/${comment.id}/calculate-iq`,
                    { text: comment.text }
                  );
                  // Update the comment in state
                  setComments(prev =>
                    prev.map(c =>
                      c.id === comment.id ? { ...c, comment_iq: res.data.comment_iq } : c
                    )
                  );
                } catch (err) {
                  console.error("Failed to calculate IQ", err);
                }
              }}
            >
              Calculate IQ
            </button>
          )}
        </div>
      )}
    </div>

    {/* Vote Column */}
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleVote(comment, "positive", setComments)}
        className={`p-0.5 hover:opacity-70 ${
          comment.userVote === "positive" ? "!bg-blue-500 !border-[1px] !border-black" : ""
        }`}
      >
        <img src="/src/assets/arrow.svg" alt="upvote" className="w-5 h-5 rotate-270 relative z-10" />
      </button>
      <span className="text-sm my-2"></span>
      <button
        onClick={() => handleVote(comment, "negative", setComments)}
        className={`p-0.5 hover:opacity-70 ${
          comment.userVote === "negative" ? "!bg-red-500 !border-[1px] !border-black" : ""
        }`}
      >
        <img src="/src/assets/arrow.svg" alt="downvote" className="w-5 h-5 rotate-90 relative z-10" />
      </button>
    </div>
  </div>
))}
  </div>


  );
};

