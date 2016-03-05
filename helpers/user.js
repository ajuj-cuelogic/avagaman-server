var promise = require("bluebird"),
    moment = require("moment"),
    mongoose = promise.promisifyAll(require("mongoose")),
    _ = require("lodash");

var usersModel = mongoose.model("Users");
var userActivity = mongoose.model("UserActivity");
var DailyHistory = mongoose.model("DailyHistory");
var NotifyUser = mongoose.model("NotifyUser");

var log = require("../utility/log");

module.exports = {
    fetchUserDetails        : fetchUserDetails,
    getUserTodayHistory     : getUserTodayHistory,
    getUserPreviousHistory  : getUserPreviousHistory,
    fetchToUserDetail       : fetchToUserDetail,
    fetchUserNotifications  : fetchUserNotifications
}



function fetchUserDetails(request, reply) {


    var pocket = {};


    if (!(_.isEmpty(request.params))) {
        pocket.findClause = {
            "_id": request.params.userId
        }
    } else if (!(_.isEmpty(request.payload))) {
        pocket.findClause = {
            "username": (request.payload.username).toLowerCase().trim()
        }
    } else {
        return reply.next("Oops it's seems that you did not provided parameters.")
    }

    usersModel.findOneAsync(pocket.findClause)
        .then(function(user) {
            reply.data = {
                user: user
            }
            console.log("\n\n" + reply.data + "\n\n");
            reply.next();
        }).catch(function(err) {
            log.write(err);
            reply.next(err);
        })
}
function getUserTodayHistory(request, reply) {
    log.write("helpers > user > getUserTodayHistory()");
    var pocket = {};
    var today = moment().startOf('day');
    var tomorrow = moment(today).add(1, 'days');
    pocket.findClause = {
        "userId": request.params.userId,
        "logTime": {
            $gte: Number(today.valueOf()),
            $lt: Number(tomorrow.valueOf())
        }
    }
    
    userActivity.findAsync(pocket.findClause)
        .then(function(userActivity) {
            reply.data = {
                userTodayHistory: userActivity,
                user: reply.data.user
            }
            reply.next();
        }).catch(function(err) {
            log.write(err);
            reply.next(err);
        })
}


function fetchUserNotifications (request, reply) {
    log.write("helpers > user > fetchUserNotifications()");
    var pocket = {};

    pocket.findClause = {
        "toUserId": reply.data.user._id
    }
    NotifyUser.find(pocket.findClause)
        .populate('toUserId')
        .lean()
        .execAsync()
        .then(function(userNotifications) {
            reply.data = {
                user: reply.data.user,
                userNotifications: userNotifications
            }
            reply.next();
        }).catch(function(err) {
            log.write(err);
            reply.next(err);
        })
}

function fetchToUserDetail (request, reply) {
    log.write("helpers > user > fetchToUserDetail()");

    var pocket = {};

    pocket.findClause = {
        "_id": request.payload.toUserId
    }
    usersModel.findOneAsync(pocket.findClause)
        .then(function(user) {
            reply.data = {
                user: reply.data.user,
                toUser: user
            }
            reply.next();
        }).catch(function(err) {
            log.write(err);
            reply.next(err);
        })
}

function getUserPreviousHistory(request, reply) {
    log.write("helpers > user > getUserPreviousHistory()");
    var pocket = {};
    var today = moment().startOf('day');
    var tomorrow = moment(today).subtract(7, 'days');

    pocket.findClause = {
        "userId": request.params.userId,
        "checkedInTime": {
            $gt: Number(tomorrow.valueOf()),
            $lt: Number(today.valueOf())
        }

    }
    DailyHistory.findAsync(pocket.findClause)
        .then(function(userActivity) {
            reply.data = {
                'status': 'ok',
                'data': {
                    userOldHistory: userActivity,
                    userTodayHistory: reply.data.userTodayHistory,
                    user: reply.data.user
                }
            }
            reply.next();
        }).catch(function(err) {
            log.write(err);
            reply.next(err);
        })
}

