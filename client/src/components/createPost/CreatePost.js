import React, { useState } from "react";
import Avatar from "../avatar/Avatar";
import "./CreatePost.scss";
import backgroundDummyImg from "../../assets/dummyImg.jpg";
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from "../../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/appConfigSlice";
import { getUserProfile } from "../../redux/slices/postsSlice";
function CreatePost() {
  const [postImg, setPostImg] = useState("");
  const [captions, setCaptions] = useState("");
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    //encode your file to base64 code
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result);
      }
    };
  };
  const handlePostSubmit = async () => {
    try {
      // dispatch(setLoading(true));
      const result = await axiosClient.post("/posts", {
        captions,
        postImg,
      });
      dispatch(
        getUserProfile({
          userId: myProfile?._id,
        })
      );
    } catch (e) {
      console.log("Error in createPost", e);
      // return Promise.reject(e);
    } finally {
      // dispatch(setLoading(false));
      setCaptions("");
      setPostImg("");
    }
  };
  return (
    <div className="createPost">
      <div className="left-part">
        <Avatar src={myProfile?.avatar?.url} />
      </div>
      <div className="right-part">
        <input
          value={captions}
          type="text"
          className="captionInput"
          placeholder="What's on your mind!!!!"
          onChange={(e) => setCaptions(e.target.value)}
        />
        {postImg && (
          <div className="img-container">
            <img src={postImg} alt="" className="post-img" />
          </div>
        )}
        <div className="bottom-part">
          <div className="input-post-img">
            <label htmlFor="inputImg" className="labelImg">
              {/* <img src={} alt="post-img" />
               */}
              <BsCardImage />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button className="post-btn btn-primary" onClick={handlePostSubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
