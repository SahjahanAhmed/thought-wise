import React from "react";
import img from "../../src/media/images/sj-smiling-stareing.jpg";
import userImg from "../media/images/user.jpg";
import {
  FiThumbsUp,
  FiMessageCircle,
  FiRepeat,
  FiShare2,
} from "react-icons/fi";
const Post = (props) => {
  const { post } = props;
  return (
    <div
      className=" rounded-lg p-1 shadow-md w-[90%]
     max-w-[600px] border-2 m-auto hover:shadow-lg mb-6 min-w-[280px]"
    >
      <div className="top">
        <div className="flex  text-sm gap-1 p-2">
          <img
            src={post.user_photo ? post.userphoto : userImg}
            alt=""
            className="w-12 h-12 object-cover rounded-full 
            cursor-pointer border "
          />
          <div className="flex flex-col ml-2  my-auto">
            <span
              className="name-in-post font-semibold 
            font-ubuntu cursor-pointer"
            >
              Sahjahan Ahmed
            </span>
            <span className="text-sm text-gray-600">07 . 06 . 2023</span>
          </div>
        </div>
      </div>
      <div className="bottom content px-4 mb-3 mt-1">
        <span>{post?.postText.slice(0, 120)}</span>
        {post?.postText.length > 120 ? (
          <button
            className="text-blue-500 hover:text-blue-700 
          transition duration-150"
          >
            &nbsp; ...see more
          </button>
        ) : (
          ""
        )}
        <div className="media">
          {post?.image && (
            <img
              src={post?.image}
              alt="photo"
              className="py-2 md:p-10 w-full max-w-[500px] m-auto"
            />
          )}
        </div>
      </div>
      <div className="footer engagements">
        <div className="flex justify-between">
          <span
            className="flex items-center gap-2 
           text-blue-600 hover:text-blue-800 ml-2 mb-1 text-sm cursor-pointer"
          >
            <FiThumbsUp className="" /> 45
          </span>
          <div className="mr-2 ">
            <span className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              0 Comments
            </span>
          </div>
        </div>
        <div className="border-t flex items-center  ">
          <button
            className="flex items-center gap-1 flex-1 
           justify-center  py-3 mt-1 rounded-lg transition
            duration-150  font-semibold text-gray-800
             hover:bg-gray-200"
          >
            <FiThumbsUp className="" /> like
          </button>
          <button
            className="flex items-center flex-1 gap-1
           justify-center py-3 mt-1 rounded-lg transition
           duration-150 font-semibold text-gray-800 hover:bg-gray-200"
          >
            <FiMessageCircle className="" /> Comment
          </button>
          <button
            className="flex items-center flex-1 gap-1 
          justify-center py-3 mt-1 rounded-lg transition
          duration-150 font-semibold text-gray-800 hover:bg-gray-200"
          >
            <FiShare2 className="" /> Share
          </button>
          <button
            className="flex items-center flex-1 gap-1 
          justify-center py-3 mt-1 rounded-lg transition duration-150
          font-semibold text-gray-800 hover:bg-gray-200"
          >
            <FiRepeat className="" /> Repost
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
