import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";
import { Navigate, Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
  // const [USER, loading] = useAuthState(auth);
  // const { users } = useSelector((store) => store.users);
  // const userAccount = users.filter((user) => user.uid == USER.uid)[0];

  const navigate = useNavigate();
  onAuthStateChanged(auth, (user) => {
    if (user == null) {
      navigate("/sign-in");
      localStorage.setItem("isAuth", false);
    }
  });

  const isAuth = JSON.parse(localStorage.getItem("isAuth"));

  return isAuth ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoutes;
