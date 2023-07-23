import React from "react";
import moment from "moment/moment";

const Comment = ({ comment }) => {
  const formattedDate = comment?.createdAt
    ? moment.unix(comment.createdAt.seconds).fromNow()
    : "Invalid Date";
  console.log(formattedDate);

  return (
    <div className="flex flex-col m-4 shadow-sm border-2 rounded-lg p-2 hover:bg-gray-100">
      <div className="flex ">
        <img
          src={comment?.userPhoto}
          alt="user photo"
          className="h-8 w-8 object-cover rounded-full"
        />
        <span className="flex flex-col ml-2">
          <span className="text-sm font-semibold">{comment?.userName}</span>
          <span className="text-[10px]">{formattedDate}</span>
        </span>
      </div>
      <div className="text-sm ml-10 overflow-x-scroll scrollbar-none">
        {comment?.commentText}
      </div>
    </div>
  );
};

export default Comment;
