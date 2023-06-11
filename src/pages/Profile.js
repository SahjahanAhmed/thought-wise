import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import cover from "../media/images/sj-smiling-stareing.jpg";
import profile from "../media/images/SJ.jpg";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/PostSlice";
const Profile = () => {
  const { posts } = useSelector((store) => store.posts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPosts());
  }, []);
  return (
    <div className="max-w-[1000px] mx-auto w-full sm:w-[80%] flex flex-col ">
      <div className="top flex flex-col shadow pb-4">
        <div>
          <Link to="/profile">
            <img
              src={cover}
              alt="cover photo"
              className="w-full h-[200px] object-cover"
            />
          </Link>
          <div className="flex flex-col items-center gap-2  md:flex-row md:justify-between md:gap-0">
            <Link to="/profile">
              <img
                src={profile}
                alt="profile photo"
                className="w-36 h-36 object-cover rounded-full border-4 border-white shadow-xl -mt-[50px] md:-mt-[20px] z-10 relative hover:border-[lightgray] transition-all ease-in-out duration-[150ms] md:ml-4"
              />
            </Link>
            <div className="info w-[80%] flex flex-col items-center justify-center md:items-start">
              <p className="text-2xl ">Sahjahan Ahmed</p>
              <p>Dakshin surma college</p>
              <p>sylhet bangladesh</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom mt-10">
        <h1 className="text-2xl text-center md:text-start">Your posts</h1>
        <div className="posts max-w-[600px] m-auto py-4">
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
