import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import "./Profile.scss";
import userImg from "../../assets/userAvatar.png";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../createPost/CreatePost";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
function Profile() {
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const dispatch = useDispatch();
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const params = useParams();
  const userProfile = useSelector((state) => state.postsReducer.userProfile);
  const feedData = useSelector((state) => state.feedDataReducer.feedData);
  // console.log("This is userProfile", userProfile);
  useEffect(() => {
    dispatch(
      getUserProfile({
        userId: params.userId,
      })
    );
    setIsMyProfile(myProfile?._id === params.userId);
    setIsFollowing(
      feedData?.followings?.find((item) => item._id === params.userId)
    );
  }, [myProfile, params.userId, feedData]);
  function handleUserFollow() {
    dispatch(
      followAndUnfollowUser({
        userIdToFollow: params.userId,
      })
    );
  }
  // console.log("THis is user Profile in profile.js", userProfile);
  return (
    <div className="Profile">
      <div className="container">
        <div className="left-part">
          {isMyProfile && <CreatePost />}
          {/* <Post />
          <Post />
          <Post />
          <Post /> */}
          {userProfile?.posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img className="user-img" src={userProfile?.avatar?.url} alt="" />
            <h3 className="user-name">{userProfile?.name}</h3>
            <p className="bio">{userProfile?.bio}</p>
            <div className="follower-info">
              <h4>{`${userProfile?.followers?.length} Followers!!!`}</h4>
              <h4>{`${userProfile?.followings?.length} Followings!!!`}</h4>
            </div>
            {!isMyProfile && (
              // <button className="follow btn-primary">Follow</button>
              <h5
                style={{ marginTop: "10px" }}
                onClick={handleUserFollow}
                className={
                  isFollowing ? "hover-link follow-link" : "btn-primary"
                }
              >
                {isFollowing ? `Unfollow!!` : `Follow!!`}
              </h5>
            )}
            {isMyProfile && (
              <button
                className="update-profile btn-secondary"
                onClick={() => {
                  navigate("/updateProfile");
                }}
              >
                Update Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;