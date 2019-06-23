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
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
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
    lat: {
        type: Number
    },
    lng: {
        type: Number
    }

});


module.exports = mongoose.model("Event", eventSchema);