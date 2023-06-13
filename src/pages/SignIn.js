import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const SignIn = () => {
  const provider = new GoogleAuthProvider();
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl mt-4">Sign in</h1>
      <div className="w-full flex flex-col max-w-[400px]
       bg-white shadow rounded-lg mx-10 my-10 p-4">
        <form className="sign-in flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Email"
              className="border p-2 rounded-lg"
            />
            <input
              type="password"
              placeholder="password"
              className="border p-2 rounded-lg"
            />
          </div>
          <button className="bg-blue-600
           text-gray-200 p-2 rounded-lg hover:bg-blue-700
            transition duration-150 font-semibold">
            Sign in
          </button>
        </form>
        <div className="mt-4 flex items-center justify-center text-center
         relative before:border before:flex-[1] after:border after:flex-[1]">
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
