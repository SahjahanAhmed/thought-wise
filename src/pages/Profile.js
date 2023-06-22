import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { AiOutlinePlus, AiOutlineCheckCircle } from "react-icons/ai";
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
  updateDoc,
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
  const [followList, setFollowList] = useState([]);

  const { uid } = useParams();
  // user
  const [USER, loading] = useAuthState(auth);
  const { users } = useSelector((store) => store.users);
  const user = users.filter((user) => user?.uid == uid)[0];

  const activeUser = users.filter((user) => user?.uid == USER?.uid)[0];
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
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "follow"), (snapshot) => {
      let followList = [];
      snapshot.docs.forEach((doc) => {
        followList.push({ ...doc.data(), id: doc.id });
      });
      setFollowList(followList);
    });
    return unsubscribe;
  }, []);

  const userFollowList = followList.filter(
    (followList) => followList.userId == user?.uid
  )[0];
  const activeUserFollowList = followList.filter(
    (followList) => followList.userId == activeUser?.uid
  )[0];
  const didIFollow = userFollowList?.followers.filter(
    (follower) => follower == activeUser?.uid
  )[0];
  // handle follow
  const handleFollow = async () => {
    await updateDoc(doc(db, "follow", userFollowList.id), {
      followers: [...userFollowList.followers, activeUser?.uid],
    });
    await updateDoc(doc(db, "follow", activeUserFollowList.id), {
      following: [...activeUserFollowList.following, user?.uid],
    });
    await updateDoc(doc(db, "users", user?.id), {
      follower: user?.follower + 1,
    });
    await updateDoc(doc(db, "users", activeUser?.id), {
      following: activeUser?.following + 1,
    });
  };
  // handle follow
  const handleUnfollow = async () => {
    await updateDoc(doc(db, "follow", userFollowList.id), {
      followers: userFollowList?.followers.filter(
        (follwer) => follwer != activeUser?.uid
      ),
    });
    await updateDoc(doc(db, "follow", activeUserFollowList.id), {
      following: activeUserFollowList?.following.filter(
        (following) => following != user?.uid
      ),
    });
    await updateDoc(doc(db, "users", user?.id), {
      follower: user?.follower - 1,
    });
    await updateDoc(doc(db, "users", activeUser?.id), {
      following: activeUser?.following - 1,
    });
  };
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
                className="info w-[80%] flex flex-col md:flex-row md:justify-evenly items-center
              justify-center md:items-start "
              >
                <div className="flex flex-col items-center mb-4 md:mb-0">
                  <p className="text-2xl ">{user?.displayName}</p>
                  <p>{user?.email}</p>
                  {user?.emailVerified ? (
                    <p className="text-blue-600 flex items-center gap-1 ">
                      {" "}
                      verified <MdVerified />
                    </p>
                  ) : (
                    <p>Not verified</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 ">
                  {activeUser?.uid != user?.uid &&
                    (didIFollow ? (
                      <button
                        onClick={handleUnfollow}
                        className="text font-semibold flex items-center justify-center gap-1 border-shadow
                     bg-blue-500 py-2 px-3 rounded-full text-white
                      hover:bg-blue-600 transition duration-150"
                      >
                        Following
                        <AiOutlineCheckCircle className="mt-1" />
                      </button>
                    ) : (
                      <button
                        onClick={handleFollow}
                        className="text font-semibold flex items-center justify-center gap-1 border-shadow
                     bg-blue-500 py-2 px-3 rounded-full text-white hover:bg-blue-600
                      transition duration-150"
                      >
                        Follow <AiOutlinePlus />
                      </button>
                    ))}
                  <div className="flex items-center gap-4">
                    <Link className="font-semibold text-gray-800 hover:text-black transition duration-150">
                      Followers: {user?.follower}
                    </Link>
                    <Link className="font-semibold text-gray-800 hover:text-black transition duration-150">
                      Following: {user?.following}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom mt-10">
          <h1 className="text-2xl mb-4 md:mb-0 text-center md:text-start">
            {USER?.uid === user?.uid ? "Your posts" : "Posts"}
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
