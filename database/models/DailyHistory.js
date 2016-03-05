"use strict"

var mongoose = require("mongoose");

var schema = {
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    checkedInTime: {
        type: Number,
        default: 0
    },
    checkedOutTime: {
        type: Number,
        default: null
    }
}

var mongooseSchema = new mongoose.Schema(schema, {
    collection: "DailyHistory"
});

mongoose.model("DailyHistory", mongooseSchema);
