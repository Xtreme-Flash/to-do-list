//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const { getDate } = require("./date");
const date = require(__dirname + "/date.js");


const app = express();

let items = [];
let workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

    let day = getDate();
    
    res.render("list", {listTitle: day, newListItems: items});

});

app.post("/", function(req, res){
    item = req.body.newItem;
    if (req.body.list === "work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
    
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "work list", newListItems: workItems});
});

app.post("/work", function(req, res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", function(req, res){
    res.render("about");
})

app.listen(3000, function(){
    console.log("server is running on port: 3000");
});