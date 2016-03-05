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

