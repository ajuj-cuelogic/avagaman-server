"use strict"

var mongoose = require("mongoose");

var schema = {

    type : {
        type: String,
        enum: ["admin", "user"],
        default: "admin"
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    logState: {
        type: Number,
        enum: [0, 1],
        default:0
    },
    gender: {
        type: String,
        enum: ["male", "female","others"],
        default:"male"
    },
    createdOn: {
        type: Date,
        default: null
    },
    updatedOn: {
        type: Date,
        default: null
    }
}

var mongooseSchema = new mongoose.Schema(schema, {
    collection: "Users"
});




mongoose.model("Users", mongooseSchema);

