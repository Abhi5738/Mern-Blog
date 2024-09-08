import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [recentPost, setRecentPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await response.json();
        if (!response.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (response.ok) {
          setPost(data.posts[0]);
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPost = async () => {
        const response = await fetch(`/api/post/getposts?limit=3`);
        const data = await response.json();
        if (response.ok) {
          setRecentPost(data.posts);
        }
      };
      fetchRecentPost();
    } catch (error) {}
  }, []);

  if (loading) return <div className="min-h-screen m-3">loading...</div>;
  return (
    <>
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post && post.title}
        </h1>
        <Link
          to={`/search?category=${post && post.category}`}
          className="self-center mt-5"
        >
          <Button color="gray" pill size="xs">
            {post && post.category}
          </Button>
        </Link>
        <img
          src={post && post.image}
          alt={post && post.title}
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
        />
        <div className="flex justify-between p-3 border-b border-slate-300 mx-auto w-full max-w-2xl text-xs">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div
          className="mx-auto p-3 max-w-2xl w-full post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        <div className="max-w-4xl mx-auto w-full">
          <CallToAction />
        </div>
        <CommentSection postId={post._id} />
        <div className="flex flex-col justify-center items-center mb-5">
          <h1 className="text-xl mt-5">Recent articales</h1>
          <div className=" flex flex-wrap gap-5 mt-5 justify-center">
            {recentPost &&
              recentPost.map((post) => {
                return <PostCard key={post._id} post={post} />;
              })}
          </div>
        </div>
      </main>
    </>
  );
};

export default PostPage;
