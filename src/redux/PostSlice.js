import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";

const initialState = {
  posts: [],
};
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (posts) => {
    const serializedPosts = posts.map((post) => ({
      ...post,
      createdAt: {
        seconds: post?.createdAt?.seconds,
        nanoseconds: post?.createdAt?.nanoseconds,
      },
    }));
    return serializedPosts;
  }
);

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    loadPost: (state, action) => {
      state.posts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      console.log("posts fetched");
      console.log("posts" + action.payload);
    });
    builder.addCase(fetchPosts.pending, (state, action) => {
      console.log("fetchong posts...");
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      console.log("error occurs while fetching posts");
    });
  },
});

export const { loadPost } = postSlice.actions;
export default postSlice.reducer;
