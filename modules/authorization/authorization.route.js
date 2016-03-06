var series = require("hapi-next"),
    validator = require("./authorization.validator"),
    controller = require("./authorization.controller"),
    userHelper = require("../../helpers/user"),
    joi = require("joi");

var security = require("../../utility/security");


module.exports = {
    userSignup: {
        method: "POST",
        path: "/user/signup",
        config: {
            description: "Accept user signup details and create a user entity in database",
            validate: {
                payload: {
                    firstName: joi.string().required(),
                    lastName: joi.string().required(),
                    username: joi.string().email().required(),
                    password: joi.string().min(6).required(),
                    gender: joi.string().optional(),
                    type: joi.string().required()
                }
            },

            handler: function(request, reply) {

                var functionSeries = new series([
                    userHelper.fetchUserDetails,
                    validator.userExists,
                    security.hashedPassword,
                    controller.userSignup
                ]);

                functionSeries.execute(request, reply);
            }
        }
    },

    userLogin: {
        method: "POST",
        path: "/user/login",
        config: {
            validate: {
                payload: {
                    username: joi.string().trim().email().required(),
                    password: joi.string().required()
                }
            },
            handler: function(request, reply) {

                var functionSeries = new series([
                    userHelper.fetchUserDetails,
                    validator.userDoesNotExists,
                    validator.comparePassword,
                    security.createToken,
                    controller.userLogin
                ]);

                functionSeries.execute(request, reply);
            }
        }
    }
};
