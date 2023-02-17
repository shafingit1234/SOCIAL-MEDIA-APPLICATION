import { configureStore } from "@reduxjs/toolkit";
//all reducers will be defined here.
import appConfigReducer from "./slices/appConfigSlice";
import postsReducer from "./slices/postsSlice";
import feedDataReducer from "./slices/feedSlice";
export default configureStore({
  reducer: {
    appConfigReducer,
    postsReducer,
    feedDataReducer,
  },
});
