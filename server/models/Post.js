const mongoose = require("mongoose");
const postSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    image: {
      publicId: String,
      url: String,
    },
    captions: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true, //gives timestamps when updation happened or when creation happened.
  }
);

module.exports = mongoose.model("post", postSchema);
