const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { error } = require("../utils/responseWrapper");
module.exports = async (req, res, next) => {
  //   console.log("I am inside a middleware");
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    // return res.status(401).send("Authorization header is required");
    return res.send(error(401, "Authorization header is required"));
  }
  //get the accesstoken
  const accessToken = req.headers.authorization.split(" ")[1];
  //check whether accessToken is valid or not.
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req._id = decoded._id; //This middleware has added decode._id so that it can be used by other middlewares.
    const user = await User.findById(req._id);
    if (!user) {
      return res.send(error(404, "User Not Found!!!"));
    }
    next();
  } catch (e) {
    //if invalid we will get an error.
    console.log(e);
    // return res.status(401).send("Invalid access key");
    return res.send(error(401, "Invalid access key"));
  }
  //   console.log(accessToken);
  //   next();
};
