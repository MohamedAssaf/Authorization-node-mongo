'use strict';
const _ = require("lodash");
const mongo = require("./DataService");

let errors = {};

module.exports = {
    Signup: (user, callback) => {
        //to erase all errors when a new user tries to sign up 
        errors = {};
        mongo.getUser(user, (err, dbUser) => {
            validateUser(user, dbUser);
            if (_.isEmpty(errors)) {
                mongo.insertUser(user);
            }
            callback(undefined,errors);
        })
    },
    init: (intiCallback) => {
        mongo.init(intiCallback);
    },
    allUsers: (callback) => {
        mongo.getAllUsers(callback);
    },
    authToken: (phoneNumber, password, authCallback) => {
        mongo.getUser({phoneNumber}, (err, user) => {
            if(user){
                if(user.password == password){
                    let authToken = user._id+Date.now();
                    mongo.addAuthToken(authToken,phoneNumber,user._id);
                    authCallback(undefined,authToken);

                }
                else {
                    authCallback("invalid phone number/password combination", undefined);
                }
            }else {
                authCallback("invalid phone number/password combination", undefined);
            }
        })
    }
};

let validateUser = (user, dbUser) => {
    checkParamters(user);
    validatePhoneNumber(user, dbUser);
    validateEmail(user, dbUser);
    validateDate(user);
    validAvatar(user);

}
let checkParamters = ({ firstName = requiredParam('firstName'),
    lastName = requiredParam('lastName'),
    countryCode = requiredParam('countryCode'),
    phoneNumber = requiredParam('phoneNumber'),
    gender = requiredParam('gender'),
    birthDate = requiredParam('birthDate'),
    avatar = requiredParam('avatar'),
}) => {
    return true;
}

let requiredParam = (param) => {
    errors[param] = [{ "error": "blank" }];
}

let validatePhoneNumber = ({ phoneNumber }, dbUser) => {

    let phoneNumberErrors = [];

    //this regular expression test validates if the phone number passed is a valid and in E.164 format 
    //I'm assuming valid represents itself and 
    let validPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(phoneNumber);
    if (!validPhoneNumber) {
        phoneNumberErrors.push({ "error": "not_a_number" });
    }
    if (phoneNumber.length > 15) {
        phoneNumberErrors.push({ "error": "too_long", "count" : phoneNumber.length });
    }
    if (phoneNumber.length < 10) {
        phoneNumberErrors.push({ "error": "too_short", "count" : phoneNumber.length });        
    }
    if (dbUser) {
        if (dbUser.phoneNumber == phoneNumber) {
            phoneNumberErrors.push({ "error": "taken" })
        }
    }

    if (phoneNumberErrors.length > 0) {
        if (_.isEmpty(errors["phoneNumber"])) {
            errors["phoneNumber"] = phoneNumberErrors;
        } else {
            errors["phoneNumber"] = errors["phoneNumber"].concat(phoneNumberErrors);
        }
    }

}

let validateEmail = ({ email }, dbUser) => {
    let emailErrors = [];

    let emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let validEmail = emailRegExp.test(String(email).toLowerCase());
    if (!validEmail) {
        emailErrors.push({ "error": "invalid" })
    }
    if (dbUser) {
        if (dbUser.email == email) {
            emailErrors.push({ "error": "taken" });
        }
    }


    if (emailErrors.length > 0) {
        if (_.isEmpty(errors["email"])) {
            errors["email"] = emailErrors;
        } else {
            errors["email"] = errors["email"].concat(emailErrors);
        }
    }
}

let validateDate = ({ birthDate }) => {
    let dateErrors = [];

    //checking for validity
    let yearReg = '(19[0-9][0-9]||202[0-9])';       ///< Allows a number between 2014 and 2029
    let monthReg = '(0[1-9]|1[0-2])';               ///< Allows a number between 00 and 12
    let dayReg = '(0[1-9]|1[0-9]|2[0-9]|3[0-1])';   ///< Allows a number between 00 and 31

    let reg = new RegExp('^' + yearReg + '-' + monthReg + '-' + dayReg +'$','g');
    if (!reg.test(birthDate)) {
        dateErrors.push({ "error": "invalid" });  // Invalid format
    } else {
        let date = new Date(birthDate);
        if (Number.isNaN(date.getTime())) {
            dateErrors.push({ "error": "invalid" }); // Invalid date
        }
    }
    //checking if its in the future
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDay();
    let currentYear = currentDate.getFullYear();

    let currentFormattedDate = new Date(currentYear, currentMonth, currentDay);

    if (currentFormattedDate < birthDate) {
        dateErrors.push({ "error": "in_the_future" });
    }

    if (dateErrors.length > 0) {
        if (_.isEmpty(errors["birthDate"])) {
            errors["birthDate"] = dateErrors;
        } else {
            errors["birthDate"] = errors["birthDate"].concat(dateErrors);
        }
    }
}

let validAvatar = ({ avatar }) => {

    //get the last 6 characters from filename
    let avatarFileExtension = avatar.slice(-6);
    if (!(avatarFileExtension.indexOf(".png") == -1) ||
        !(avatarFileExtension.indexOf(".jgp") == -1) ||
        !(avatarFileExtension.indexOf("jpeg") == -1)) {
        if (_.isEmpty(errors["avatar"])) {
            errors["avatar"] = [{ "error": "invalid_content_type" }];
        } else {
            errors["avatar"].push({ "error": "invalid_content_type" });
        }
    }
}