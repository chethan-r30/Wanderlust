const express = require("express");
const app = express();
const path = require("path");
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const sessionOptions ={secret:"mysupersecretstring",resave:false,saveUninitialized:true};


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(cookieParser("secretcode"));
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});
app.get("/register",(req,res)=>{
    let {name="ananymous"}=req.query;
    req.session.name =name;
    if(name === "ananymous"){
      req.flash("error","user not registered");
    }else{
req.flash("success","user registered successfully!");
    }
    
    res.redirect("/hello");
  //  res.send(name);
});

app.get("/hello", (req,res)=>{
  
    res.render("page.ejs",{name: req.session.name});
});

app.get("/reqcount",(req,res)=>{
    if( req.session.count){
         req.session.count++;
    }else{
         req.session.count = 1;
    }
  res.send(`you sent a req ${req.session.count} times`);
});
app.get("/test",(req,res)=>{
    res.send("Test successful!!");
});




// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie sent");
// });
// app.get("/verify",(req,res)=>{
//    console.log(req.signedCookies);
//    res.send("verified");
// });
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("made-in","india");
//     res.send("sent you some cookies");
// });
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("I am root");
// });


app.use("/users", users);
app.use("/posts", posts);



app.listen(3000,()=>{
    console.log("server is listening to port 3000")
})