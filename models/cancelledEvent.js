const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cancelledEventSchema = new Schema({
    event: { // reference Event model
        type: Schema.Types.ObjectId,
        ref: "Event"
    },
    user : { // user who booked an event
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
// options
    {
        timestamps: true // I can know when a booking happened
    }
);

module.exports = mongoose.model("CancelledEvent", cancelledEventSchema);