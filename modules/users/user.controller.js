"use strict"

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    moment = require("moment");

var usersModel = mongoose.model("Users"),
    userActivityModel = mongoose.model("UserActivity");

var log = require("../../utility/log"),
    network = require("../../utility/network");

module.exports = {
    addUserActivity: addUserActivity,
    updateUserLogState: updateUserLogState,
    fetchAllUserDetails: fetchAllUserDetails
}

function fetchAllUserDetails(request, reply) {

    log.write("modules > user > user.contoller.js > fetchAllUserDetails()");

    usersModel.findAsync()
        .then(function(user) {

            reply.data = {
                user: user
            }

            reply.next();
        }).catch(function(err) {
            log.write(err);
            reply.next(err);
        })
}


function updateUserLogState(request, reply) {
    log.write("modules > user > user.contoller.js > updateUserLogState()");
    usersModel.findByIdAndUpdateAsync({
            "_id": reply.data.user._id
        }, {
            $set: {
                logState : request.payload.logState
            }
        })
        .then(function(updatedUserData) {

            if (!updatedUserData) {
                return promise.reject("Unable to update information");
            }
            if(request.payload.logState == "0")
                var msg = "Bye..!! You have been checked out successfully";
            else
                var msg = "Welcome, You have been checked in successfully";

            reply.data = {
                status:"ok",
                message: msg
            }

            reply.next();
        })
        .catch(function(err) {
            log.write(err);
            reply.next(err);
        });
}


function addUserActivity(request, reply) {

    log.write("modules > user > user.contoller.js > addUserActivity()");

    var pocket = {};
    
    pocket.userActivity = {
        "deviceId": network.getIp(request),
        "userAgent": network.getUserAgent(request),
        "userId": reply.data.user._id,
        "logState": request.payload.logState,
        "logTime": request.payload.logTime,
        "sourceApp": request.payload.sourceApp
    }

    pocket.userActivity = new userActivityModel(pocket.userActivity);

    pocket.userActivity.saveAsync()
        .then(function(savedUserActivity) {
            console.log("Line 108");
            if (!savedUserActivity) {
                return promise.reject("Unable add user activity. Some thing went wrong");
            }
            console.log("Line 112");
            
            if (typeof reply.data == undefined) {
                reply.data = {
                                message: 'Activity added',
                                status:"ok",
                         }
            } 
            
            reply.next();
        })
        .catch(function(err) {

            log.write(err);
            reply.next(err);
        });
}