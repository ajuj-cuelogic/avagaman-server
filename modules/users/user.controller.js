"use strict"

var promise = require("bluebird"),
    mongoose = promise.promisifyAll(require("mongoose")),
    moment = require("moment"),
    async = require("async");

var usersModel = mongoose.model("Users"),
    userActivityModel = mongoose.model("UserActivity"),
    notifyUserModel = mongoose.model("NotifyUser"),
    userHistoryModel = mongoose.model("DailyHistory");

var log = require("../../utility/log"),
    network = require("../../utility/network"),
    email = require("../../utility/email");

module.exports = {
    addUserActivity: addUserActivity,
    updateUserLogState: updateUserLogState,
    fetchAllUserDetails: fetchAllUserDetails,
    addNotification: addNotification,
    addUserHistory: addUserHistory,
    checkNotifications: checkNotifications
}

function fetchAllUserDetails(request, reply) {

    log.write("modules > user > user.contoller.js > fetchAllUserDetails()");

    usersModel.findAsync({ _id: { $nin: [request.params.userId] } })
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

function checkNotifications(request, reply) {
    console.log(request.payload.logState);
    log.write("modules > user > user.contoller.js > checkNotifications()");
    if (request.payload.logState == "1") {
        var pocket = {};
        pocket.findClause = {
            "toUserId": reply.data.user._id,
            "isNotified": "0"
        }
        console.log(pocket.findClause);
        notifyUserModel.findAsync(pocket.findClause)
            .then(function(notifyUser) {
                    //Add code to update isNotified column in NotifyUser Model and 
                    //send mail or notification to userId
                    console.log(notifyUser);

                    async.series(notifyUser.map(function(userObj, index) {
                            return function(cb) {
                                usersModel.findById({
                                        "_id": userObj.userId
                                    })
                                    .then(function(userData) {
                                        // console.log(userData);
                                        
                                        pocket.userData = userData;
                                        if (!pocket.userData) {
                                            return promise.reject("Opps something went wrong");
                                        }
                                        
                                        return notifyUserModel.findByIdAndUpdate({
                                            "_id": userObj._id,
                                            
                                        }, {
                                            $set: {
                                                "isNotified": 1
                                            }
                                        })
                                    })
                                    .then(function(updatedUser) {
                                        if (updatedUser) {
                                             email.sendEmailToSenderAfterReceiverCheckIn(pocket.userData.username, pocket.userData.firstName, reply.data.user.firstName);   
                                        }
                                    })
                                    .catch(function(err) {
                                        log.write(err);
                                        reply.next(err);
                                    })
                                    .finally(function() {
                                        cb()
                                    })

                            }

                        }),
                        function(err, results) {
                            console.log("Yoooo")
                        });

                


                reply.data = {
                    notifyUser: notifyUser
                }

            })
            .catch(function(err) {
                log.write(err);
                //reply.next(err);
            })
    }
    reply.next();
}

function addUserHistory(request, reply) {
    var pocket = {};

    pocket.userHistory = {
        "userId": reply.data.user._id,
        "checkedInTime": request.payload.logInTime,
        "checkedOutTime": request.payload.logOutTime
    }
    pocket.userHistory = new userHistoryModel(pocket.userHistory);

    pocket.userHistory.saveAsync()
        .then(function(savedUserHistory) {
            if (!savedUserHistory) {
                return promise.reject("Unable add user history. Some thing went wrong");
            }

            reply.data = {
                message: 'History added'
            }

            reply.next();
        })
        .catch(function(err) {

            log.write(err);
            reply.next(err);
        });
}

function addNotification(request, reply) {

    log.write("modules > user > user.contoller.js > addNotification()");

    var pocket = {};

    pocket.notifyUser = {
        "userId": reply.data.user._id,
        "toUserId": reply.data.toUser._id,
        "logStatus": request.payload.logStatus,
        "logMessage": request.payload.logMessage,
        "isNotified": request.payload.isNotified,
    }

    pocket.notifyUser = new notifyUserModel(pocket.notifyUser);

    pocket.notifyUser.saveAsync()
        .then(function(savedNotifyUser) {
            email.sendEmailToSenderBeforeReceiverCheckIn(reply.data.toUser.username, reply.data.user.firstName, reply.data.user.lastName, request.payload.logMessage);
            if (!savedNotifyUser) {
                return promise.reject("Unable add user notification. Some thing went wrong");
            }

            reply.data = {
                message: 'Notification added'
            }

            reply.next();
        })
        .catch(function(err) {

            log.write(err);
            reply.next(err);
        });

}

function updateUserLogState(request, reply) {
    log.write("modules > user > user.contoller.js > updateUserLogState()");
    usersModel.findByIdAndUpdateAsync({
            "_id": reply.data.user._id
        }, {
            $set: {
                logState: request.payload.logState
            }
        })
        .then(function(updatedUserData) {

            if (!updatedUserData) {
                return promise.reject("Unable to update information");
            }
            if (request.payload.logState == "0")
                var msg = "Bye..!! You have been checked out successfully";
            else
                var msg = "Welcome, You have been checked in successfully";

            reply.data = {
                status: "ok",
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
                    status: "ok",
                }
            }

            reply.next();
        })
        .catch(function(err) {

            log.write(err);
            reply.next(err);
        });
}
