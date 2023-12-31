import React, { useEffect } from "react";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { HiPhoto } from "react-icons/hi2";
import { MdVideoLibrary } from "react-icons/md";
import ReactPlayer from "react-player";
import { auth, db, storage } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useSelector } from "react-redux";
import defaultProfilePhoto from "../media/images/user.jpg";

const EditPost = ({ setIsEditSectionOpen, editPostId, getPost }) => {
  const [postText, setPostText] = useState(getPost.postText);
  const [postTo, setPostTo] = useState(getPost.postTo);
  const [shareImage, setShareImage] = useState(getPost.shareImage);
  const [shareVideo, setShareVideo] = useState(getPost.shareVideo);
  const [isLongTextarea, setIsLongTextarea] = useState(false);
  const [isVideoLinkOpen, setIsVideoLinkOpen] = useState(false);
  const postCollection = collection(db, "posts");

  // user
  const [USER, loading] = useAuthState(auth);
  const { users } = useSelector((store) => store.users);
  const user = users.filter((user) => user?.uid == USER?.uid)[0];

  // const handleEditPost = async () => {
  // const postRef = doc(db, "posts", editPostId);
  // const storageRef = ref(storage, `images/${shareImage.name}`);

  // if (shareImage !== getPost?.shareImage) {
  // const uploadImage = uploadBytesResumable(storageRef, shareImage);
  // uploadImage.on(
  // "state_changed",
  // (snapshot) => {
  // const progress = Math.round(
  // (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  // );
  // },
  // (error) => console.log(error),
  // async () => {
  // const url = await getDownloadURL(uploadImage.snapshot.ref);
  // await updateDoc(postRef, {
  // shareImage: url,
  // shareVideo,
  // postText,
  // postTo,
  // });
  // }
  // );
  // }

  const handleEditPost = async () => {
    const postRef = doc(db, "posts", editPostId);
    if (typeof shareImage === "object") {
      const storageRef = ref(storage, `images/${shareImage.name}`);

      const uploadImage = uploadBytesResumable(storageRef, shareImage);
      const snapshot = await uploadImage;
      const url = await getDownloadURL(snapshot.ref);

      // Update the Firestore document with the image URL
      updateDoc(postRef, {
        shareImage: url,
        shareVideo,
        postText,
        postTo,
      });
    } else if (typeof shareImage === "string") {
      await updateDoc(postRef, {
        shareImage: getPost?.shareImage,
        shareVideo,
        postText,
        postTo,
      });
    }
    setIsEditSectionOpen(false);
  };

  return (
    <div
      className=" h-screen w-screen 
  fixed left-0 top-0 right-0 bottom-0 z-[9999]
  flex justify-center p-2 sm:p-4
   bg-[rgba(0,0,0,.8)] animate-fade"
    >
      <div
        className="modal md:w-full w-[90%] max-w-[600px] h-full max-h-[560px] 
    border shadow-md p-4  rounded-lg bg-white flex flex-col gap-4 relative overflow-x-hidden"
      >
        <div className="top flex justify-between ">
          <div>
            <p className="flex">
              <img
                src={user.profilePhoto || defaultProfilePhoto}
                alt="user_photo"
                className="h-12 w-12 rounded-full object-cover "
              />
              <span className="flex flex-col ">
                <span className="font-semibold text-lg ml-2 ">
                  {user.displayName}
                </span>
                <span className="ml-2 ">
                  <select
                    value={postTo}
                    className="rounded-full bg-[#d0ecfa]  p-1 -none text-sm outline-none"
                    onChange={(e) => setPostTo(e.target.value)}
                  >
                    <option value="anyone">Anyone</option>
                    <option value="friends" disabled>
                      Friends
                    </option>
                    <option value="groups" disabled>
                      Groups
                    </option>
                    <option value="only-me">Only me</option>
                  </select>
                </span>
              </span>
            </p>
          </div>
          <button
            onClick={() => setIsEditSectionOpen(false)}
            className="border-2 p-2 rounded-lg h-10 w-10 
          text-center flex justify-center items-center
           hover:bg-gray-200 transition duration-150"
          >
            <GrClose />
          </button>
        </div>
        <div className="middle flex flex-col overflow-y-scroll scrollbar-none">
          <div className="flex relative">
            <textarea
              value={postText}
              placeholder="Write what are you thinking..."
              autoFocus
              className={`w-full  p-1 outline-none resize-none 
             scrollbar-none  rounded-lg  min-h-[80px] ${
               isLongTextarea ? "h-[350px]" : ""
             }`}
              //   value={postText}
              onChange={(e) => {
                setPostText(e.target.value);
              }}
            ></textarea>
            <span
              className=" absolute -bottom-4 left-[50%] 
            rounded-full transition duration-150
             text-gray-500 hover:bg-gray-200
              hover:text-black"
              onClick={(e) => {
                setIsLongTextarea(!isLongTextarea);
              }}
            >
              <FiChevronDown
                className={` ${isLongTextarea ? "rotate-180 " : ""} 
              `}
              />
            </span>
          </div>
          <div className="media max-w-[400px] m-auto my-8 -translate-y-2">
            {shareImage && (
              <img
                src={
                  typeof shareImage == "string"
                    ? shareImage
                    : URL.createObjectURL(shareImage)
                }
                alt="photo"
                className="w-full   rounded-lg  "
              />
            )}
            {isVideoLinkOpen
              ? shareImage == "" && (
                  <input
                    value={shareVideo}
                    onChange={(e) => setShareVideo(e.target.value)}
                    type="text"
                    placeholder="Enter video link here"
                    className="border-2 outline-none shadow rounded-lg px-4 py-[5px] w-[400px] "
                  />
                )
              : ""}
            {shareVideo && <ReactPlayer width={"100%"} url={shareVideo} />}
          </div>
        </div>
        <div
          className="bottom bg-white 
       absolute z-[100] bottom-0 right-0 left-0
       flex items-center justify-between  px-4 py-2"
        >
          <div className="flex gap-6 items-center">
            <div className="flex items-center ">
              <label
                htmlFor="choose-img"
                className="flex cursor-pointer
               text-blue-500 text-4xl hover:opacity-90"
              >
                <HiPhoto />
              </label>
              <input
                disabled={shareVideo ? true : false}
                type="file"
                id="choose-img"
                className="w-0"
                onChange={(e) => setShareImage(e.target.files[0])}
              />
            </div>
            <button
              value={shareVideo}
              disabled={shareImage ? true : false}
              className="text-4xl text-blue-500  hover:opacity-90"
              onClick={() => setIsVideoLinkOpen(!isVideoLinkOpen)}
              onChange={(e) => setShareVideo(e.target.value)}
            >
              <MdVideoLibrary />
            </button>
          </div>
          <button
            className={`border-2 py-1 px-2
           rounded-lg bg-blue-500 text-white
            font-semibold hover:bg-blue-600 ${!postText ? "opacity-[.6]" : ""}`}
            onClick={handleEditPost}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
