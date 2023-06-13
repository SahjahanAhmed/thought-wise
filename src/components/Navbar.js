import React from "react";

import logo from "../../src/media/images/logo.png";
import profilePic from "../../src/media/images/sj-smiling-stareing.jpg";
import { Link } from "react-router-dom";
const Navbar = () => {

  return (
    <div className="w-full bg-white border-b
     shadow flex items-center justify-between
     px-3 py-1 mb-2 sticky top-0 z-50 max-w-[1280px] mx-auto">
      <div className="flex-1">
        <Link to={"/"}>
          <img
            src={logo}
            alt="logo"
            className="w-10 rounded-full border-2
             border-gray-200 hover:border-gray-300 
             transition duration-150"
          />
        </Link>
      </div>
      <div className="flex items-center justify-between flex-[5]">
        <div className="whitespace-nowrap w-[50%]">
          <input
            type="text"
            placeholder="Search"
            className="border border-blue-200 
            rounded-lg p-1  focus:outline-gray-300 w-full"
          />
          <button className="border rounded-lg
           text-gray-500 p-1 ml-2 hover:bg-gray-100">
            Search
          </button>
        </div>
        <div>
          <div>
            <Link to={"/profile"}>
              <img
                src={profilePic}
                alt=""
                className=" h-10 w-10  object-cover 
                rounded-full cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
