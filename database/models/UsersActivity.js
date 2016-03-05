"use strict"

var mongoose = require("mongoose");

var schema = {

    deviceId: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    logState: {
        type: Number,
        enum: [0, 1],   
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    logTime: {
        type: Number,
        default: null
    },
    createdTime: {
        type: Date,
        default: null
    },
    sourceApp: {
        type: String,
        default: 'a'
    }
}

var mongooseSchema = new mongoose.Schema(schema, {
    collection: "UserActivity"
});

mongooseSchema.pre("save", function(next) {

    var now = new Date();

    if (!this.logTime) {
        this.logTime = (now.getTime()); console.log("isme gya");
    }
    else this.logTime = new Date(this.logTime).getTime();

    if (!this.createdTime) {
        this.createdTime = now;
    }
    console.log("log time is = "+this.logTime + " and server time is = " + new Date().getTime())
    next();
});


mongoose.model("UserActivity", mongooseSchema);
