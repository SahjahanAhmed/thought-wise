import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (posts) => {
    return posts;
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
    });
  },
});

export const { loadPost } = postSlice.actions;
export default postSlice.reducer;
