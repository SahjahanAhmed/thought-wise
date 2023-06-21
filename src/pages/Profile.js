import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import cover from "../media/images/cover-photo.png";
import profile from "../media/images/SJ.jpg";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/PostSlice";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import EditPost from "../components/EditPost";
import CreatePostModal from "../components/CreatePostModal";
const Profile = ({ searchModal, setSearchModal }) => {
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [editPostId, setEditPostId] = useState("");
  const [getPost, setGetPost] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const dispatch = useDispatch();
  // useEffect(() => {
  // dispatch(fetchPosts());
  // }, []);
  const { uid } = useParams();
  // user
  const [USER, loading] = useAuthState(auth);
  const { users } = useSelector((store) => store.users);
  const user = users.filter((user) => user?.uid == uid)[0];

  const postsRef = collection(db, "posts");
  useEffect(() => {
    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      let allPosts = [];
      snapshot.docs.forEach((doc) => {
        allPosts.push({ ...doc.data(), id: doc.id });
      });
      setAllPosts(allPosts);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (allPosts.length <= 0) return;
    const q = query(
      postsRef,
      orderBy("createdAt", "desc"),
      where("userId", "==", uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let posts = [];
      snapshot.docs.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
      setUserPosts(posts);
    });
    return unsubscribe;
  }, [allPosts, uid]);

  return (
    <>
      {searchModal && (
        <div
          className=" fixed  w-[screen] top-0 left-0 right-0 bottom-0 z-[800] bg-[rgba(0,0,0,.8)]"
          onClick={() => setSearchModal(false)}
        ></div>
      )}
      <div className="max-w-[1000px] mx-auto w-full md:w-[80%] flex flex-col ">
        <div className="top flex flex-col shadow pb-4">
          <div>
            <Link to="/profile">
              <img
                src={cover}
                alt="cover photo"
                className="w-full h-full max-h-[350px] object-cover"
              />
            </Link>
            <div
              className="flex flex-col items-center gap-2
            md:flex-row md:justify-between md:gap-0"
            >
              <Link to="/profile">
                <img
                  src={user?.photoURL}
                  alt="profile photo"
                  className="w-36 h-36 object-cover rounded-full 
                border-4 border-white shadow-xl -mt-[50px] 
                md:-mt-[20px] z-10 relative hover:border-[lightgray]
                 transition-all ease-in-out duration-[150ms] md:ml-4"
                />
              </Link>
              <div
                className="info w-[80%] flex flex-col items-center
              justify-center md:items-start"
              >
                <p className="text-2xl ">{user?.displayName}</p>
                <p>{user?.email}</p>
                {user?.emailVerified ? (
                  <p className="text-blue-600 flex items-center ">
                    {" "}
                    verified <MdVerified />
                  </p>
                ) : (
                  <p>Not verified</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bottom mt-10">
          <h1 className="text-2xl mb-4 md:mb-0 text-center md:text-start">
            Your posts
          </h1>

          {userPosts.length > 0 ? (
            <div className="posts flex flex-col">
              {userPosts?.map((post) => (
                <Post
                  post={post}
                  key={post?.id}
                  access={true}
                  setIsEditSectionOpen={setIsEditSectionOpen}
                  setEditPostId={setEditPostId}
                  setGetPost={setGetPost}
                />
              ))}
            </div>
          ) : (
            <h1 className="text-2xl text-center m-auto mt-10 ">
              You haven't posted anything yet{" "}
            </h1>
          )}
        </div>
        {isEditSectionOpen && (
          <EditPost
            setIsEditSectionOpen={setIsEditSectionOpen}
            editPostId={editPostId}
            getPost={getPost}
          />
        )}
      </div>
    </>
  );
};

export default Profile;
