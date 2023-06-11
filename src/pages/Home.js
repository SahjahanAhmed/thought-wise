import React, { useEffect, useState } from "react";
import Suggestion from "../components/Suggestion";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/PostSlice";
import { FiPlus } from "react-icons/fi";
import CreatePostModal from "../components/CreatePostModal";
const Home = () => {
  const [isModal, setIsModal] = useState(false);
  const { posts } = useSelector((store) => store.posts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPosts());
  }, []);
  return (
    <div className="overflow-x-hidden">
      {isModal && <CreatePostModal />}
      <div className="max-w-[1000px] mx-auto w-full md:w-[80%] flex flex-col  items-center md:items-start md:flex-row md:gap-6">
        <Suggestion />

        <div className="xs:flex-[5] ml-2 xs:-ml-0 md:border md:shadow-sm rounded-lg flex flex-col items-center ">
          <div className="flex flex-col">
            <button
              className="w-full border shadow p-4 rounded-full my-4 bg-slate-100 text-gray-800 hover:bg-slate-200 hover:text-black transition duration-150 font-semibold flex items-center gap-2"
              onClick={() => setIsModal(true)}
            >
              <FiPlus className="text-2xl" /> Share a Thought
            </button>
          </div>
          <div className="flex flex-col">
            {posts?.map((post) => {
              return <Post key={post.id} post={post} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
