const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    },
    img: {
        type: String
    },
    cancelled: {
        type: Boolean,
        default : false
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    creator: {
        type: Schema.Types.ObjectId,
        ref : "User"
    },
    location : {
        type: String,
        required: true
    },
    bookers : [
        {
            userId: {
                type: String,
                required: true
            },
            bookedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ]
});


module.exports = mongoose.model("Event", eventSchema);