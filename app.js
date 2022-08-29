const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const moment = require("moment");
const mongoose =require("mongoose");


// var items = ["Wake Up", "Brush Teeth", "Breakfast"];
mongoose.connect("mongodb+srv://srajan_acharya:srajan123@cluster0.iigkxve.mongodb.net/todolistDB");
const itemSchema = {
    name: String
};

const Item =mongoose.model("Item",itemSchema);

const item1= new Item({
    name:"Welcome To your todoList!"
});
const item2= new Item({
    name:"Hit + button to add a new item."
});
const item3= new Item({
    name:"Hit the checkbox to remove item"
});



const defaultItems =[item1,item2,item3];


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.static('views/images'));


app.post("/", async (req, res) => {
    var itemName = req.body.newtask;
    const item= new Item({
        name:itemName
    });
    item.save();
    res.redirect("/");
});
app.post("/delete", async(req,res)=>{
    // console.log(req.body.checkbox);
    const checkedItemID= req.body.checkbox;
    console.log(checkedItemID);
    Item.findByIdAndRemove(checkedItemID,(err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Sucessfully removed element");
        }
    })
    res.redirect("/");
});


app.get("/", (req, res) => {
 //check if the collection is empty, if empty then add default items to it

    Item.find({},(err,items)=>{
        if (items.length==0){
            //insert them to database
            Item.insertMany(defaultItems,(err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully added default items!")
                }
            }); 
            res.redirect("/");
        }
        else{
            res.render("index", {items});
        }
       
    })
});

app.get("*",(req,res)=>{
    // res.writeHead(404);
    res.statusCode = 404
    res.redirect('/')

    
})


app.listen("2000", () => {
    console.log("server running");
})