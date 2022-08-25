const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");
const ContactSchema = new mongoose.Schema({
  username: String,
  email: String,
  query: String,
});

ContactSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Contact", ContactSchema);