//programs that can be helpful globally can be written here in slice folder.
//set loading (loader) is an example.
//redux thunk works with async function also.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
// import { setLoading } from "./appConfigSlice";
export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (body, thunkAPI) => {
    try {
      // thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.post("/user/getUserProfile", body);
      console.log("api Called data userProfile response: ", response.result);
      return response.result;
    } catch (e) {
      console.log("THis is an error", e);
      return Promise.reject(e);
    }
    // finally {
    //   thunkAPI.dispatch(setLoading(false));
    // }
  }
);

export const likesAndUnlikePost = createAsyncThunk(
  "post/likeAndUnlike",
  async (body, thunkAPI) => {
    try {
      // thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.post("/posts/like", body);

      //   return response.result;
      return response.result.post;
    } catch (e) {
      console.log("THis is an error", e);
      return Promise.reject(e);
    }
    // finally {
    //   thunkAPI.dispatch(setLoading(false));
    // }
  }
);

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    userProfile: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        // console.log("addCase in getInfo", state.myProfile);
      })
      .addCase(likesAndUnlikePost.fulfilled, (state, action) => {
        const post = action.payload;
        const index = state?.userProfile?.posts?.findIndex(
          (item) => item._id === post._id
        );
        if (index !== undefined && index !== -1) {
          state.userProfile.posts[index] = post;
        }
      });
  },
});

export default postSlice.reducer;
