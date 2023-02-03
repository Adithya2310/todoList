const express = require('express');
const bodyParser = require('body-parser');
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");

mongoose.set('strictQuery', false);

const app=express();
var item=[];
app.use(express.static("public"));
mongoose.connect("mongodb+srv://adithya_n_g:Alluarjunfan@cluster0.ejmaaoq.mongodb.net/todoListDB" , {useNewUrlParser: true});
// Schema for the items
const itemSchema=new mongoose.Schema({
    name: String,
});
const Item=mongoose.model("Item",itemSchema);

const task1=new Item({
    name: "Welcome to your todo list"
});

const task2=new Item({
    name: "Click on the + icon to add new tasks"
});

const task3=new Item({
    name: "<--- on the button to remove the tasks"
});
// Schema for the custom list
 
const listSchema=new mongoose.Schema({
    name: String,
    items:[{
        name: String}]
});


const List= mongoose.model("List",listSchema);


let items=[];

// Item.insertMany(items,function(err)
// {
//     if(err)
//     {
//         console.log(err)
//     }
//     else{
//         console.log("sucessfully inserted");
//     }
// });

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));

app.get("/",function(req,res){
    var day=date.getDate();
    Item.find({},function(err,result){
        if(err){
            console.log(err)
        }
        else{
            if(result.length==0){
                items=[task1,task2,task3];
            
                Item.insertMany(items,function(err)
                {
                    if(err)
                    {
                        console.log(err)
                    }
                    else{
                    console.log("sucessfully inserted");
                    }
                });
                res.redirect("/");
                } else {
            res.render('list.ejs',{
                whichday: day,
                newtask: result
            });}
        }
    });
});
app.get("/about",function(req,res){
    res.render("about.ejs");
});
app.get("/:customList",function(req,res){
    List.findOne({name: req.params.customList},function(err,listName){
        if(err){
            console.log(err);
        }
        else{
            if(!listName){
                const customItems= new List({
                    name: req.params.customList,
                    items: [task1,task2]
                });
                customItems.save();
                console.log("successfully created list"+req.params.customList);
                res.redirect("/"+req.params.customList);            
            }
            else{
                res.render('list.ejs',{
                    whichday: req.params.customList,
                    newtask: listName.items
                });
            }
        }

    });
});
app.post("/",function(req,res){
    const value=req.body.plusButton;
    const itemAdded=req.body.todo;
    let task4=new Item({
        name: itemAdded
    });
    if(value===date.getDate())
    {
    task4.save();
    res.redirect("/");}
    else{
        List.findOne({name: value},function(err,listAccess){
            listAccess.items.push(task4);
            listAccess.save();
            res.redirect("/"+value);
        });
    }
});
app.post("/delete",function(req,res){
    const delVal=req.body.checkbox;
    const listName=req.body.listName;
    if(req.body.listName===date.getDate())
    {
        Item.deleteOne({name: delVal},function(err){
            if(err)
            {
                console.log(err);
            }
            else{
                console.log("Item successfully deleted")
            }
        });
        res.redirect("/");
    }
    else{
        console.log(listName);
        List.updateOne({name:listName}, {$pull: {items: {name:delVal}}},function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("successfullt deleted");
            }
        });
        res.redirect("/"+listName);
    }
});
app.listen(3000,function(){
    console.log("listening on port 3000");
});
