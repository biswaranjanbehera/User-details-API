//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

const swaggerOptions={
  swaggerDefinition:{
    info:{
      title:"User API",
    },
    servers:[{
      url:"http://localhost:3000/"
    }]
  },
  apis:["./app.js"]
}





app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Connection to mongo db
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

//create the user schema
const userSchema={
  rollno:Number,
  name:String,
  skill:String
};

//created user model using mongoose
const User = mongoose.model("User",userSchema);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

// Routes
/**
* @swagger
* /users:
*   get:
*     summary: this api will fetch all the user details
*     description: all user details will be collect
*     responses:
*       200:
*         description: the response will show all the users details
*/

app.get("/users", async (req,res)=>{
  try {
    const detailsUsers = await User.find();
    res.send(detailsUsers);
  } catch (e) {
      res.send(e);
  }
});


/**
* @swagger
* /users:
*   post:
*     summary: this api will create user details
*     consumes:
*       - application/json:
*     parameters:
*       - in: body
*         name: user
*         schema:
*           type: object
*           required:
*             - username
*           properties:
*             rollno:
*                type: number
*             name:
*                type: String
*             skill:
*                type: string
*     responses:
*      200:
*        description: the response will show the created users details
*/


 app.post("/users",async (req,res)=>{
    try{
        const newUser = new User({
          rollno:req.body.rollno,
          name:req.body.name,
          skill:req.body.skill
        });
        const userName = await User.findOne({rollno:req.body.rollno});
        console.log(userName);
        if(userName){
          res.send("This roll number is already register")
        }else{
            const savee = await newUser.save();
            res.send(savee);
        }
      }catch(err){
        res.send(err);
      }
});

/**
* @swagger
* /users:
*   delete:
*     summary: this api will delte all the user details
*     description: all user will be deleted
*     responses:
*       200:
*         description: the response will be deleted all user succesfully
*/

  app.delete("/users",async (req,res)=>{
    try{
      const detailsUsers = await User.find();
      if(detailsUsers.length==0){
        res.send("The user list is empty");
      }else{
        await User.deleteMany();
        res.send("Succesfully delete all the users list");
      }
    }catch(err){
      res.send(err);
    }
});

/**
* @swagger
* /users/{rollno}:
*   get:
*     summary: this api will fetch particular user details
*     description: particular roll number user details will be collect
*     parameters:
*         - in: path
*           name: rollno
*           schema:
*             type: integer
*     responses:
*       200:
*         description: the response will show the particular roll number user details
*/

app.get("/users/:rollNo",async (req,res)=>{
  try{
    const userName = await User.findOne({rollno:req.params.rollNo});
    if(userName){
      res.send(userName);
    }else{
      res.send("no user matching with this roll no");
    }
  }catch(err){
    res.send(err);
  }

});


/**
* @swagger
* /users/{rollno}:
*   put:
*     summary: this api will update the particular user details
*     description: update particular roll number user details
*     parameters:
*         - in: path
*           name: rollno
*           schema:
*             type: integer
*     requestBody:
*       required: true
*       content:
*         application/json:
*     responses:
*       200:
*         description: the response will show the particular roll number is update succesfully
*/

app.put("/users/:rollNo",async (req,res)=>{
  try{
    const userName = await User.findOne({rollno:req.params.rollNo});
    if(userName){
      await User.findOneAndUpdate({rollno:req.params.rollNo},
          {name:req.body.name,
          skill:req.body.skill},
          {overwrite:true}
      )
      res.send("Update succesfully");
    }else{
      res.send("no user matching with this roll no")
    }
  }catch(e){
    res.send(e);
  }
});

/**
* @swagger
* /users/{rollno}:
*   patch:
*     summary: this api will update the particular user details
*     description: update particular roll number user details
*     consumes:
*       - application/json:
*     parameters:
*         - in: path
*           name: rollno
*           schema:
*             type: integer
*         - in: body
*           name: user
*           schema:
*             type: object
*             required:
*               - username
*             properties:
*               rollno:
*                  type: number
*               name:
*                  type: String
*               skill:
*                  type: string
*     responses:
*       200:
*         description: the response will show the particular roll number is update succesfullly
*/

app.patch("/users/:rollNo",async (req,res)=>{
  try{
    const userName = await User.findOne({rollno:req.params.rollNo});
    if(userName){
      await User.findOneAndUpdate({rollno:req.params.rollNo},
          {$set:req.body}
      )
      res.send("Update succesfully");
    }else{
      res.send("no user matching with this roll no")
    }
  }catch(e){
    res.send(e);
  }
});

/**
* @swagger
* /users/{rollno}:
*   delete:
*     summary: this api will delete particular user details
*     description: delte particular roll number
*     parameters:
*         - in: path
*           name: rollno
*           schema:
*             type: integer
*     responses:
*       200:
*         description: the response will show the particular roll number is deleted succesfully
*/

app.delete("/users/:rollNo",async (req,res)=>{
  try{
    const userName = await User.findOne({rollno:req.params.rollNo});
    if(userName){
      await User.deleteOne({rollno:req.params.rollNo})
      res.send("Succesfullt delete the user");
    }else{
      res.send("no user matching with this roll no")
    }
  }catch(e){
    res.send(e);
  }
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
