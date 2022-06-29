const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const schema = new Schema(
    {
        firstName: {
            type: String,
            require: true,
            maxLength: 50,
        },
        lastName: {
            type: String,
            require: true,
            maxLength: 50,
        },
        email: {
            type: String,
            require: true,
            maxLength: 50,
        },
        phone: {
            type: String,
            require: true,
            maxLength: 50,
        },
        password: {
            type: String,
            require: true,
            maxLength: 50,
        },
        addresses: {
            type: Array,
            require: true,
        },
        permission: {
            type: Boolean,
            default: () => false,
        },
    },
    { versionKey: false, timestamps: true },
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("users", schema);