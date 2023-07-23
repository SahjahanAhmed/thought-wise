import React, { useEffect, useState } from "react";
import Suggestion from "../components/Suggestion";
import Post from "../components/Post";
import { useSelector } from "react-redux";
import { FiPlus } from "react-icons/fi";
import CreatePostModal from "../components/CreatePostModal";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import loadingImage from "../media/images/loading.svg";
import EditPost from "../components/EditPost";
import { useAuthState } from "react-firebase-hooks/auth";
const Home = ({ searchModal, setSearchModal }) => {
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [editPostId, setEditPostId] = useState("");
  const [getPost, setGetPost] = useState(null);
  const [progress, setProgress] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [allposts, setAllPosts] = useState([]);
  const [publicPosts, setPublicPosts] = useState([]);

  // user
  const [USER, loading] = useAuthState(auth);
  const { users } = useSelector((store) => store.users);
  const user = users.filter((user) => user?.uid == USER?.uid)[0];
  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let posts = [];
      snapshot.docs.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
      setAllPosts(posts);
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    if (allposts.length <= 0) return;
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      orderBy("createdAt", "desc"),
      where("postTo", "==", "anyone")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let posts = [];
      snapshot.docs.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
      setPublicPosts(posts);
    });
    return unsubscribe;
  }, [allposts]);
  return (
    <>
      {searchModal && (
        <div
          className=" fixed  w-[screen] top-0 left-0 right-0 bottom-0 z-[800] bg-[rgba(0,0,0,.8)]"
          onClick={() => setSearchModal(false)}
        ></div>
      )}
      <div
        className={`  max-w-[1000px]   mx-auto w-full md:w-[80%] 
        flex flex-col   md:items-start md:flex-row md:gap-6`}
      >
        {isModal && (
          <CreatePostModal setIsModal={setIsModal} setProgress={setProgress} />
        )}
        <Suggestion />
        <div
          className="xs:flex-[5] ml-2 xs:-ml-0 md:mt-0.5 md:border-2 
      md:shadow-sm rounded-lg flex flex-col items-center'
       overflow-x-hidden "
        >
          <div className="flex flex-col items-center">
            <button
              className="w-auto shadow-md border-2 p-4
             rounded-full my-4 bg-slate-100
              text-gray-800 hover:bg-slate-200
               hover:text-black transition 
               duration-150 font-semibold flex items-center gap-2"
              onClick={() => setIsModal(true)}
            >
              <FiPlus className="text-2xl" /> Share a thought
            </button>
          </div>

          <div className="text-2xl p-1 mb-4  font-ubuntu w-[90%] m-auto max-w-[600px]">
            Your feed
          </div>
          {progress && (
            <img
              src={loadingImage}
              alt="loading image"
              className="h-10 mb-2.5"
            />
          )}

          <div className="flex flex-col">
            {publicPosts?.map((post) => {
              return (
                <Post
                  post={post}
                  key={post?.id}
                  access={true}
                  setIsEditSectionOpen={setIsEditSectionOpen}
                  setEditPostId={setEditPostId}
                  setGetPost={setGetPost}
                />
              );
            })}
          </div>
          <div>
            {isEditSectionOpen && (
              <EditPost
                setIsEditSectionOpen={setIsEditSectionOpen}
                editPostId={editPostId}
                getPost={getPost}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
