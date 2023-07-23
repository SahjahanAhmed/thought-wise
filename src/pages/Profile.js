import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { AiOutlinePlus, AiOutlineCheckCircle } from "react-icons/ai";
import { TiTickOutline } from "react-icons/ti";
import { Link, useParams } from "react-router-dom";
import cover from "../media/images/cover-photo.png";
import Post from "../components/Post";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import defaultProfilePhoto from "../media/images/user.jpg";
import { auth, db, storage } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import EditPost from "../components/EditPost";
import { FiEdit2 } from "react-icons/fi";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
const Profile = ({ searchModal, setSearchModal }) => {
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [editPostId, setEditPostId] = useState("");
  const [getPost, setGetPost] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [followList, setFollowList] = useState([]);
  const [description, setDescription] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profilePhotoUploading, setProfilePhotoUploading] = useState(false);
  const [coverPhotoUploading, setCoverPhotoUploading] = useState(false);
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
    (followList) => followList.userId === user?.uid
  )[0];
  const activeUserFollowList = followList.filter(
    (followList) => followList.userId == activeUser?.uid
  )[0];
  const didIFollow = userFollowList?.followers.filter(
    (follower) => follower == activeUser?.uid
  )[0];

  // handle follow
  const handleFollow = async () => {
    await updateDoc(doc(db, "follow", userFollowList?.id), {
      followers: [...userFollowList?.followers, activeUser?.uid],
    });
    await updateDoc(doc(db, "follow", activeUserFollowList?.id), {
      following: [...activeUserFollowList?.following, user?.uid],
    });
    await updateDoc(doc(db, "users", user?.id), {
      follower: user?.follower + 1,
    });
    await updateDoc(doc(db, "users", activeUser?.id), {
      following: activeUser?.following + 1,
    });
  };
  // handle unfollow
  const handleUnfollow = async () => {
    await updateDoc(doc(db, "follow", userFollowList?.id), {
      followers: userFollowList?.followers.filter(
        (follwer) => follwer != activeUser?.uid
      ),
    });
    await updateDoc(doc(db, "follow", activeUserFollowList?.id), {
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

  // handle edit description
  const handleEditDesciption = async () => {
    await updateDoc(doc(db, "users", user?.id), {
      description: description,
    });
  };

  // handle update profile photo
  const handleUpdateProfilePhoto = async () => {
    const storageRef = ref(storage, `images/${profilePhoto?.name + v4()}`);
    const uploadImage = uploadBytesResumable(storageRef, profilePhoto);
    try {
      await uploadImage.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot?.bytesTransferred / snapshot?.totalBytes) * 100
          );
          setProfilePhotoUploading(progress);
        },

        (error) => {
          console.log("Error uploading profile photo:", error);
        }
      );
      const downloadURL = await getDownloadURL(uploadImage.snapshot.ref);
      console.log(uploadImage);
      await updateDoc(doc(db, "users", user?.id), {
        profilePhoto: downloadURL,
      });
    } catch (error) {
      console.log("Error updating profile photo in Firestore:", error);
    }
    return;
  };

  // handle update cover photo
  const handleUpdateCoverPhoto = async () => {
    const storageRef = ref(storage, `images/${coverPhoto?.name + v4()}`);
    const uploadImage = uploadBytesResumable(storageRef, coverPhoto);
    try {
      uploadImage.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot?.bytesTransferred / snapshot?.totalBytes) * 100
          );
          setCoverPhotoUploading(progress);
        },
        (error) => {
          console.log("Error uploading cover photo");
        }
      );

      const downloadURL = await getDownloadURL(uploadImage.snapshot.ref);
      console.log(downloadURL);
      updateDoc(doc(db, "users", user?.id), {
        coverPhoto: downloadURL,
      });
    } catch (error) {
      console.log(error);
    }

    return;
  };
  useEffect(() => {
    coverPhoto && handleUpdateCoverPhoto();
    return;
  }, [coverPhoto]);
  useEffect(() => {
    profilePhoto && handleUpdateProfilePhoto();
    return;
  }, [profilePhoto]);

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
          <div className="relative">
            {activeUser?.uid === user?.uid && (
              <label
                htmlFor="coverPhoto"
                className="absolute cursor-pointer top-2 right-2 z-50 bg-slate-300 p-2 rounded-full"
              >
                <FiEdit2 />
              </label>
            )}

            <input
              onChange={(e) => {
                setCoverPhoto(e.target.files[0]);
              }}
              type="file"
              id="coverPhoto"
              className="hidden"
            />
            <img
              src={user?.coverPhoto || cover}
              alt="cover photo"
              className={`w-full h-full max-h-[350px] object-cover ${
                coverPhotoUploading && coverPhotoUploading < 100 && "opacity-40"
              }`}
            />
            <div
              className="flex flex-col items-center gap-2
            md:flex-row md:justify-between md:gap-0"
            >
              <button className="relative">
                {activeUser?.uid === user?.uid && (
                  <label
                    htmlFor="profilePhoto"
                    className="absolute  cursor-pointer bottom-0 right-3 z-50 bg-slate-300 p-2 rounded-full"
                  >
                    <FiEdit2 />
                  </label>
                )}

                <input
                  onChange={(e) => {
                    setProfilePhoto(e.target.files[0]);
                  }}
                  type="file"
                  id="profilePhoto"
                  className="hidden"
                />
                <img
                  src={user?.profilePhoto || defaultProfilePhoto}
                  alt="profile photo"
                  className={`w-36 h-36 object-cover rounded-full 
                border-4 border-white shadow-xl -mt-[50px] 
                md:-mt-[20px] z-10 relative hover:border-[lightgray]
                 transition-all ease-in-out duration-[150ms] md:ml-4 ${
                   profilePhotoUploading &&
                   profilePhotoUploading < 100 &&
                   "opacity-50"
                 }`}
                />
              </button>
              <div
                className="info w-[80%] flex flex-col md:flex-row md:justify-evenly items-center
              justify-center md:items-start "
              >
                <div className="flex flex-col items-center mb-4 md:mb-0">
                  <p className="text-2xl ">{user?.displayName}</p>
                  <div className="relative">
                    {" "}
                    {!editing && (
                      <p className="max-w-[250px] ">{user?.description}</p>
                    )}
                    {editing && (
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    )}
                    {editing && activeUser?.uid === user?.uid && (
                      <button
                        onClick={() => {
                          setEditing(false);
                          handleEditDesciption();
                        }}
                        className="absolute cursor-pointer  -bottom-4 text-[20px] -right-10 z-50 bg-slate-300 p-2 rounded-full "
                      >
                        <TiTickOutline />
                      </button>
                    )}
                    {activeUser?.uid === user?.uid && (
                      <button
                        onClick={() => {
                          setEditing(!editing);
                          setDescription(user?.description);
                        }}
                        className="absolute cursor-pointer  -top-4 -right-10 z-50 bg-slate-300 p-2 rounded-full"
                      >
                        <FiEdit2 />
                      </button>
                    )}
                  </div>{" "}
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
                      hover:bg-blue-600 transition duration-150 "
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
                    <Link className="font-semibold text-gray-800 hover:text-black transition duration-150 cursor-default">
                      Followers: {user?.follower}
                    </Link>
                    <Link className="font-semibold text-gray-800 hover:text-black transition duration-150 cursor-default">
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
            {activeUser?.uid === user?.uid ? "Your posts" : "Posts"}
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
              {activeUser?.uid === user?.uid ? "You" : user?.displayName}{" "}
              haven't posted anything yet{" "}
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
