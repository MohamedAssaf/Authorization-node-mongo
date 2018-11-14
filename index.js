'use strict';

const authentication = require('./AuthenticationService');
const user = require('./UserService');
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

let app = express();

//Accepting Json and encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});

app.get("/", function (req, res) {
    authentication.init();
    res.status(200).send("Welcome to the initialization point");
});

app.get("/AllUsers", (req, res) => {
    let allUsers = authentication.allUsers((err, success) => {
        if (err) {
            res.status(400).send("Somehting went wrong");
        }
        res.status(200).json(success);
    });
})
//First Task API
app.post("/Signup",upload.single('avatar'), (req, res) => {
    let user = req.body;
    user["avatar"] = req.file.originalname;
    authentication.Signup(user, (err, userResult) => {
        if (!err) {
            if (!_.isEmpty(userResult)) {
                let response = { "errors": userResult };
                res.status(400).json(response);
            } else {
                res.status(201).json(user);
            }
        }
    });
})

//Second Task API
app.post("/AuthToken", (req,res) => {
    let password = req.body.password;
    let phoneNumber = req.body.phoneNumber;
    authentication.authToken(phoneNumber, password, (err,authToken) => {
        if(err){
            res.status(401).send(err);
        }else {
            res.status(200).send(authToken);
        }
    })
})

//Third task API
app.post("/Status", (req,res)=>{
    let statObj = req.body;
    user.PostStatus(statObj, (err, success) => {
        if(err){
            if(err ==401){
                res.status(401).send("Sorry you did not provide valid credentials to access this resource");
            } else {
                res.status(400).json(err);
            }
        } else {
            res.status(200).send("Voila! posted successfully you son of a gun");
        }
    })
})

