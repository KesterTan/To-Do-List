const express = require("express");
const app = express();
const path = require("path");
const _ = require("lodash");

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://Retsek:123@cluster0.9onk1.mongodb.net/todolistDB');
}

const itemSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: [true, "Task cannot be empty"]
  }
});
const Item = new mongoose.model("item", itemSchema);

const task1 = new Item ({
  taskName: "Welcome to your to-doList"
})

const task2 = new Item ({
  taskName: "Hit the + button to add a new item to the list"
})

const task3 = new Item ({
  taskName: "<-- Hit this to delete an item"
})

const task4 = new Item({
  taskName: "For custom lists, enter any name of your choice behind the URL e.g /wishlist."
});

const defaultItems = [task1, task2, task3, task4];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})

const List = new mongoose.model("List", listSchema);

app.get("/", function(req, res) {
  Item.find({}, (err, foundItems) => {
    //console.log(foundItems.length);
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if(err) {
          console.log(err);
        } else {
          console.log("Sucessfully updated")
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    } 
  })
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const currentList = _.capitalize(req.body.list);

  const newTask = new Item({
    taskName: itemName
  });

  // console.log(currentList);
  // newTask.save(() => res.redirect("/"));

  if (currentList === "Today") {
    newTask.save(() => res.redirect("/"));
  } else {
    List.findOne({name: currentList}, (err, foundList) => {
      if (!err) {
        foundList.items.push(newTask);
        foundList.save(() => res.redirect("/" + currentList));
      } else {
        console.log(err);
      }
    })
  }
});

app.post("/delete", (req, res) => {
  const checkedItemID = req.body.checkbox;
  const currentList = req.body.listName;

  if (currentList === "Today") {
    Item.deleteOne({_id: checkedItemID}, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log("One task successfully deleted");
        res.redirect("/");
      }
    })
  } else {
    List.findOneAndUpdate({name: currentList}, {$pull: {items: {_id: checkedItemID}}}, (err) => {
      if (!err) {
        res.redirect("/" + currentList);
      }
    })

  }
});

app.get("/:typeOfList", (req, res) => {
  const customListName = _.capitalize(req.params.typeOfList);
  // check if list with name already exists
  List.findOne({name: customListName}, (err, foundList) => {
    if (!err) {
      // console.log("1");
      if (!foundList) {
        // Create a new list
        // console.log("2");
        const list = new List ({
          name: customListName,
          items: defaultItems
        });
        // console.log("3");
        list.save(() => res.redirect("/" + customListName));
      } else {
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  })
});

app.listen(process.env.POST || 3000, function() {
  console.log("Server started on port 3000");
});
