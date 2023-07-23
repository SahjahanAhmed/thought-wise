import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiOutlinePlus } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { useSelector } from "react-redux";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import defaultProfilePhoto from "../media/images/user.jpg";

const SinglePeople = ({ user }) => {
  const [followList, setFollowList] = useState([]);
  const [USER, loading] = useAuthState(auth);
  const { users } = useSelector((store) => store.users);
  const activeUser = users.filter((user) => user.uid == USER.uid)[0];

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

  return (
    <div
      className="shadow-lg border-2 rounded-xl p-2 w-full flex  
 items-start gap-2 hover:shadow-xl transition duration-150"
    >
      <Link to={`/profile/${user?.uid}`}>
        <img
          src={user.profilePhoto || defaultProfilePhoto}
          alt="user photo"
          className="rounded-lg max-w-[120px]"
        />
      </Link>
      <div className="flex items-start justify-between w-full">
        <div>
          <Link to={`/profile/${user.uid}`}>
            <p className="font-semibold">{user.displayName}</p>
          </Link>
          <p className="text-sm">
            {user.emailVerified ? (
              <span className="text-blue-600 flex items-center">
                verified <MdVerified />
              </span>
            ) : (
              "Not verified"
            )}
          </p>
          <p className="inline-flex  text-sm text-gray-600 font-bold mt-2">
            Followers: {user?.follower}
          </p>
          <p className="text-sm  inline-flex w-full   font-semibold text-gray-600 ">
            Posts: {user.posts?.length}
          </p>
        </div>
        <div>
          {user?.uid != USER?.uid ? (
            <>
              {didIFollow ? (
                <p
                  className={`font-semibold text-gray-600 text-sm
                   flex items-center rounded-lg px-2 gap-1  `}
                >
                  Following
                </p>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`font-semibold text-gray-800 flex items-center rounded-lg 
     px-2 gap-1 hover:bg-blue-200 transition duration-150 }`}
                >
                  Follow <AiOutlinePlus className="text-xl" />
                </button>
              )}
            </>
          ) : (
            <p
              className={`font-semibold text-gray-600 text-sm
    flex items-center rounded-lg px-2 gap-1  `}
            >
              You
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePeople;
