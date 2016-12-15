var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Udemy  = require("./models/udemy"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

//requiring routes
var commentRoutes    = require("./routes/comments"),
    udemyRoutes = require("./routes/udemy"),
    indexRoutes      = require("./routes/index")

    // Connect to database
    if (process.env.MONGODB_URI) {
      mongoose.connect(process.env.MONGODB_URI);
    }
    else {
      mongoose.connect('mongodb://localhost/UdemyReview');
    }
    mongoose.connection.on('error', function(err) {
      console.error('MongoDB connection error: ' + err);
      process.exit(-1);
      }
    );
    mongoose.connection.once('open', function() {
      console.log("Mongoose has connected to MongoDB!");
    });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "JoJo",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/udemy", udemyRoutes);
app.use("/udemy/:id/comments", commentRoutes);


app.listen(3000, function(){
   console.log("The Udemy Review Server Has Started!");
});
