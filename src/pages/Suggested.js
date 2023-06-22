import React, { useState } from "react";
import { MdVerified } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Route, Routes, useParams } from "react-router";
import { Link } from "react-router-dom";
import Post from "../components/Post";
import SinglePeople from "../components/SinglePeople";

const Suggested = ({ searchModal, setSearchModal }) => {
  const { suggestion } = useParams();
  const [state, setState] = useState(suggestion);
  const { users } = useSelector((store) => store.users);
  const { posts } = useSelector((store) => store.posts);
  const { likes } = useSelector((store) => store.likes);
  const soretedUsers = users
    .map((user) => ({
      ...user,
      posts: posts.filter((post) => post.userId == user.uid),
    }))
    .sort((prev, next) => {
      return next.posts.length - prev.posts.length;
    });
  const postsWithLike = posts.map((post) => ({
    ...post,
    likes: likes.filter((like) => like.postId == post.id),
  }));
  const sortedPosts = postsWithLike.sort((prev, next) => {
    return next.likes[0].likes - prev.likes[0].likes;
  });
  const suggetionList = suggestion === "people" ? soretedUsers : sortedPosts;
  return (
    <>
      {searchModal && (
        <div
          className=" fixed  w-[screen] top-0 left-0 right-0 bottom-0 z-[800] bg-[rgba(0,0,0,.8)]"
          onClick={() => setSearchModal(false)}
        ></div>
      )}
      <div className="max-w-[1000px]   mx-auto w-[90%]">
        <h1 className="text-2xl text-center font-ubuntu">Suggested for you!</h1>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Link
            to={"/suggested/people"}
            className={`border-2 shadow-md text-gray-800 p-2 rounded-full font-semibold  hover:bg-blue-600 transition duration-150 ${
              state == "people" && "bg-blue-600 text-white"
            }`}
            onClick={() => setState("people")}
          >
            People
          </Link>
          <Link
            to={"/suggested/thoughts"}
            className={`border-2 shadow-md text-gray-800 p-2 rounded-full font-semibold hover:bg-blue-600 transition duration-150 ${
              state == "thoughts" && "bg-blue-600 text-white"
            }`}
            onClick={() => setState("thoughts")}
          >
            Thoughts
          </Link>
        </div>
        <div className="max-w-[600px] overflow-y-scroll scrollbar-none border-2 mx-auto shadow-mg rounded-lg p-2 mt-10 flex flex-col gap-4 items-start">
          {suggetionList &&
            suggestion === "people" &&
            suggetionList.slice(0, 10).map((suggestion) => {
              return <SinglePeople user={suggestion} />;
            })}
          {suggetionList &&
            suggestion === "thoughts" &&
            suggetionList.slice(0, 10).map((suggestion) => {
              return <Post post={suggestion} />;
            })}
        </div>
      </div>
    </>
  );
};

export default Suggested;
