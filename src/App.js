import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import { useDispatch } from "react-redux";
import { db } from "./config/firebase";
import ProtectedRoutes from "./ProtectedRoutes";
import { useEffect, useState } from "react";
import { fetchPosts } from "./redux/PostSlice";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fetchUsers } from "./redux/UsersSlice";
import { fetchLikes } from "./redux/LikesSlice";
import People from "./pages/People";
import Suggested from "./pages/Suggested";

const App = () => {
  const [searchModal, setSearchModal] = useState(false);
  const dispatch = useDispatch();

  // fetching users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      let users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      dispatch(fetchUsers(users));
    });
    return unsubscribe;
  }, [dispatch]);

  // fetching likes and likers
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "likes"), (snapshot) => {
      let likes = [];
      snapshot.docs.forEach((doc) => {
        likes.push({ ...doc.data(), id: doc.id });
      });
      dispatch(fetchLikes(likes));
    });
    return unsubscribe;
  }, [dispatch]);

  // fetching posts
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
  }, [dispatch]);

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
            path="/profile/:uid"
            element={
              <Profile
                searchModal={searchModal}
                setSearchModal={setSearchModal}
              />
            }
          />
          <Route
            path="/people"
            element={
              <People
                searchModal={searchModal}
                setSearchModal={setSearchModal}
              />
            }
          />
          <Route
            path="/suggested"
            element={
              <Suggested
                searchModal={searchModal}
                setSearchModal={setSearchModal}
              />
            }
          >
            <Route path="/suggested/:suggestion" />
          </Route>
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
};

export default App;
