const mongoose = require("mongoose");

module.exports = async () => {
  const mongUri =
    "mongodb+srv://<ADMIN>:<PASSWORD>@cluster0.ovnqpnd.mongodb.net/?retryWrites=true&w=majority";
  try {
    const connect = await mongoose.connect(mongUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDb connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
