var series = require("hapi-next"),
    validator = require("./user.validator"),
    controller = require("./user.controller"),
    userHelper = require("../../helpers/user"),
    joi = require("joi");


module.exports = {
        addUserHistory: {
        method: "POST",
        path: "/user/history/add",
        config: {
            description: "Adding User Activity for check-in check-out",
            validate: {
                payload: {
                    username: joi.string().email().required(),
                    logInTime:joi.string().required(),
                    logOutTime:joi.string().required()
                }
            },

            handler: function(request, reply) {
                var functionSeries = new series([
                    userHelper.fetchUserDetails,
                    validator.userDoesNotExists,
                    controller.addUserHistory
                ]);

                functionSeries.execute(request, reply);
            }
        }
    }, 
       addUserActivity: {
        method: "POST",
        path: "/user/activity/add",
        config: {
            description: "Adding User Activity for check-in check-out",
            validate: {
                payload: {
                    username: joi.string().email().required(),
                    logState: joi.string().required(),
                    logTime: joi.string().optional(),
                    sourceApp: joi.string().optional()
                }
            },

            handler: function(request, reply) {
                var functionSeries = new series([
                    userHelper.fetchUserDetails,
                    validator.userDoesNotExists,
                    controller.addUserActivity,
                    controller.updateUserLogState
                ]);

                functionSeries.execute(request, reply);
            }
        }
    }, 
    fetchUserDashboard: {
        method: "GET",
        path: "/get/user/dashboard/{userId}",
        config: {
            description: "Get user dashboard",
            validate: {
                params: {
                    userId: joi.string().required()
                }
            },
            handler: function(request, reply) {

                var functionSeries = new series([
                    userHelper.fetchUserDetails,
                    validator.userDoesNotExists,
                    userHelper.getUserTodayHistory,
                    userHelper.getUserPreviousHistory
                ]);

                functionSeries.execute(request, reply);
            }
        }
    },
    fetchAllUserDetails: {
        method: "GET",
        path: "/get/all/users/{userId}",
        config: {
            description: "Get all users details",
            handler: function(request, reply) {

                var functionSeries = new series([
                    controller.fetchAllUserDetails,
                    validator.userDoesNotExists,
                ]);

                functionSeries.execute(request, reply);
            }
        }
    },

    notifyUser: {
        method: "POST",
        path: "/user/notify",
        config: {
            description: "Notifiy User",
            validate: {
                payload: {
                    username: joi.string().email().required(),
                    toUserId: joi.string().required(),
                    logMessage:joi.string().optional(),
                    logStatus:joi.string().optional(),
                    isNotified:joi.string().required(),
                }
            },

            handler: function(request, reply) {
                var functionSeries = new series([
                    userHelper.fetchUserDetails,
                    validator.userDoesNotExists,
                    userHelper.fetchToUserDetail,
                    controller.addNotification
                ]);

                functionSeries.execute(request, reply);
            }
        }
    },

    userNotifications: {
        method: "POST",
        path: "/user/notifications",
        config: {
            description: "User Notifications",
            validate: {
                payload: {
                    username: joi.string().email().required(),
                }
            },

            handler: function(request, reply) {
                var functionSeries = new series([
                    userHelper.fetchUserDetails,
                    validator.userDoesNotExists,
                    userHelper.fetchUserNotifications
                ]);

                functionSeries.execute(request, reply);
            }
        }
    },

    userHistory: {
        method: "POST",
        path: "/user/history",
        config: {
            description: "User History",
            validate: {
                payload: {
                    username: joi.string().email().required(),
                }
            },

            handler: function(request, reply) {
                var functionSeries = new series([
                    userHelper.fetchUserDetails,
                    validator.userDoesNotExists,
                    userHelper.getUserPreviousHistory
                ]);

                functionSeries.execute(request, reply);
            }
        }
    }

};
