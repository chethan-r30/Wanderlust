const express = require("express");
const router = express.Router;

//USERS
//Index-Users
router.get("/users",(req,res)=>{
    res.send("GET for users");
});
//Show-users
router.get("/users/:id",(req,res)=>{
    res.send("GET for show user id");
});
//Post-users
router.post("/users",(req,res)=>{
    res.send("POST for users");
});
//DELETE-Users
router.delete("/users/:id",(req,res)=>{
    res.send("DELETE for user id");
});