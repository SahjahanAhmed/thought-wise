import { configureStore } from "@reduxjs/toolkit";
import posts from "../redux/PostSlice";
export const store = configureStore({
  reducer: {
    posts: posts,
  },
});
