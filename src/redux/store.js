import { configureStore } from "@reduxjs/toolkit";
import posts from "../redux/PostSlice";
import users from "./UsersSlice";
import likes from "./LikesSlice";
export const store = configureStore({
  reducer: {
    posts: posts,
    users: users,
    likes: likes,
  },
});
