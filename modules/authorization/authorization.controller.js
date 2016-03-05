"use strict"

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose"));

var usersModel = mongoose.model("Users");

module.exports = {
    userSignup: userSignup,
    userLogin: userLogin
};

function userSignup(request, reply) {

    var pocket = {},
        newUser;
    pocket.newUser = request.payload;
    pocket.newUser["password"] = reply.data.hashedPassword;
    newUser = new usersModel(pocket.newUser);

    newUser.saveAsync()
        .then(function(savedUser) {

            if (!savedUser) {
                return promise.reject("Unable to signup please try again.");
            }

            reply.data = {
                "message": "Your account has been created."
            };
            reply.next();
        })
        .catch(function(err) {
            reply.next(err);
        });
}

function userLogin(request, reply) {


    var pocket = {};
    pocket.__s = reply.data.tokenPayload.__t;
    pocket._id = reply.data.tokenPayload._id;
    reply.data = {
        data : {
            "__s": pocket.__s,
            "_id": pocket._id,
        },
        status:"ok",
        message: "You have successfully login"
   }
    reply.next();
}