module.exports = {
    firstCall: {
        method: "POST",
        path: "/user/call",
        config: {
            description: "Demo Call",

            handler: function(request, reply) {

                console.log(process.env.APP_SAYS + " First route called");
            }
        }
    },
};
console.log("called");