const express = require("express");
//configure dotenv to access env variables.
const dotenv = require("dotenv");
const dbConnect = require("./dbConnect");
const morgan = require("morgan");
//cookie-parser middleware to store cookie in middleware.
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routers/authRouter");
const postsRouter = require("./routers/postsRouter");
const userRouter = require("./routers/userRouter");
dotenv.config("./.env");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();

//All middlewares goes here...
//recommended middleware
app.use(express.json({ limit: "10mb" }));
//morgan middleware
app.use(morgan("common"));
//cookieParser middleware;
app.use(cookieParser());
//cors pass middleware
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// Configuration

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
//to send something for verifying port working or not write below code.
app.get("/", (req, res) => {
  res.status(200).send("ok from server");
  //to check it go to insomnia
});

const PORT = process.env.PORT || 4001; //we will get the port from env private file.

dbConnect();
app.listen(PORT, () => {
  console.log(`listening on port : ${PORT}`);
});
