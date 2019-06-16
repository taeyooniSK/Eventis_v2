const Event = require("../../models/event");
const User = require("../../models/user");
const Comment = require("../../models/comment");


const user = async userId => {
    try {
        const user = await User.findById(userId);
        //console.log(user._doc);
        return {
                ...user._doc,
                createdEvents: events.bind(this, user.createdEvents)
        }; // merging with the rest properties of object that got found by mongoose
    } catch(err){
        throw err;
    }
};


module.exports = { // javascript object where all the resolver functions are in 
    comments: async (args, req) => {
            const comments = await Comment.find({});
            console.log("comments: ", comments);

            return comments.map(comment => {
                return {
                    ...comment,
                    author: user.bind(this, comment._doc.author),
                    createdAt: dateToString(comment._doc.createdAt),
                    updatedAt: dateToString(comment._doc.updatedAt)
                }
            })
    },
 
}