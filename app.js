//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



const app = express();

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
    name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const list1 = new Item ({
    name: "holy play"
});

const list2 = new Item({
    name: "maked legend video."
});

const list3 = new Item({
    name: "study."
});

const defaulItem = [list1, list2, list3];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", async function(req, res){

    const foundItem = await Item.find({});

    if(foundItem.length === 0){
        Item.insertMany(defaulItem);
        res.redirect("/");
    }
    else{
        res.render("list", {listTitle: "Today", newListItems: foundItem});
    }

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