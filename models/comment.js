const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
            type: Schema.Types.ObjectId,
            ref : "User"
    },
    comment: {
        type: String,
        required: true
    }   
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Comment", commentSchema);