const User = require("../models/User");
const bcrypt = require("bcrypt"); //helps in getting hashed password.
const jwt = require("jsonwebtoken");

const { error, success } = require("../utils/responseWrapper");
const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //we need email, password for that write some logic
    if (!email || !password || !name) {
      //If email and password text feild left empty, return error message
      /*
      return res.status(400).send("All feilds are required");
      */

      return res.send(error(400, "All fields are required!!"));
    }
    const oldUser = await User.findOne({ email });
    // console.log(oldUser);
    if (oldUser) {
      //if user already registered, return conflicted error response.
      // return res.status(409).send("User is already registered");
      return res.send(error(409, "User already registered!!!"));
    }
    // res.send("form signup");
    const hashedPassword = await bcrypt.hash(password, 10); //hash it for 10 rounds
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // return res.status(201).json({
    //   user,
    // });

    return res.send(success(201, "User created successfully!!!"));
  } catch (e) {
    // console.log(error);
    res.send(error(500, e.message));
  }
};
const loginController = async (req, res) => {
  try {
    // res.send("form login");
    const { email, password } = req.body;
    if (!email || !password) {
      // return res.status(400).send("All feilds are required");
      return res.send(error(400, "All fields are required!!!"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // return res.status(409).send("User is not registered");
      res.send(error(409, "User is already registered"));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      // return res.status(403).send("Incorrect Password");
      return res.send(error(403, "Incorrect Password!!!!"));
    }
    const accesstoken = generateAccessToken({
      _id: user._id,
    });
    const refreshtoken = generateRefreshToken({
      _id: user._id,
    });

    res.cookie("jwt", refreshtoken, {
      httpOnly: true,
      secure: true,
    });
    // return res.json({ accesstoken });
    return res.send(success(200, { accesstoken }));
    /*
    Below line of code will directly store accessToken and refreshToken pair in res object
    return res.json({ accesstoken, refreshtoken });
    but we will store this in cookie.
    */
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//this api will check the refresh token validity
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    // return res
    //   .status(401)
    //   .send("Refresh token should be in cookies, but it is not!!");
    return res.send(
      error(401, "Refresh Token should be in cookies, but it is not!!!")
    );
  }
  const refreshToken = cookies.jwt;
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    //now generate access new token
    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });
    // return res.status(201).send({ accessToken });
    return res.send(
      success(201, {
        accessToken,
      })
    );
  } catch (e) {
    console.log(e);
    // return res.status(401).send("Invalid refresh Key");
    return res.send(error(401, "Invalid refresh Key!!!"));
  }
};
const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "User logged out!!!"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
//internal function not to be exported
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController,
};
