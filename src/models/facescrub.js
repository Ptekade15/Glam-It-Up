const mongoose = require("mongoose");

// const passportLocalMongoose = require("passport-local-mongoose");
const  facescrubSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  description: {
      type: String,
      required: true
  },
  price: {
      type: Number,
      required: true
  },
  countInStock: {
      type: Number,
      required: true
  },
  imageUrl:{
      type: String,
      required: true
  }
});

// ShowerGelSchema.plugin(passportLocalMongoose);

const FaceScrub = mongoose.model("facescrub", facescrubSchema);

module.exports = FaceScrub;
