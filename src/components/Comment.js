import React from "react";

const Comment = ({ comment }) => {
  return (
    <div className="flex flex-col m-4 shadow-sm border-2 rounded-lg p-2 hover:bg-gray-100">
      <div className="flex ">
        <img
          src={comment?.userPhoto}
          alt="user photo"
          className="w-8 h-8 rounded-full"
        />
        <span className="flex flex-col ml-2">
          <span className="text-sm font-semibold">{comment?.userName}</span>
          <span className="text-[10px]">
            {comment?.createdAt?.toDate().toLocaleDateString()}
          </span>
        </span>
      </div>
      <div className="text-sm ml-10 overflow-x-scroll scrollbar-none">
        {comment?.commentText}
      </div>
    </div>
  );
};

export default Comment;
