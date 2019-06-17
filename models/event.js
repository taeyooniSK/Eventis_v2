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
    date: {
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
    }
});


module.exports = mongoose.model("Event", eventSchema);