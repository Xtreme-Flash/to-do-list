//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

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

app.get("/:customListName", async function(req, res){

    const customListName =  _.capitalize(req.params.customListName);

    const foundList = await List.findOne({name: customListName})

    if(!foundList){
        const list = new List({
            name: customListName,
            items: defaulItem
        });
        list.save();
        res.redirect("/" + customListName);
    }
    else{
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
    }
    
});

app.post("/", async function(req, res){

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        const foundList = await List.findOne({name: listName});
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
    }

    
});

app.post("/delete", async function(req, res){

    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        const deletedItem = await Item.findByIdAndRemove(checkedItemId);
        res.redirect("/");
    }
    else{
        const foundList = await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}});
        res.redirect("/" + listName);
    }

    

   

});

app.get("/about", function(req, res){
    res.render("about");
})

app.listen(3000, function(){
    console.log("server is running on port: 3000");
});