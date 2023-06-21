import React, { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaBars } from "react-icons/fa";
import logo from "../../src/media/images/logo.png";
import profilePic from "../../src/media/images/sj-smiling-stareing.jpg";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import SearchBox from "./SearchBox";
import { useSelector } from "react-redux";
const Navbar = ({ setSearchModal, searchModal }) => {
  const { posts } = useSelector((store) => store.posts);
  const [searchTerms, setSearchTerms] = useState("");
  const [navItemsOpen, setNavItemsOpen] = useState(false);
  const [smallScreen, setSmallScreen] = useState(false);
  const [isSignOutButtonOpen, setIsSignOutButtonOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // user
  const [USER, loading] = useAuthState(auth);
  const { users } = useSelector((store) => store.users);
  const user = users.filter((user) => user?.uid == USER?.uid)[0];

  window.addEventListener("resize", () => {
    if (window.innerWidth < 631) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  });

  useEffect(() => {
    if (window.innerWidth < 631) {
      setSmallScreen(true);
    } else {
      setSmallScreen(false);
    }
  }, [window.innerWidth]);

  return (
    <div
      className={`w-full bg-white border-b
     shadow flex items-center justify-between
     px-3 py-1 mb-2 sticky top-0 z-[1000] max-w-[1280px] mx-auto ${
       pathname == "/sign-in" ||
       pathname == "/sign-up" ||
       pathname == "/forgot-password"
         ? "hidden"
         : ""
     }`}
    >
      <div
        onClick={() => {
          setSearchModal(false);
        }}
      >
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
      <div className="flex items-center justify-between ml-4 w-full ">
        <div
          className={`flex relative w-full max-w-[400px] md:ml-20 ${
            smallScreen && "w-[full]"
          }`}
        >
          <input
            type="text"
            placeholder="Search"
            className="border border-blue-200 
            rounded-lg p-1  focus:outline-gray-300 w-full "
            onChange={(e) => setSearchTerms(e.target.value)}
            onClick={() => {
              setSearchModal(true);
            }}
          />
          {/* <button
            className="border rounded-lg
           text-gray-500 p-1 ml-2 hover:bg-gray-100"
          >
            Search
          </button>*/}
        </div>
        {smallScreen && (
          <button
            className="mx-4 text-gray-600 hover:text-gray-700 transition duration-150 relative hover:after:content-['More'] hover:after:text-[13px] hover:after:absolute hover:after:top-[40px] hover:after:shadow-xl hover:after:bg-gray-500 hover:after:text-white hover:after:rounded-lg hover:after:left-[50%] hover:after:translate-x-[-50%] hover:after:px-2 hover:after:py-1.5 hover:after:z-[100]"
            onClick={() => {
              setNavItemsOpen(!navItemsOpen);
              setSearchModal(false);
            }}
          >
            <FaBars className="text-3xl" />
          </button>
        )}
        <div
          className={`nav-items flex mx-10  items-center gap-12 md:gap-28   ${
            smallScreen &&
            " absolute  right-6 gap-12 top-full flex-col bg-white shadow-lg p-4 rounded-lg"
          } ${navItemsOpen && "flex"}
          ${!navItemsOpen && smallScreen && "hidden"}`}
          onClick={() => {
            setSearchModal(false);
          }}
        >
          <button
            className={`relative hover:after:content-['Home'] hover:after:text-[13px] hover:after:absolute hover:after:top-[40px] hover:after:shadow-xl hover:after:bg-gray-500 hover:after:text-white hover:after:rounded-lg hover:after:left-[50%] hover:after:translate-x-[-50%] hover:after:px-2 hover:after:py-1.5 hover:after:z-[100]`}
            onClick={() => setNavItemsOpen(false)}
          >
            <NavLink to={"/"}>
              <AiFillHome className={`text-3xl`} />
            </NavLink>
          </button>

          <button
            className={`relative hover:after:content-['Profile'] hover:after:text-[13px] hover:after:absolute hover:after:top-[40px] hover:after:shadow-xl hover:after:bg-gray-500 hover:after:text-white hover:after:rounded-lg hover:after:left-[50%] hover:after:translate-x-[-50%] hover:after:px-2 hover:after:py-1.5 hover:after:z-[100]`}
            onClick={() => setNavItemsOpen(false)}
          >
            <NavLink to={"/profile"}>
              <CgProfile className="text-3xl" />
            </NavLink>
          </button>
        </div>
        <div>
          <div
            className="relative min-w-[40px]"
            onMouseEnter={() => setIsSignOutButtonOpen(true)}
            onMouseLeave={() => setIsSignOutButtonOpen(false)}
            onClick={() => {
              setSearchModal(false);
            }}
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
            <Link to={`/profile/${user?.uid}`} className="">
              <img
                src={user?.photoURL}
                alt=""
                className=" min-w-10 min-h-10 max-w-10 max-h-10 object-cover 
                rounded-full  cursor-default"
              />
            </Link>
          </div>
        </div>
      </div>
      {searchModal && (
        <SearchBox
          setSearchModal={setSearchModal}
          searchTerms={searchTerms}
          posts={posts}
        />
      )}
    </div>
  );
};

export default Navbar;
