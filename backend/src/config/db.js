var mongoose = require("mongoose");

function dbConnect() {
  mongoose.connect(process.env.MONGO_URL);
  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function callback() {
    console.log("DB Connection Successfully");
  });
}

module.exports = dbConnect;
