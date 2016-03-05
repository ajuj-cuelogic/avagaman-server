"use strict"

var mongoose = require("mongoose");

var schema = {
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    toUserId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    logStatus: {
        type: String,
        default: null
    },
    logMessage: {
        type: String,
        default: null
    },
    isNotified: {
        type: Number,
        default: 0
    },
    notifiedTime: {
        type: Number,
        default: 0
    },
    createdTime: {
        type: Date,
        default: null
    }
}

var mongooseSchema = new mongoose.Schema(schema, {
    collection: "NotifyUser"
});

mongooseSchema.pre("save", function(next) {

    var now = new Date();

    if (!this.createdTime) {
        this.createdTime = now;
    }
    if (!this.isNotified && this.isNotified == 1) {
        this.notifiedTime = now;
    }
    next();
});


mongoose.model("NotifyUser", mongooseSchema);
