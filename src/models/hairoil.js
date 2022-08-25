const mongoose = require("mongoose");

// const passportLocalMongoose = require("passport-local-mongoose");
const hairoilSchema = new mongoose.Schema({
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

const HairOil = mongoose.model("hairoil", hairoilSchema);

module.exports = HairOil;