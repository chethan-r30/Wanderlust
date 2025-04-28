const express = require("express");



//POSTS
//Index-posts
router.get("/posts",(req,res)=>{
    res.send("GET for posts");
});
//Show-posts
router.get("/posts/:id",(req,res)=>{
    res.send("GET for show post id");
});
//Post-posts
app.post("/posts",(req,res)=>{
    res.send("POST for posts");
});
//DELETE-posts
app.delete("/posts/:id",(req,res)=>{
    res.send("DELETE for post id");
});