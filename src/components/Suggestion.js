import React, { useEffect, useState } from "react";
import img from "../../src/media/images/sj-smiling-stareing.jpg";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { useSelector } from "react-redux";
import Post from "./Post";
const Suggestion = () => {
  const [suggestedPost, setSuggestedPost] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const { likes } = useSelector((store) => store.likes);
  const { posts } = useSelector((store) => store.posts);

  // const post = posts.filter((post) => post?.id == suggestedPost);

  // users;
  const [USER, loading] = useAuthState(auth);
  const { users } = useSelector((store) => store.users);

  let userWithPosts = users.map((user) => {
    return {
      ...user,
      userPosts: posts.filter((post) => post.userId == user.uid),
    };
  });

  const userWithmostPost = userWithPosts
    .sort((a, b) => {
      return a.userPosts.length - b.userPosts.length;
    })
    .reverse();

  let mostLiked = posts.map((post) => ({
    ...post,
    likes: likes.filter((like) => like.postId == post.id),
  }));
  mostLiked = mostLiked
    .sort((a, b) => {
      return a?.likes[0]?.likes - b?.likes[0]?.likes;
    })
    .reverse();

  return (
    <>
      <div
        className={`max-h-[190px] md:max-h-full
         flex  md:flex-col justify-start
          gap-4 md:flex-[2]  w-full 
          max-w-[500px]  shadow-sm border-2 
          rounded-lg relative md:sticky md:top-[58px] pb-3 px-2 mx-auto
          ${
            !isOpen ? "h-8 md:h-[50px]  overflow-hidden  pb-10 md:pd-0" : ""
          }        `}
      >
        {isOpen && (
          <button
            className="text-xl  text-gray-400
             hover:text-black absolute  md:opacity-1
              -bottom-1 left-[50%] translate-x-[-50%]"
            onClick={() => setIsOpen(false)}
          >
            <FiChevronUp />
          </button>
        )}

        {!isOpen && (
          <button
            className=" text-xl  text-gray-400
             hover:text-black absolute md:opacity-1 
             bottom-0 left-[65%] sm:left-[60%] 
             md:left-[50%] md:translate-x-[-50%] "
            onClick={() => setIsOpen(true)}
          >
            <FiChevronDown />
          </button>
        )}

        <div className="w-full ">
          <h1 className="text-center mb-1 font-semibold text-gray-800">
            Suggested
          </h1>
          <div
            className={`flex  md:flex-col md:p-4 px-4 md:gap-8 ${
              !isOpen ? "mt-10 md:mt-0 " : ""
            }`}
          >
            <div className={`flex-1 md:flex-[0] `}>
              <h1 className="font-semibold text-start text-gray-500">People</h1>
              <ul
                className=" overflow-y-hidden max-h-[120px] 
              md:max-h-[250px] flex flex-col gap-2 items-start relative"
              >
                {userWithmostPost &&
                  userWithmostPost.slice(0, 3).map((user) => {
                    return (
                      <li>
                        <Link
                          to={`/profile/${user?.uid}`}
                          className="flex justify-start items-start
       cursor-pointer hover:text-gray-600"
                        >
                          <img
                            src={user?.photoURL}
                            alt="people"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <span className="ml-1">{user?.displayName}</span>
                        </Link>
                      </li>
                    );
                  })}

                <button
                  className="absolute text-right  
                w-auto right-6   -bottom-1 bg-[#f7f7f7]
                 z-10  text-blue-400 hover:text-blue-700
                  text-sm rounded"
                >
                  ... See more
                </button>
              </ul>
            </div>
            <div
              className={`flex-1 md:flex-[0] overflow-hidden
               max-h-[145px] md:max-h-[220px] flex flex-col
               items-center relative `}
            >
              <button
                className="absolute text-right 
              -bottom-0 right-6 bg-[#f7f7f7] z-10
               w-auto  text-blue-400 hover:text-blue-700
                text-sm rounded"
              >
                ... See more
              </button>
              <h1 className="text-start m-auto  font-semibold text-gray-500">
                Thoughts
              </h1>
              <ul className="w-[80%] md:w-full overflow-hidden flex flex-col items-start gap-2">
                {mostLiked &&
                  mostLiked.slice(0, 3).map((post) => {
                    return (
                      <li>
                        <Link
                          className="hover:text-gray-500 flex relative "
                          onClick={() => setSuggestedPost(post)}
                        >
                          <img
                            src={post.userPhoto}
                            alt="user photo"
                            className="h-6 w-6 rounded-full object-cover absolute"
                          />

                          <span className="ml-7">
                            {post.postText.slice(0, 40) + "  ..."}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Suggestion;
