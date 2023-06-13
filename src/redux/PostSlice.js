import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const initialState = {
  posts: [],
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const data = await getDocs(collection(db, "posts"));
  let finalPost = [];
  const fData = data.docs.forEach((doc) =>
    finalPost.push({ ...doc.data(), id: doc.id })
  );
  return finalPost;
});

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    loadPost: (state, action) => {
      console.log(action.payload);
      state.posts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
  },
});

export const { loadPost } = postSlice.actions;
export default postSlice.reducer;
