import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";
import ProtectedRoutes from "./ProtectedRoutes";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <Navbar />
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} exact />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Provider>
  );
};

export default App;
