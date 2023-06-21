import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import { store } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./config/firebase";
import ProtectedRoutes from "./ProtectedRoutes";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { fetchPosts } from "./redux/PostSlice";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const App = () => {
  const [searchModal, setSearchModal] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let posts = [];
      snapshot.docs.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
      dispatch(fetchPosts(posts));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="App">
      <Navbar setSearchModal={setSearchModal} searchModal={searchModal} />
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route
            path="/"
            element={
              <Home searchModal={searchModal} setSearchModal={setSearchModal} />
            }
            exact
          />
          <Route
            path="/profile"
            element={
              <Profile
                searchModal={searchModal}
                setSearchModal={setSearchModal}
              />
            }
          />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
};

export default App;
