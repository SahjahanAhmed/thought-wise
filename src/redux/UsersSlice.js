import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const initialState = {
  users: [],
};
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (users) => {
    return users;
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    loadUsers: (state, action) => {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      console.log("users fetched");
      console.log("users" + action.payload);
    });
    builder.addCase(fetchUsers.pending, (state, action) => {
      console.log("fetching users...");
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      console.log("something went wrong with users slice");
    });
  },
});

export const { loadUsers } = usersSlice.actions;
export default usersSlice.reducer;
