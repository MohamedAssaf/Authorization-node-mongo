'use strict';

const auth = require("./AuthenticationService");
const userServ = require('./UserService');
const mongo = require("./DataService");


describe("Valid Authorization Token", () => {
    it("should return a new authToken", () => {
        auth.init(() => {
            auth.authToken("+201000980110", "12345678", (err, authToken) => {
                expect(authToken).toBeTruthy();
            })
        })
    })
});

describe("Auth Token for non existing user", () => {
    it("should return an err", () => {
        auth.init(() => {
            auth.authToken("+201000110", "12345678", (err, authToken) => {
                expect(err).toBeTruthy();
            })
        })
    })
});

describe("Auth Token with wrong password", () => {
    it("should return an err", () => {
        auth.init(() => {
            auth.authToken("+201000980110", "1238", (err, authToken) => {
                expect(err).toBeTruthy();
            })
        })
    })
});

// User service tests
describe("Post status succssfully", () => {
    it("should post new status", () => {
        mongo.init(() => {
            let statusObject = {
                authToken :"5bc9c675cc99b11d8c16737f1539971596999",
                phoneNumber : "+201000980110",
                status:"WOWZA"
            };
            userServ.PostStatus(statusObject, (err, response) => {
                expect(response).toBe("What up?");
            })
        })
    })
});

describe("Status passed with bad auth token", () => {
    it("reject any transaction because of wrong auth token", () => {
        mongo.init(() => {
            let statusObject = {
                authToken :"5bc9b11d8c16737f1539971596999",
                phoneNumber : "+201000980110",
                status:"WOWZA"
            };
            userServ.PostStatus(statusObject, (err, response) => {
                expect(err).toBe(401);
            })
        })
    })
});

describe("Status request with no authToken", () => {
    it("reject any transaction because of missing parameter", () => {
        mongo.init(() => {
            let statusObject = {
                phoneNumber : "+201000980110",
                status:"WOWZA"
            };
            userServ.PostStatus(statusObject, (err, response) => {
                expect(err["authToken"].length).toBe(1);
            })
        })
    })
});

describe("Status request with no phoneNumber", () => {
    it("reject any transaction because of missing parameter", () => {
        mongo.init(() => {
            let statusObject = {
                authToken :"5bc9b11d8c16737f1539971596999",
                status:"WOWZA"
            };
            userServ.PostStatus(statusObject, (err, response) => {
                expect(err["phoneNumber"].length).toBe(1);
            })
        })
    })
});

describe("Status request with no status", () => {
    it("reject any transaction because of missing parameter", () => {
        mongo.init(() => {
            let statusObject = {
                authToken :"5bc9b11d8c16737f1539971596999",
                phoneNumber : "+201000980110",
            };
            userServ.PostStatus(statusObject, (err, response) => {
                expect(err["status"].length).toBe(1);
            })
        })
    })
});


