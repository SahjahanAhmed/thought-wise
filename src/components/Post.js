import React, { useEffect, useState } from "react";
import img from "../../src/media/images/sj-smiling-stareing.jpg";
import userImg from "../media/images/user.jpg";
import {
  FiThumbsUp,
  FiMessageCircle,
  FiRepeat,
  FiShare2,
} from "react-icons/fi";
import { BiDotsVerticalRounded } from "react-icons/bi";
import ReactPlayer from "react-player";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import ting from "../media/audio/ting.mp3";
const Post = (props) => {
  const [user, loading] = useAuthState(auth);
  const [likes, setLikes] = useState([]);
  const [isEditorbarOpen, setIsEditorbarOpen] = useState(false);
  const { post, access, setIsEditSectionOpen, setEditPostId, setGetPost } =
    props;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "likes"), (snapshot) => {
      let likes = [];
      snapshot.docs.forEach((doc) => {
        likes.push({ ...doc.data(), id: doc.id });
      });
      setLikes(likes.filter((like) => like.postId == post.id));
    });
    return unsubscribe;
  }, []);

  const handleDeletePost = async () => {
    const postRef = doc(db, "posts", post.id);
    await deleteDoc(postRef);
  };
  const handleLikePost = () => {
    const likeSound = new Audio(ting);
    const likeRef = doc(db, "likes", likes[0].id);
    const didILike = likes[0]?.likers?.filter((liker) => liker == user.uid);

    updateDoc(likeRef, {
      likes: didILike.length == 0 ? likes[0].likes + 1 : likes[0].likes - 1,
      likers:
        didILike.length == 0
          ? [...likes[0]?.likers, user.uid]
          : likes[0]?.likers?.filter((liker) => liker != didILike[0]),
    });
    if (didILike.length == 0) likeSound.play();
  };
  const iLiked = likes[0]?.likers.filter((liker) => liker == user.uid);
  console.log(iLiked);
  return (
    <div
      className=" rounded-lg p-1 shadow-md w-[90%]
     max-w-[600px] border-2 m-auto hover:shadow-lg mb-6 min-w-[280px]"
    >
      <div className="top flex justify-between">
        <div className="flex  text-sm gap-1 p-2">
          <img
            src={post.userPhoto ? post.userPhoto : userImg}
            alt="user"
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
            <span className="text-[12px] text-gray-700">
              {post.createdAt?.toDate().toLocaleDateString()}
            </span>
          </div>
        </div>
        {access && (
          <div className={`access flex   gap-1 p-2 relative`}>
            <button
              className="text-xl h-6 w-6 text-center 
            flex items-center justify-center rounded-full
            transition duration-150 hover:bg-gray-200"
              onClick={() => setIsEditorbarOpen(!isEditorbarOpen)}
            >
              <BiDotsVerticalRounded />
            </button>

            {isEditorbarOpen && (
              <div className="editor-bar absolute bg-white border-2 shadow-md rounded-lg p-2 flex flex-col gap-1 items-center justify-center right-8">
                <button
                  className="hover:bg-gray-200 w-full rounded-lg px-2 py-1 transition duration-150"
                  onClick={() => {
                    setIsEditSectionOpen(true);
                    setEditPostId(post.id);
                    setGetPost(post);
                  }}
                >
                  Edit
                </button>
                <button
                  className="hover:bg-gray-200 w-full 
                rounded-lg px-2 py-1 transition duration-150"
                  onClick={handleDeletePost}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="bottom content px-4 mb-3 mt-1">
        <span>{post.postText?.slice(0, 120)}</span>
        {post?.postText?.length > 120 ? (
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
          {post.shareImage != "" ? (
            <img
              src={post?.shareImage}
              alt="photo"
              className="py-2 md:p-10 w-full max-w-[500px] m-auto"
            />
          ) : (
            ""
          )}
          {post.shareVideo != "" ? (
            <ReactPlayer
              width={"100%"}
              url={post.shareVideo}
              className="py-2 md:p-10 w-full max-w-[500px] m-auto"
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="footer engagements">
        <div className="flex justify-between">
          <span
            className="flex items-center gap-2 
           text-blue-600 hover:text-blue-800 ml-2 mb-1 text-sm cursor-pointer"
          >
            <FiThumbsUp className="" /> {likes[0]?.likes}
          </span>
          <div className="mr-2 ">
            <span className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              0 Comments
            </span>
          </div>
        </div>
        <div className="border-t flex items-center ">
          <motion.button
            className={`flex items-center gap-1 flex-1 
           justify-center  py-3 mt-1 rounded-lg 
              font-semibold text-gray-800
             hover:bg-gray-200  transition duration-150 ${
               iLiked?.length == 1 ? "  scale-105 scale-x-100 " : ""
             }`}
            onClick={handleLikePost}
            whileTap={{ scale: 2 }}
            style={{
              letterSpacing: iLiked?.length == 1 ? "1px" : "normal",
            }}
          >
            <FiThumbsUp
              className={`${iLiked?.length == 1 && "text-blue-600  text-xl"}`}
            />
            <span className={`${iLiked?.length == 1 && "text-blue-600"}`}>
              like
            </span>
          </motion.button>
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
