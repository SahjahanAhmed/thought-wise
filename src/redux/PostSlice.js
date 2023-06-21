import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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
