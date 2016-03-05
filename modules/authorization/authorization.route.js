var series = require("hapi-next"),
    controller = require("./authorization.controller"),
    joi = require("joi");
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
                    type: joi.string().required()
                }
            },

            handler: function(request, reply) {

                var functionSeries = new series([
                    controller.userSignup
                ]);

                functionSeries.execute(request, reply);
            }
        }
    }
};
