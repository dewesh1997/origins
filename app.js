//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const encrypt = require("mongoose-encryption")
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/secretsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: "Username is compulsory"
  },
  password: {
    type: String,
    required: "Password is compulsory"
  }
});

const secret = "Thisisoursecreetwhcihislittle";
userSchema.plugin(encrypt, {secret:secret, encryptedFields: ["password"]});


const User = mongoose.model("User", userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser1 = new User({
    username: req.body.username,
    password: req.body.password
  });
  console.log(newUser1);
  //res.render("home");
  newUser1.save(function(err) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log("New User Created");
        res.render("secrets");
      }
    });
});

app.post("/login", function(req,res){
  User.findOne({username: req.body.username}, function(err, user) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        if(user){
          if(user.password === req.body.password) {
            console.log("Login succeddful");
            res.render("secrets");
          } else{
            res.send("Incorrect password");
            }
        } else {
          res.send("No user Found");
        }
      }
    });
});


















app.listen(3000, function(){
  console.log("App started on server 3000");
})
