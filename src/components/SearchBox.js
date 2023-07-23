import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Post from "./Post";
import EditPost from "./EditPost";
import defaultProfilePhoto from "../media/images/user.jpg";

const SearchBox = ({ setSearchModal, posts, searchTerms }) => {
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [editPostId, setEditPostId] = useState("");
  const [getPost, setGetPost] = useState(null);
  const [postLarge, setPostLarge] = useState("");
  const matchedPosts = posts.filter(
    (post) =>
      post?.postText.toLowerCase()?.includes(searchTerms.toLowerCase()) &&
      searchTerms != ""
  );
  return (
    <div className=" animate-fade absolute z-[999]  max-w-[600px] min-w-[50%] p-2 mr-4 top-full  bg-white shadow-2xl rounded-b-2xl max-h-[500px] overflow-scroll scrollbar-none">
      <button
        className="ml-2 text-gray-700 text-sm hover:text-gray-900 mb-2"
        onClick={() => setSearchModal(false)}
      >
        <FaArrowLeft />
      </button>
      <div>
        <h1 className=" ml-2 text-gray-700 font-semibold text-xl">Posts</h1>

        <div className="flex flex-col gap-2">
          {matchedPosts &&
            matchedPosts.map((post) => {
              return (
                <>
                  <Link
                    className={`flex items-start justify-start text-gray-800 gap-2 hover:bg-gray-200 hover:text-black rounded-lg p-2`}
                    onClick={() => setPostLarge(postLarge ? "" : post?.id)}
                  >
                    <img
                      src={post?.userPhoto || defaultProfilePhoto}
                      alt="user photo"
                      className="w-6 h-6 rounded-full mt-1"
                    />

                    <div className="flex items-start justify-between gap-2 w-full">
                      <p>
                        {post?.postText?.slice(0, 60)}
                        {+post?.postText?.length > 30 && "..."}
                      </p>
                      {post?.shareImage && (
                        <img
                          src={post?.shareImage}
                          alt=""
                          className="max-h-[80px] rounded-lg justify-self-end"
                        />
                      )}
                    </div>
                  </Link>
                  {postLarge && postLarge == post?.id && (
                    <Post
                      post={post}
                      key={post?.id}
                      access={true}
                      setIsEditSectionOpen={setIsEditSectionOpen}
                      setEditPostId={setEditPostId}
                      setGetPost={setGetPost}
                    />
                  )}
                  {isEditSectionOpen && (
                    <EditPost
                      setIsEditSectionOpen={setIsEditSectionOpen}
                      editPostId={editPostId}
                      getPost={getPost}
                    />
                  )}
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
