const express = require("express");
const app = express();
const path = require("path");
const date = require(__dirname + "/date.js");

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const items = [];
const workItems = [];

app.get("/", (req, res) => {
    let day = date.getDay();
    // let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    // let currentDay = today.getDay();
    // let day = days[currentDay- 1];
    res.render("list", {listTitle: day, newListItems: items});
})

app.get("/work", (req, res) => {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
})

app.post("work", (req, res) => {
    let nextItem = req.body.nextItem;
    workItems.push(nextItem);
    res.redirect("/work");
})

app.post("/", (req, res) => {
    let nextItem = req.body.nextItem;
    if (req.body.list === 'work') {
        workItems.push(nextItem);
        res.redirect("/work");
    } else {
        items.push(nextItem);
        res.redirect("/");
    }
})

app.listen(process.env.POST || 3000, (req, res) => {
    console.log("server launched.");
});