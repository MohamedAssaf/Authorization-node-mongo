'use strict';

const _ = require("lodash");
const mongo = require("./DataService");

let errors = {};

module.exports = {
    PostStatus: (statusObject, statusCallback) => {
        errors = {};
        validateRequest(statusObject)
        if (_.isEmpty(errors)) {
            mongo.getAuthObject(statusObject.authToken, (err, auth) => {
                if(err){
                    statusCallback(401,undefined);
                } else {
                    statusObject.id = auth.id;
                    mongo.postStatus(statusObject);
                    statusCallback(undefined,"What up?");
                }
            })
        } else {
            statusCallback(errors,undefined);
        }
    }
}

let validateRequest = ({
    phoneNumber = requiredParam('phoneNumber'),
    status = requiredParam('status'),
    authToken = requiredParam('authToken')
}) => {
    return true;
}

let requiredParam = (param) => {
    errors[param] = [{ "error": "blank" }];
}