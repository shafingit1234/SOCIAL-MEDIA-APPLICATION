const Post = require("../models/Post");
const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/Utils");
const cloudinary = require("cloudinary").v2;
const createPostsController = async (req, res) => {
  try {
    const { captions, postImg } = req.body;
    if (!captions || !postImg) {
      return res.send(
        error(400, "Caption and postImg  is required chutiye!!!")
      );
    }
    const cloudImg = await cloudinary.uploader.upload(postImg, {
      folder: "postImg",
    });
    const owner = req._id;

    const user = await User.findById(req._id);
    const post = await Post.create({
      owner,
      captions,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.url,
      },
    });

    user.posts.push(post._id);
    await user.save();

    // return res.send(success(201, ))
    return res.json(success(200, { post }));
  } catch (e) {
    // console.log("THis is my error sucker!!!###$$$%%%^^^^&&", e);
    return res.send(error(500, e.message));
  }
};

const likeAndUnlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const curUserId = req._id;
    const post = await Post.findById(postId).populate("owner");
    if (!post) {
      return res.send(error(404, "Post not found"));
    }
    if (post.likes.includes(curUserId)) {
      const index = post.likes.indexOf(curUserId);
      post.likes.splice(index, 1);
      // await post.save();
      // return res.send(success(200, "Post unliked!!"));
    } else {
      post.likes.push(curUserId);
      // await post.save();
      // return res.send(success(200, "Post Successfuly Liked"));
    }
    await post.save();
    return res.send(success(200, { post: mapPostOutput(post, req._id) }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updatePostController = async (req, res) => {
  try {
    const { postId, captions } = req.body;
    const curUserId = req._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.send(error(404, "Post not found!!!"));
    }
    if (post.owner.toString() !== curUserId) {
      return res.send(error(403, "only owners can update their posts"));
    }
    if (captions) {
      post.captions = captions;
    }
    await post.save();
    return res.send(success(200, post));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const curUserId = req._id;
    const curUser = await User.findById(curUserId);
    const post = await Post.findById(postId);
    if (!post) {
      return res.send(error(404, "Post not found!!!"));
    }
    if (post.owner.toString() !== curUserId) {
      return res.send(error(403, "only owners can delete their posts!!!"));
    }
    const index = curUser.posts.indexOf(postId);
    curUser.posts.splice(index, 1);
    await curUser.save();
    await post.remove();
    return res.send(success(200, "post deleted successfully!!!"));
  } catch (e) {
    return res.end(error(500, e.message));
  }
};

module.exports = {
  createPostsController,
  likeAndUnlikePost,
  updatePostController,
  deletePost,
};
