import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  posts: [],
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", () => {
  return axios
    .get("https://fakestoreapi.com/products/?limit=10")
    .then((res) => res.data);
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
