import React from "react";
import img from "../../src/media/images/sj-smiling-stareing.jpg";

import {
  FiThumbsUp,
  FiMessageCircle,
  FiRepeat,
  FiShare2,
} from "react-icons/fi";
const Post = (props) => {
  const { post } = props;
  return (
    <div className="border rounded-lg p-1 mb-4 shadow w-[90%] max-w-[600px] m-auto hover:shadow-md">
      <div className="top">
        <div className="flex  text-sm gap-1 p-2">
          <img
            src={img}
            alt=""
            className="w-12 h-12 object-cover rounded-full cursor-pointer"
          />
          <div className="flex flex-col ml-2  my-auto">
            <span className="name-in-post font-semibold font-ubuntu cursor-pointer">
              Sahjahan Ahmed
            </span>
            <span className="text-sm text-gray-600">07 . 06 . 2023</span>
          </div>
        </div>
      </div>
      <div className="bottom content">
        <span className="px-4">{post?.description.slice(1, 120)}</span>
        &nbsp;
        {post.description.length > 120 ? (
          <span>
            <span>...</span>{" "}
            <button className="text-blue-500 hover:text-blue-700 transition duration-150">
              see more
            </button>
          </span>
        ) : (
          ""
        )}
        <div className="media">
          {post.image && (
            <img
              src={post.image}
              alt="photo"
              className="p-3 md:p-10 w-full max-w-[500px] m-auto"
            />
          )}
        </div>
      </div>
      <div className="footer engagements">
        <div className="flex justify-between">
          <span className="flex items-center gap-2  text-blue-600 ml-2 mb-1 text-sm">
            <FiThumbsUp className="" /> 45
          </span>
          <div className="mr-2 text-sm">
            <span>0 Comments</span>
          </div>
        </div>
        <div className="border-t flex items-center  ">
          <button className="flex items-center gap-1 flex-1  justify-center  py-3 mt-1 rounded-lg transition duration-150  font-semibold text-gray-800 hover:bg-gray-200">
            <FiThumbsUp className="" /> like
          </button>
          <button className="flex items-center flex-1 gap-1 justify-center py-3 mt-1 rounded-lg transition duration-150 font-semibold text-gray-800 hover:bg-gray-200">
            <FiMessageCircle className="" /> Comment
          </button>
          <button className="flex items-center flex-1 gap-1 justify-center py-3 mt-1 rounded-lg transition duration-150 font-semibold text-gray-800 hover:bg-gray-200">
            <FiShare2 className="" /> Share
          </button>
          <button className="flex items-center flex-1 gap-1 justify-center py-3 mt-1 rounded-lg transition duration-150 font-semibold text-gray-800 hover:bg-gray-200">
            <FiRepeat className="" /> Repost
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
