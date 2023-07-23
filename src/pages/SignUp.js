import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

import { auth, db } from "../config/firebase";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";

const SignUp = () => {
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const { users } = useSelector((store) => store.users);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const usersRef = collection(db, "users");

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      let users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      setAllUsers(users);
    });
    return unsubscribe;
  }, []);

  // handle sign up
  const hanldeSignUp = async (e) => {
    e.preventDefault();
    if (name === "" || email === "" || password == "") return;
    if (password.length < 6) {
      alertUser("Too short password, put at least 6 letters");
      return;
    }

    const existingAccount = await users?.filter((user) => user.email === email);
    if (existingAccount.length > 0) {
      alertUser("This email already have an account with it!");
      return;
    }

    if (!email.includes(".com")) {
      alertUser("Please enter a valid email");
      return;
    }

    await createUserWithEmailAndPassword(auth, email, password).then((user) => {
      addDoc(collection(db, "users"), {
        displayName: name,
        email,
        uid: user?.user?.uid,
        emailVerified: user?.user?.emailVerified,
        profilePhoto: user?.user?.photoURL,
        password,
        coverPhoto: null,
        description: "Hello, welcome to my profile",
        follower: 0,
        following: 0,
      }).then((data) => {
        addDoc(collection(db, "follow"), {
          userId: user?.user?.uid,
          followers: [],
          following: [],
        });

        navigate("/");
        localStorage.setItem("isAuth", true);
        window.location.reload();
      });
    });
  };

  // sign in
  const signIn = async () => {
    const USER = await signInWithPopup(auth, provider);
    const amIHere = await allUsers.filter(
      (user) => user?.uid == USER?.user?.uid
    );
    if (amIHere.length === 0 && USER?.user) {
      addDoc(collection(db, "users"), {
        displayName: USER.user.displayName,
        uid: USER.user.uid,
        profilePhoto: USER.user.photoURL,
        coverPhoto: null,
        email: USER.user.email,
        emailVerified: USER.user.emailVerified,
        follower: 0,
        following: 0,
        description: "Hello, welcome to my profile",
      }).then((data) => {
        addDoc(collection(db, "follow"), {
          userId: USER.user.uid,
          followers: [],
          following: [],
        }).then((data) => {
          navigate("/");
          localStorage.setItem("isAuth", true);
          window.location.reload();
        });
      });
    } else {
      navigate("/");
      localStorage.setItem("isAuth", true);
      window.location.reload();
    }
  };
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl mt-4">Sign up</h1>
      <div
        className="w-full flex flex-col max-w-[400px]
       bg-white shadow rounded-lg mx-10 my-10 p-4"
      >
        <form className="sign-up flex flex-col gap-4" onSubmit={hanldeSignUp}>
          <div className="flex flex-col gap-4">
            <input
              required
              type="text"
              placeholder="Name"
              className="border p-2 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="border p-2 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative w-full">
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="password"
                className="border p-2 rounded-lg w-full"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute flex items-center cursor-pointer justify-center top-[50%] translate-y-[-50%] right-4 text-xl"
              >
                {!showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600
           text-gray-200 p-2 rounded-lg hover:bg-blue-700
            transition duration-150 font-semibold"
          >
            Sign up
          </button>
        </form>
        <div
          className="mt-4 flex items-center justify-center text-center
         relative before:border before:flex-[1] after:border after:flex-[1]"
        >
          <span className="mx-4">OR</span>
        </div>
        <button
          className="bg-cyan-600 text-gray-200 p-2 rounded-lg
           hover:bg-cyan-700 transition duration-150 flex
            items-center justify-center gap-2 mt-4 font-semibold"
          onClick={signIn}
        >
          <FcGoogle className="bg-white rounded-full text-xl" /> Sign in with
          Google
        </button>

        <div className="flex flex-wrap justify-between mt-6">
          <p className="text-sm text-gray-500">
            Already have an account ?{" "}
            <Link to={"/sign-in"} className="text-blue-600">
              Sign in
            </Link>
          </p>
          <p className="text-sm ">
            <Link to={"/forgot-password"} className="text-red-600">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

// alert user
export const alertUser = (alertText) => {
  Toastify({
    text: alertText,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "left",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, red, orange)",
    },
  }).showToast();
};
