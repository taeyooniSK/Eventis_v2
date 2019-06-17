const Event = require("../../models/event");
const User = require("../../models/user");
const Comment = require("../../models/comment");
const { dateToString } = require("../../helpers/date");
const { user, transformEvent } = require("./populate");


module.exports = { // javascript object where all the resolver functions are in 
    // comments: async (args, req) => {
    //         const comments = await Comment.find({});
    //         console.log("comments: ", comments);

    //         return comments.map(comment => {
    //             return {
    //                 ...comment,
    //                 author: user.bind(this, comment._doc.author),
    //                 createdAt: dateToString(comment._doc.createdAt),
    //                 updatedAt: dateToString(comment._doc.updatedAt)
    //             }
    //         })
    // },
    createComment: async (args, req) => {
        if (!req.isAuthenticated){
            throw new Error("It's not authenticated!");
        }
        try {
            // 해당 싱글 이벤트 페이지의 아디이(라우트의 아이디로 얻거나 그 singleEventPage route의 pathname을 통해서도 얻어서 
            // graphql query에 argument로 넣고 event.comments.push(넣을코멘트) 이런식으로 넣고 save한다. 그리고 만들어진 코멘트를 리턴.
            const event = await Event.findOne({_id: args.commentInput.eventId});
            console.log("event I found for saving  a comment :", event);
            const comment = new Comment({
                author: req.userId,
                text: args.commentInput.text
            });
            const savedComment = await comment.save();
            console.log("comments saved in the event: ", savedComment);
            // console.log("event's comments :", event.comments);
            event.comments.push(savedComment);
            // event.comments에 push이후에 comments의 parent인 event를 save()해야 데이터 저장;
            const eventToSave = await event.save();
            
            console.log("event's comments: ", eventToSave.comments);

            return savedComment;
        } catch(err){
            throw err;
        }
    }
}