import React, { useState } from "react";

import logo from "../../src/media/images/logo.png";
import profilePic from "../../src/media/images/sj-smiling-stareing.jpg";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
const Navbar = () => {
  const [isSignOutButtonOpen, setIsSignOutButtonOpen] = useState(false);
  const [user, loading] = useAuthState(auth);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <div
      className={`w-full bg-white border-b
     shadow flex items-center justify-between
     px-3 py-1 mb-2 sticky top-0 z-50 max-w-[1280px] mx-auto ${
       pathname == "/sign-in" ||
       pathname == "/sign-up" ||
       pathname == "/forgot-password"
         ? "hidden"
         : ""
     }`}
    >
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
          <button
            className="border rounded-lg
           text-gray-500 p-1 ml-2 hover:bg-gray-100"
          >
            Search
          </button>
        </div>
        <div>
          <div
            className="relative"
            onMouseEnter={() => setIsSignOutButtonOpen(true)}
            onMouseLeave={() => setIsSignOutButtonOpen(false)}
          >
            <button
              className={`absolute top-full text-sm w-16 -right-2 border bg-gray-500 text-white py-1 rounded-lg hover:bg-gray-600 transition duration-150 ${
                isSignOutButtonOpen ? "visible" : "hidden"
              }`}
              onClick={() => {
                signOut(auth);
                localStorage.setItem("isAuth", false);
                navigate("/sign-in");
              }}
            >
              Sign out
            </button>
            <Link to={"/profile"}>
              <img
                src={user?.photoURL}
                alt=""
                className=" h-10 w-10  object-cover 
                rounded-full cursor-pointer "
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
