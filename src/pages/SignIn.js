import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { auth, db } from "../config/firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { alertUser } from "./SignUp";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const SignIn = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [password, setpassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const { users } = useSelector((store) => store.users);

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

  //handle signin with email and pass
  const signinWithEmailAndPAssword = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") return;

    // check if email already have an account with it
    const existingAccount = await users?.filter((user) => user.email === email);
    if (existingAccount.length === 0) {
      alertUser("This email don't have an account with it!");
      return;
    }

    if (existingAccount && password.length < 6) {
      alertUser("Too short password, put at least 6 letters");
      return;
    }

    if (existingAccount && existingAccount[0]?.password !== password) {
      alertUser("Wrong password!");
      return;
    }

    await signInWithEmailAndPassword(auth, email, password).then((user) => {
      navigate("/");
      localStorage.setItem("isAuth", true);
      window.location.reload();
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
      <h1 className="text-3xl mt-4">Sign in</h1>
      <div
        className="w-full flex flex-col max-w-[400px]
       bg-white shadow rounded-lg mx-10 my-10 p-4"
      >
        <form
          className="sign-in flex flex-col gap-4"
          onSubmit={signinWithEmailAndPAssword}
        >
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                className="border p-2 rounded-lg w-full"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer flex items-center justify-center top-[50%] translate-y-[-50%] right-4 text-xl"
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
            Sign in
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
            Dont have an account ?{" "}
            <Link to={"/sign-up"} className="text-blue-600">
              Sign up
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

export default SignIn;
