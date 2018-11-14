'use strict';

let mongoClient = require("mongodb").MongoClient;

let db;

let server = "mongodb://localhost:27017/cognitive";

module.exports = {
    init: ( callback) => {
        mongoClient.connect(server, (error, dbase) => {
            if (error) {
                console.log("Error while connecting to database: ", error);
            }
            else {
                console.log("Connection established successfully");
            }
            db = dbase.db("cognitive");
        });
    },
    checkPhoneNumber: (phoneNumber, callback) => {
        let users = db.collection("Users");
        let query = { phoneNumber: phoneNumber };
        users.find(query).toArray(function (err, result) {
            if (err) throw err;
            callback(undefined, result);
        });
    },
    insertUser: (user) => {
        //this is for testing purposes for the second task
        user.password = "12345678";
        let users = db.collection("Users");

        users.insert(user, (err, result) => {
            if (err) throw err;
        })
    },
    getUser: ({ phoneNumber, email }, userCallback) => {
        let users = db.collection("Users");
        let phoneNumberQuery = { phoneNumber: phoneNumber };
        let emailQuery = { email: email };
        users.find({ $or: [phoneNumberQuery, emailQuery] }).toArray(function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                userCallback(undefined, result[0]);
            } else {
                userCallback(undefined, undefined);
            }
        });
    },
    getAllUsers: (callback) => {
        let users = db.collection("Users");
        users.find().toArray((err, res) => {
            if (err) throw err;
            callback(undefined, res);
        });
    },
    addAuthToken: (authToken, phoneNumber, uid) => {
        let tokens = db.collection("Tokens");
        let tokenObject = {
            authToken: authToken,
            userPhoneNumber: phoneNumber,
            id: uid
        };
        tokens.insertOne(tokenObject, (err, success) => {
            if (err) throw err;
        });
    },
    getAuthObject: (authToken, tokenCallback) => {
        let tokens = db.collection("Tokens");
        let tokenQuery = { authToken: authToken };
        tokens.find(tokenQuery).toArray((err, res) => {
            if (err) throw err;
            if (res.length > 0) {
                tokenCallback(undefined, res[0]);
            } else {
                tokenCallback("No corresponding Auth Token", undefined);
            }
        })
    },
    postStatus: ({ status, phoneNumber, id }) => {
        let statCollection = db.collection("Status");
        let statusObject = {
            status: status,
            phoneNumber: phoneNumber,
            userId:id
        };
        statCollection.insertOne(statusObject, (err, success) => {
            if (err) throw err;
        })
    }
}