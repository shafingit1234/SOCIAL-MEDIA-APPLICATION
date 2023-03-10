const router = require("express").Router();
const postsController = require("../controllers/postsController");

const requireUser = require("../middlewares/requireUser");
// router.get("/all", requireUser, postsController.getAllPostsController);
router.post("/", requireUser, postsController.createPostsController);
router.put("/", requireUser, postsController.updatePostController);
router.delete("/", requireUser, postsController.deletePost);
router.post("/like", requireUser, postsController.likeAndUnlikePost);

module.exports = router;
