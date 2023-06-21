import React, { useState } from "react";
import Comment from "./Comment";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector } from "react-redux";

const Comments = ({ comments, postId, post }) => {
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState(false);

  // user
  const [USER, loading] = useAuthState(auth);
  const { users } = useSelector((store) => store.users);
  const user = users.filter((user) => user?.uid == USER?.uid)[0];

  const handleComment = () => {
    if (!commentText) return;
    addDoc(collection(db, "comments"), {
      commentText,
      userId: user.uid,
      postId,
      userName: user.displayName,
      userPhoto: user.photoURL,
      createdAt: serverTimestamp(),
    }).then(() => {
      updateDoc(doc(db, "posts", postId), {
        comment: post.comment + 1,
      });
    });
    setCommentText("");
  };
  const postComment = comments.filter((comment) => comment?.postId == postId);
  return (
    <div className="flex flex-col gap-4 border-t pt-2">
      <div className="flex items-start justify-between gap-2 px-4">
        <textarea
          value={commentText}
          type="text"
          placeholder="Comment here .."
          className="w-full bg-transparent p-2 outline-none scrollbar-none h-[50px] min-h-[50px] max-h-[200px] border-2 rounded-lg"
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          disabled={commentText ? false : true}
          className={`bg-blue-500 p-2 rounded-xl shadow-md text-white ${
            commentText ? "opacity-100" : "opacity-70"
          }`}
          onClick={handleComment}
        >
          Post
        </button>
      </div>
      <div className={`relative ${postComment.length > 3 && "pb-4"} `}>
        {postComment
          .slice(0, allComments ? allComments.postComment?.length : 3)
          .map((comment) => {
            return (
              postId == comment?.postId && (
                <Comment key={comment.userId} comment={comment} />
              )
            );
          })}

        {postComment.length > 3 && (
          <button
            className="absolute transition duration-150 bottom-0 hover:bg-blue-600  hover:text-white rounded-full px-3 left-[50%] translate-x-[-50%]  bg-blue-400"
            onClick={() => setAllComments(!allComments)}
          >
            {allComments ? "see less" : "see more"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Comments;
