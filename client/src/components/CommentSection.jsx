import { Alert, Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          userId: currentUser._id,
          postId,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setCommentError(null);
        setComment("");
        setComments([result, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      const response = await fetch(`/api/comment/getPostComments/${postId}`);
      const data = await response.json();
      if (response.ok) {
        setComments(data);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const response = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <>
          <div className="flex gap-1 items-center my-5 text-gray-500 text-sm">
            <p>Signed in as:</p>
            <img
              className="h-5 w-5 object-cover rounded-full"
              src={currentUser.profilePicture}
              alt="profilePicture"
            />
            <Link
              to="/dashboard?tab=profile"
              className="text-xs text-cyan-600 hover:underline"
            >
              @{currentUser.username}
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className=" flex gap-1">
            You must be signed in to comment.
            <Link to="/sign-in" className="text-blue-500 hover:underline">
              Sign In{" "}
            </Link>
          </div>
        </>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            rows="3"
            placeholder="Add a comment..."
            maxLength="200"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className=" flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-2">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => {
            return (
              <Comment
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                onEdit={handleEdit}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default CommentSection;
