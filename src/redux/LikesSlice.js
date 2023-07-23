import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
const initialState = {
  likes: [],
};
export const fetchLikes = createAsyncThunk(
  "likes/fetchLikes",
  async (likes) => {
    return likes;
  }
);

export const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    loadLikes: (state, action) => {
      state.likes = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchLikes.fulfilled, (state, action) => {
      state.likes = action.payload;
      console.log("likes fetched");
      console.log("likes" + action.payload);
    });
    builder.addCase(fetchLikes.pending, (state, action) => {
      console.log("fetching likes...");
    });
    builder.addCase(fetchLikes.rejected, (state, action) => {
      console.log("error occurs on while fetching post");
    });
  },
});

export const { loadLikes } = likesSlice.actions;
export default likesSlice.reducer;
