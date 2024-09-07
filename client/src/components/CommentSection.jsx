import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CommentSection = () => {
  const { currentUser } = useSelector((state) => state.user);

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
          <div className="">
            You must be signed in to comment.
            <Link to="/sign-in">Sign In </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CommentSection;
