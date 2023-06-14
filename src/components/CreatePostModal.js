import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { GrClose } from "react-icons/gr";
import { HiPhoto } from "react-icons/hi2";
import img from "../media/images/SJ.jpg";
import { FiChevronDown } from "react-icons/fi";
import { MdVideoLibrary } from "react-icons/md";
import { collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
const CreatePostModal = ({ setIsModal }) => {
  const [user, loading] = useAuthState(auth);
  const [postText, setPostText] = useState("");
  const [postTo, setPostTo] = useState("anyone");
  const [shareImage, setShareImage] = useState("");
  const [shareVideo, setShareVideo] = useState("");
  const [isLongTextarea, setIsLongTextarea] = useState(false);
  const [isVideoLinkOpen, setIsVideoLinkOpen] = useState(false);
  const postCollection = collection(db, "posts");
  const handleCreatePost = async () => {
    await addDoc(postCollection, {
      postText,
      shareImage: shareImage ? URL.createObjectURL(shareImage) : "",
      shareVideo,
      postTo,
      userPhoto: user.photoURL,
      userName: user.displayName,
      createdAt: serverTimestamp(),
    });
  };
  return (
    <div
      className=" h-screen w-screen 
    fixed left-0 top-0 right-0 bottom-0 z-[999]
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
                src={img}
                alt="user_photo"
                className="h-14 w-14 rounded-full object-cover "
              />
              <span className="flex flex-col ">
                <span className="font-semibold text-lg ml-2 ">
                  Sahjahan Ahmed
                </span>
                <span className="ml-2 ">
                  <select
                    className="rounded-full bg-[#d0ecfa]  p-1 -none text-sm outline-none"
                    onChange={(e) => setPostTo(e.target.value)}
                  >
                    <option value="anyone">Anyone</option>
                    <option value="friends">Friends</option>
                    <option value="groups">Groups</option>
                    <option value="only-me">Only me</option>
                  </select>
                </span>
              </span>
            </p>
          </div>

          <button
            onClick={() => setIsModal(false)}
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
              placeholder="Write what are you thinking..."
              autoFocus
              className={`w-full  p-1 outline-none resize-none 
               scrollbar-none  rounded-lg  min-h-[80px] ${
                 isLongTextarea ? "h-[350px]" : ""
               }`}
              value={postText}
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
                src={URL.createObjectURL(shareImage)}
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
              font-semibold hover:bg-blue-600 ${
                !postText ? "opacity-[.6]" : ""
              }`}
            onClick={handleCreatePost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
