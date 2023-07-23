import React, { useEffect, useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
} from "react-share";
import { GrClose } from "react-icons/gr";
import userImg from "../media/images/user.jpg";
import moment from "moment";
import { motion } from "framer-motion";
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
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ting from "../media/audio/ting.mp3";
import Comments from "./Comments";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Post = (props) => {
  const [seeMore, setSeeMore] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentBox, setCommentBox] = useState(false);
  const [isEditorbarOpen, setIsEditorbarOpen] = useState(false);
  const {
    post,
    access,
    setIsEditSectionOpen,
    setEditPostId,
    setGetPost,
    suggestedPost,
    setSuggestedPost,
  } = props;

  // fromat date
  const formattedDate = post?.createdAt
    ? moment.unix(post.createdAt.seconds).fromNow()
    : "Invalid Date";

  // like
  const { likes } = useSelector((store) => store.likes);
  const like = likes.filter((like) => like?.postId == post?.id)[0];

  // user
  const [USER, loading] = useAuthState(auth);
  const { users } = useSelector((store) => store.users);
  const user = users.filter((user) => user?.uid == USER?.uid)[0];

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "comments"), orderBy("createdAt", "desc")),
      (snapshot) => {
        let comments = [];
        snapshot.docs.forEach((doc) => {
          comments.push({ ...doc.data(), id: doc.id });
        });
        setComments(comments.filter((comment) => comment));
      }
    );
    return unsubscribe;
  }, []);

  const handleDeletePost = async () => {
    setIsEditorbarOpen(false);
    const postRef = doc(db, "posts", post.id);
    await deleteDoc(postRef);
  };
  const handleLikePost = () => {
    const likeound = new Audio(ting);
    const likeRef = doc(db, "likes", like.id);
    const didILike = like?.likers?.filter((liker) => liker == user?.uid);

    updateDoc(likeRef, {
      likes: didILike.length == 0 ? like.likes + 1 : like.likes - 1,
      likers:
        didILike.length == 0
          ? [...like?.likers, user?.uid]
          : like?.likers?.filter((liker) => liker != didILike[0]),
    });
    if (didILike.length == 0) likeound.play();
  };

  const iLiked = like?.likers.filter((liker) => liker == user?.uid);
  return (
    <>
      {suggestedPost && (
        <h2 className="text-2xl text-gray-800 text-center mb-2">Suggested</h2>
      )}
      <div
        className="relative rounded-lg p-1 shadow-md w-[90%]
     max-w-[600px] border-2 m-auto hover:shadow-lg mb-6 min-w-[280px]"
      >
        <div className="top flex justify-between">
          <div className="flex  text-sm gap-1 p-2">
            <Link to={`/profile/${post?.userId}`}>
              <img
                src={post?.userPhoto ? post?.userPhoto : userImg}
                alt="user"
                className="w-12 h-12 object-cover rounded-full 
            cursor-pointer border "
              />
            </Link>

            <div className="flex flex-col ml-2  my-auto">
              <Link
                to={`/profile/${post?.userId}`}
                className="name-in-post font-semibold 
            font-ubuntu cursor-pointer"
              >
                {post?.userName}
              </Link>
              <span className="text-[12px] text-gray-700">{formattedDate}</span>
            </div>
          </div>
          {access && post?.userId == user?.uid && (
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
                      setIsEditorbarOpen(false);
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
          {suggestedPost && (
            <button
              onClick={() => setSuggestedPost("")}
              className="absolute hover:bg-gray-200 transition duration-150  border shadow rounded-lg p-2 flex flex-col gap-1 items-center justify-center  top-2 right-2"
            >
              <GrClose />
            </button>
          )}
        </div>
        <div className="bottom  content px-4 mb-3 mt-1 overflow-x-hidden ">
          <p>{post.postText?.slice(0, seeMore ? 1200 : 120)}</p>
          {post?.postText?.length > 120 ? (
            <button
              className="text-blue-500 hover:text-blue-700 
          transition duration-150"
              onClick={() => setSeeMore(!seeMore)}
            >
              &nbsp; {seeMore ? "...see less" : "...see more"}
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
              className="post-likes flex items-center gap-2 
           text-blue-600 hover:text-blue-800 ml-2 mb-1 text-sm cursor-pointer"
            >
              <FiThumbsUp className="" /> {like?.likes}
            </span>
            <div className="mr-2 ">
              <span
                className="post-comments cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                onClick={() => setCommentBox(true)}
              >
                {post?.comment} Comments
              </span>
            </div>
          </div>
          <div className="buttons-div border-t flex items-center ">
            <motion.button
              className={`flex items-center gap-1 flex-1 
           justify-center  py-3 mt-1 rounded-lg 
              font-semibold text-gray-800
             hover:bg-gray-200  transition duration-150 ${
               iLiked?.length == 1 ? "  scale-105 scale-x-100 " : ""
             }`}
              onClick={handleLikePost}
              whileTap={{ scale: 1.2 }}
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
              onClick={() => setCommentBox(!commentBox)}
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
          {commentBox && (
            <Comments comments={comments} postId={post.id} post={post} />
          )}
        </div>
      </div>
    </>
  );
};

export default Post;
