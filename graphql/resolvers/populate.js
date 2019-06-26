const Event = require("../../models/event");
const User = require("../../models/user");
const Comment = require("../../models/comment");

// helper function
const { dateToString, dateToString2 } = require("../../helpers/date");


// const user, events, singleEvent make me to query more flexible way to a deeper level of queries 
// user.createdEvents put into eventIds parameter as arguments and it returns events which matches $in operator merging 'creator' property(creator(user)'s data)

const singleEvent = async eventId => {
    try {
        const event = await Event.findById({_id: eventId });
        return {
            ...event._doc,
            startDate: dateToString2(event._doc.startDate),
            endDate: dateToString2(event._doc.endDate), 
            creator: user.bind(this, event.creator)
        }
    } catch (err){
        throw err;
    }
    
};


const events = async eventIds => {
    try {
        const events = await Event.find({_id: { $in: eventIds} });
        return events.map(event => {
            return {
                ...event._doc, 
                creator: user.bind(this, event.creator)
            }
        });
    } catch (err){
        throw err;
    }
    
};


// In 'events' resolver, when event.creator value is put in as an argument, then 'user' returns data on the user including createdEvents(function) which enable me to query data on events 
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



const comments = async commentIds => {
    try {
        // get data of comments according to the commentIds put inside transformEvent.comments method and sort them descendingly
        const comments = await Comment.find({_id: { $in: commentIds}, updatedAt : {$exists: true}}).sort({updatedAt : -1});
        //console.log(user._doc);
        return comments.map(comment => {
            return {
                ...comment._doc,
                author: user.bind(this, comment._doc.author),
                post: singleEvent.bind(this, comment._doc.post),
                updatedAt: dateToString2(comment._doc.updatedAt)
            }
        })
    } catch(err){
        throw err;
    }
}

// functions for merging

const transformEvent = event => {
    return {
        ...event._doc,
        startDateTime: dateToString2(event._doc.startDateTime),
        endDateTime: dateToString2(event._doc.endDateTime),
        creator: user.bind(this, event._doc.creator),
        comments:  comments.bind(this, event._doc.comments) // when event is loaded from db, get comments data according to the event
    }
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString2(booking._doc.createdAt),
        updatedAt: dateToString2(booking._doc.updatedAt)
    }
};

const transformComment = comment => {
    return {
        ...comment._doc,
        author: user.bind(this, comment._doc.author),
        post: singleEvent.bind(this, comment._doc.post),
        createdAt: dateToString2(comment._doc.createdAt),
        updatedAt: dateToString2(comment._doc.updatedAt)
    }
}







exports.user = user;
// exports.events = events;
exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.transformComment = transformComment;