//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require('body-parser');
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./src/models/user")
const Contact = require("./src/models/contact")
const ejs = require('ejs');
const port = process.env.PORT || 3000;
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.KEYID,
  key_secret: process.env.KEYSECRET,
})


//Models
const ShowerGel = require("./src/models/showergel");
const BodyScrub = require("./src/models/bodyscrub");
const BodySoap = require("./src/models/bodysoap");
const BodyLotion = require("./src/models/bodylotion");
const BodyButter = require("./src/models/bodybutter");
const BodyMist = require("./src/models/bodymist");
const Perfume = require("./src/models/perfume");
const Conditioner = require("./src/models/conditioner");
const Shampoo = require("./src/models/shampoo");
const HairMask = require("./src/models/hairmask");
const HairOil = require("./src/models/hairoil");
const HairSerum = require("./src/models/hairserum");
const FaceMask = require("./src/models/facemask");
const FaceSerum = require("./src/models/faceserums");
const FaceWash = require("./src/models/facewash");
const FaceScrub = require("./src/models/facescrub");

//Data
const showergeldata = require("./src/data/Body&Bath/showergel");
const bodyscrubdata = require("./src/data/Body&Bath/bodyscrub");
const bodysoapdata = require("./src/data/Body&Bath/bodysoap");
const bodylotiondata = require("./src/data/Body&Bath/bodylotion");
const bodybutterdata = require("./src/data/Body&Bath/bodybutter");
const bodymistdata = require("./src/data/Fragrance/bodymist");
const perfumedata = require("./src/data/Fragrance/perfume");
const conditionerdata = require("./src/data/HairCare/conditioner");
const shampoodata = require("./src/data/HairCare/shampoo");
const hairoildata = require("./src/data/HairCare/hairoil");
const hairserumdata = require("./src/data/HairCare/hairserum");
const facemaskdata = require("./src/data/SkinCare/facemask");
const faceserumdata = require("./src/data/SkinCare/faceserum");
const facewashdata = require("./src/data/SkinCare/facewash");
const facescrubdata = require("./src/data/SkinCare/facescrub");




//settings views and templating engines and Databases with sessions
mongoose.connect("mongodb://localhost/testDB", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(require("express-session")({
  secret: "Glamit",
  resave: false,
  saveUninitialized: false
}));

// Data Imports and Deletes for every section
const importData = async () => {
  try {
    //Product Data Import
    await ShowerGel.deleteMany({});
    await ShowerGel.insertMany(showergeldata);
    await BodyButter.deleteMany({});
    await BodyButter.insertMany(bodybutterdata);
    await BodyLotion.deleteMany({});
    await BodyLotion.insertMany(bodylotiondata);
    await BodyMist.deleteMany({});
    await BodyMist.insertMany(bodymistdata);
    await BodyScrub.deleteMany({});
    await BodyScrub.insertMany(bodyscrubdata);
    await BodySoap.deleteMany({});
    await BodySoap.insertMany(bodysoapdata);
    await Conditioner.deleteMany({});
    await Conditioner.insertMany(conditionerdata);
    await FaceMask.deleteMany({});
    await FaceMask.insertMany(facemaskdata);
    await FaceScrub.deleteMany({});
    await FaceScrub.insertMany(facescrubdata);
    await FaceSerum.deleteMany({});
    await FaceSerum.insertMany(faceserumdata);
    await FaceWash.deleteMany({});
    await FaceWash.insertMany(facewashdata);
    await HairOil.deleteMany({});
    await HairOil.insertMany(hairoildata);
    await HairSerum.deleteMany({});
    await HairSerum.insertMany(hairserumdata);
    await Perfume.deleteMany({});
    await Perfume.insertMany(perfumedata);
    await Shampoo.deleteMany({});
    await Shampoo.insertMany(shampoodata);

    console.log("Data import Success");
  } catch (error) {
    console.error("Error while importing the Data");
  }
}

importData();

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", isLoggedIn, function (req, res) {
  res.render('index',{username: req.user.username});
});


app.get("/login", function (req, res) {
  res.render("lr");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function (req, res) {

});

app.post("/register", async function (req, res) {
  User.register(new User({
    username: req.body.username,
    email: req.body.email,
    mobile: req.body.mobile,
    address: req.body.address,
  }), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/login")
    })
  })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/contactus", function (req, res) {
  res.render('contactus');
});

app.post("/contactus", function (req, res) {
  try{
    const contactUs = new Contact({
      username: req.body.username,
      email: req.body.email,
      query: req.body.query
    })
    contactUs.save();
    res.redirect("/contactus")
  }catch (error) {
    res.status(500).send(error);
  }
})
app.get("/aboutus", function (req, res) {
  res.render('aboutus');
});
app.get("/blog", function (req, res) {
  res.render('blogmain');
});
app.get("/blog1", function (req, res) {
  res.render('firstblog');
});
app.get("/blog2", function (req, res) {
  res.render('secondblog');
});
app.get("/blog3", function (req, res) {
  res.render('thirdblog');
});
app.get("/blog4", function (req, res) {
  res.render('fourthblog');
});
app.get("/blog5", function (req, res) {
  res.render('fifthblog');
});
app.get("/blog6", function (req, res) {
  res.render('sixthblog');
});
app.get("/consumerpolicy", function (req, res) {
  res.render('consumerpolicy');
});


app.get("/showergelallproducts", async (req, res) => {
  try {
    const showergels = await ShowerGel.find({});
    res.render('showergelproductdetails', { showergels: showergels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/showergelallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  ShowerGel.findOne({ _id: requestedId }, function (err, showergel) {
    if (!err) {
      res.render("preproductshowergel", {
        id: requestedId,
        name: showergel.name,
        imageUrl: showergel.imageUrl,
        description: showergel.description,
        price: showergel.price,
        counterInStock: showergel.countInStock,
      });
    };
  });
});

app.get("/addShowerGel/:id", function (req, res) {
  const requestedId = req.params.id;

  ShowerGel.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/bodybutterallproducts", async (req, res) => {
  try {
    const bodybutters = await BodyButter.find({});
    res.render('bodybutterproductdetails', { bodybutters: bodybutters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/bodybutterallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  BodyButter.findOne({ _id: requestedId }, function (err, bodybutter) {
    if (!err) {
      res.render("preproductbodybutter", {
        id: requestedId,
        name: bodybutter.name,
        imageUrl: bodybutter.imageUrl,
        description: bodybutter.description,
        price: bodybutter.price,
        counterInStock: bodybutter.countInStock,
      });
    };
  });
});

app.get("/addBodyButter/:id", function (req, res) {
  const requestedId = req.params.id;

  BodyButter.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/bodylotionallproducts", async (req, res) => {
  try {
    const bodylotions = await BodyLotion.find({});
    res.render('bodylotionproductdetails', { bodylotions: bodylotions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/bodylotionallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  BodyLotion.findOne({ _id: requestedId }, function (err, bodylotion) {
    if (!err) {
      res.render("preproductbodylotion", {
        id: requestedId,
        name: bodylotion.name,
        imageUrl: bodylotion.imageUrl,
        description: bodylotion.description,
        price: bodylotion.price,
        counterInStock: bodylotion.countInStock,
      });
    };
  });
});

app.get("/addBodyLotion/:id", function (req, res) {
  const requestedId = req.params.id;

  BodyLotion.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/bodyscruballproducts", async (req, res) => {
  try {
    const bodyscrubs = await BodyScrub.find({});
    res.render('bodyscrubproductdetails', { bodyscrubs: bodyscrubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/bodyscruballproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  BodyScrub.findOne({ _id: requestedId }, function (err, bodyscrub) {
    if (!err) {
      res.render("preproductbodyscrub", {
        id: requestedId,
        name: bodyscrub.name,
        imageUrl: bodyscrub.imageUrl,
        description: bodyscrub.description,
        price: bodyscrub.price,
        counterInStock: bodyscrub.countInStock,
      });
    };
  });
});

app.get("/addBodyScrub/:id", function (req, res) {
  const requestedId = req.params.id;

  BodyScrub.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/bodysoapallproducts", async (req, res) => {
  try {
    const bodysoaps = await BodySoap.find({});
    res.render('bodysoapproductdetails', { bodysoaps: bodysoaps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/bodysoapallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  BodySoap.findOne({ _id: requestedId }, function (err, bodysoap) {
    if (!err) {
      res.render("preproductbodysoap", {
        id: requestedId,
        name: bodysoap.name,
        imageUrl: bodysoap.imageUrl,
        description: bodysoap.description,
        price: bodysoap.price,
        counterInStock: bodysoap.countInStock,
      });
    };
  });
});

app.get("/addBodySoap/:id", function (req, res) {
  const requestedId = req.params.id;

  BodySoap.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/bodymistallproducts", async (req, res) => {
  try {
    const bodymists = await BodyMist.find({});
    res.render('bodymistproductdetails', { bodymists: bodymists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/bodymistallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  BodyMist.findOne({ _id: requestedId }, function (err, bodymist) {
    if (!err) {
      res.render("preproductbodymist", {
        id: requestedId,
        name: bodymist.name,
        imageUrl: bodymist.imageUrl,
        description: bodymist.description,
        price: bodymist.price,
        counterInStock: bodymist.countInStock,
      });
    };
  });
});

app.get("/addBodyMist/:id", function (req, res) {
  const requestedId = req.params.id;

  BodyMist.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/perfumeallproducts", async (req, res) => {
  try {
    const perfumes = await Perfume.find({});
    res.render('perfumeproductdetails', { perfumes: perfumes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/perfumeallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  Perfume.findOne({ _id: requestedId }, function (err, perfume) {
    if (!err) {
      res.render("preproductperfume", {
        id: requestedId,
        name: perfume.name,
        imageUrl: perfume.imageUrl,
        description: perfume.description,
        price: perfume.price,
        counterInStock: perfume.countInStock,
      });
    };
  });
});

app.get("/addPerfume/:id", function (req, res) {
  const requestedId = req.params.id;

  Perfume.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/conditionerallproducts", async (req, res) => {
  try {
    const conditioners = await Conditioner.find({});
    res.render('conditionerproductdetails', { conditioners: conditioners });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/conditionerallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  Conditioner.findOne({ _id: requestedId }, function (err, conditioner) {
    if (!err) {
      res.render("preproductconditioner", {
        id: requestedId,
        name: conditioner.name,
        imageUrl: conditioner.imageUrl,
        description: conditioner.description,
        price: conditioner.price,
        counterInStock: conditioner.countInStock,
      });
    };
  });
});

app.get("/addConditioner/:id", function (req, res) {
  const requestedId = req.params.id;

  Conditioner.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/hairoilallproducts", async (req, res) => {
  try {
    const hairoils = await HairOil.find({});
    res.render('hairoilproductdetails', { hairoils: hairoils });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/hairoilallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  HairOil.findOne({ _id: requestedId }, function (err, hairoil) {
    if (!err) {
      res.render("preproducthairoil", {
        id: requestedId,
        name: hairoil.name,
        imageUrl: hairoil.imageUrl,
        description: hairoil.description,
        price: hairoil.price,
        counterInStock: hairoil.countInStock,
      });
    };
  });
});

app.get("/addHairOil/:id", function (req, res) {
  const requestedId = req.params.id;

  HairOil.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/hairserumallproducts", async (req, res) => {
  try {
    const hairserums = await HairSerum.find({});
    res.render('hairserumproductdetails', { hairserums: hairserums });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/hairserumallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  HairSerum.findOne({ _id: requestedId }, function (err, hairserum) {
    if (!err) {
      res.render("preproducthairserum", {
        id: requestedId,
        name: hairserum.name,
        imageUrl: hairserum.imageUrl,
        description: hairserum.description,
        price: hairserum.price,
        counterInStock: hairserum.countInStock,
      });
    };
  });
});

app.get("/addHairSerum/:id", function (req, res) {
  const requestedId = req.params.id;

  HairSerum.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/shampooallproducts", async (req, res) => {
  try {
    const shampoos = await Shampoo.find({});
    res.render('shampooproductdetails', { shampoos: shampoos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/shampooallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  Shampoo.findOne({ _id: requestedId }, function (err, shampoo) {
    if (!err) {
      res.render("preproductshampoo", {
        id: requestedId,
        name: shampoo.name,
        imageUrl: shampoo.imageUrl,
        description: shampoo.description,
        price: shampoo.price,
        counterInStock: shampoo.countInStock,
      });
    };
  });
});

app.get("/addShampoo/:id", function (req, res) {
  const requestedId = req.params.id;

  Shampoo.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/facemaskallproducts", async (req, res) => {
  try {
    const facemasks = await FaceMask.find({});
    res.render('facemaskproductdetails', { facemasks: facemasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/facemaskallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  FaceMask.findOne({ _id: requestedId }, function (err, facemask) {
    if (!err) {
      res.render("preproductfacemask", {
        id: requestedId,
        name: facemask.name,
        imageUrl: facemask.imageUrl,
        description: facemask.description,
        price: facemask.price,
        counterInStock: facemask.countInStock,
      });
    };
  });
});

app.get("/addFaceMask/:id", function (req, res) {
  const requestedId = req.params.id;

  FaceMask.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/facescruballproducts", async (req, res) => {
  try {
    const facescrubs = await FaceScrub.find({});
    res.render('facescrubproductdetails', { facescrubs: facescrubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/facescruballproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  FaceScrub.findOne({ _id: requestedId }, function (err, facescrub) {
    if (!err) {
      res.render("preproductfacescrub", {
        id: requestedId,
        name: facescrub.name,
        imageUrl: facescrub.imageUrl,
        description: facescrub.description,
        price: facescrub.price,
        counterInStock: facescrub.countInStock,
      });
    };
  });
});

app.get("/addFaceScrub/:id", function (req, res) {
  const requestedId = req.params.id;

  FaceScrub.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/faceserumallproducts", async (req, res) => {
  try {
    const faceserums = await FaceSerum.find({});
    res.render('faceserumproductdetails', { faceserums: faceserums });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/faceserumallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  FaceSerum.findOne({ _id: requestedId }, function (err, faceserum) {
    if (!err) {
      res.render("preproductfaceserum", {
        id: requestedId,
        name: faceserum.name,
        imageUrl: faceserum.imageUrl,
        description: faceserum.description,
        price: faceserum.price,
        counterInStock: faceserum.countInStock,
      });
    };
  });
});

app.get("/addFaceSerum/:id", function (req, res) {
  const requestedId = req.params.id;

  FaceSerum.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/facewashallproducts", async (req, res) => {
  try {
    const facewashs = await FaceWash.find({});
    res.render('facewashproductdetails', { facewashs: facewashs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/facewashallproducts/:id", function (req, res) {
  const requestedId = req.params.id;

  FaceWash.findOne({ _id: requestedId }, function (err, facewash) {
    if (!err) {
      res.render("preproductfacewash", {
        id: requestedId,
        name: facewash.name,
        imageUrl: facewash.imageUrl,
        description: facewash.description,
        price: facewash.price,
        counterInStock: facewash.countInStock,
      });
    };
  });
});

app.get("/addFaceWash/:id", function (req, res) {
  const requestedId = req.params.id;

  FaceWash.findOne({ _id: requestedId }, function (err, c) {
    if (!err) {
      res.render('addtocart', {
        id: requestedId,
        name: c.name,
        qty: 1,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl
      })
    }
  });
});

app.get("/cart", function (req, res) {
  res.render('cart');
});

app.listen(port, function (res, req) {
  console.log(`Server Running on Port ${port}`);
});


app.get("/payment", function (req, res) {
  res.render('payment')
});

app.post("/payment", function (req, res) {
  let options = {
    amount: 50000,
    currency: "INR",
  };

  razorpay.orders.create(options, function (err, order) {
    console.log(order);
    res.json(order);
  });
});

app.post("/is-order-completed", function (req, res) {
  razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument) => {
    if (paymentDocument.status == "captured") {
      res.redirect("/")
    } else {
      res.send("Error while processing payment.")
    }
  })
})

app.get("/account", function (req, res) {
  res.render('account', { 
    username: req.user.username,
    email: req.user.email, 
    mobile: req.user.mobile, 
    address: req.user.address });
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});