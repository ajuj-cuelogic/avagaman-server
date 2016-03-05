var series = require("hapi-next"),
    validator = require("./user.validator"),
    controller = require("./user.controller"),
    userHelper = require("../../helpers/user"),
    joi = require("joi");


module.exports = {
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
    }
};
