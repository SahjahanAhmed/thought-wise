import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
    });
  },
});

export const { loadLikes } = likesSlice.actions;
export default likesSlice.reducer;
