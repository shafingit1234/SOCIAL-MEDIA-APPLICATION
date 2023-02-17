//programs that can be helpful globally can be written here in slice folder.
//set loading (loader) is an example.
//redux thunk works with async function also.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getMyInfo = createAsyncThunk("user/getMyInfo", async () => {
  try {
    // thunkAPI.dispatch(setLoading(true));
    const response = await axiosClient.get("/user/getMyInfo");
    console.log("api Called data: ", response.result);
    return response.result;
  } catch (e) {
    console.log("THis is an error", e);
    return Promise.reject(e);
  }
  // finally {
  //   thunkAPI.dispatch(setLoading(false));
  // }
});

export const updateMyProfile = createAsyncThunk(
  "user/updateMyProfile",
  async (body) => {
    try {
      // thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.put("/user/", body);
      console.log("api Called data in updateMyProfile: ", response.result);
      return response.result;
    } catch (e) {
      console.log("THis is an error in updateMyProfile", e);
      return Promise.reject(e);
    }
    // finally {
    //   thunkAPI.dispatch(setLoading(false));
    // }
  }
);

const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState: {
    isLoading: false,
    toastData: {},
    myProfile: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toastData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyInfo.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
        // console.log("addCase in getInfo", state.myProfile);
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
        // console.log("addCase in update", state.myProfile);
      });
  },
});

export default appConfigSlice.reducer;
export const { setLoading, showToast } = appConfigSlice.actions;
