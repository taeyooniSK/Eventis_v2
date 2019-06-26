// mongoose Schema
const User = require("../../models/user");
const Event = require("../../models/event");
const Booking = require("../../models/booking");
const Comment = require("../../models/comment");
const CancelledEvent = require("../../models/cancelledEvent");

// functions for merging

const { transformEvent } = require("./populate");

// Resolvers for events

module.exports = { // javascript object where all the resolver functions are in 
    event: async (args) => {
        try {
            const event = await Event.findById({_id: args.eventID});
            return transformEvent(event);
         } catch(err){
             throw err;
         }
    },
    events: async () => {
        try {
           const events = await Event.find({});
           console.log(events);
           return events.map(event => {
                return transformEvent(event);
           });
        } catch(err){
            throw err;
        }
    },
    cancelledEvents : async (args, req) => {
        if (!req.isAuthenticated){
            throw new Error("It's not authenticated!");
        }
        try {
            const cancelledEvents = await CancelledEvent.findById({user: args.userID}).populate("event");
            console.log(cancelledEvents);
            return cancelledEvents.map(event => {
                return transformEvent(event);
            })
        } catch(err) {
            throw err;
        }
    },
    myEvents: async (args, req) => {
        if (!req.isAuthenticated){
            throw new Error("It's not authenticated!");
        }
        try{
            const myEvents = await Event.find({creator: args.userID });
            return myEvents.map(event => {
                return transformEvent(event);
            });
        } catch(err) {
            throw err;
        }
    },
    createEvent : async (args, req) => { // createEvent(resolver)'s args contains all arguments put into createEvent's arguments in mutation type
      if (!req.isAuthenticated){
          throw new Error("It's not authenticated!");
      }
        const event = new Event({
            title: args.eventInput.title,  
            description: args.eventInput.description,
            price: +args.eventInput.price,
            img: args.eventInput.img,
            location: args.eventInput.location,
            startDateTime: new Date(args.eventInput.startDateTime),
            endDateTime: new Date(args.eventInput.endDateTime),
            creator: req.userId // user who is authenticated
        });
        let createdEvent; // this variable is going to contain event that is created by createEvent resolver
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);
            const creator = await User.findById({_id: result._doc.creator });
            // when user not found
            if(!creator){
                throw new Error("User is not found!");
            }
                
            // when user found, save event and save event in User's createdEvents field in database
            creator.createdEvents.push(event);
            await creator.save();
            console.log(createdEvent);
            return createdEvent; // when querying, I can get this newly created event
        } catch(err){
            console.log(err);
            throw err;
        }
    },
    editEvent : async (args, req) => {
        if (!req.isAuthenticated){
            throw new Error("It's not authenticated!");
        }
        try {
            const eventToUpdate = await Event.findByIdAndUpdate({_id: args.updatedEventInput._id}, { $set : {
                title: args.updatedEventInput.title,  
                description: args.updatedEventInput.description,
                price: +args.updatedEventInput.price,
                startDateTime: args.updatedEventInput.startDateTime,
                endDateTime: args.updatedEventInput.endDateTime,
                img: args.updatedEventInput.img,
                location: args.updatedEventInput.location,
                creator: req.userId 
            }});

            const event = await Event.findById({_id: args.updatedEventInput._id});
            return event._doc;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    cancelEvent : async (args, req) => {
        if (!req.isAuthenticated){
            throw new Error("It's not authenticated!");
        }
        try {
            const eventToCancel = await Event.findByIdAndUpdate({_id: args.eventID}, { $set : {
                cancelled: true
            }});
            console.log(eventToCancel);
            return transformEvent(eventToCancel)
           
        } catch(err) {
            throw err;
        }
    },
    deleteEvent: async (args, req) => {
        if (!req.isAuthenticated){
            throw new Error("It's not authenticated!");
        }
        try {
            // const eventToDeleteInCreatedEvents = await User.findById({_id: args.deleteEventInput.userID}, (err, foundDoc) => {
            //     if (err) console.log(err);
            //     console.log("foundDoc", foundDoc);
            //     const index = foundDoc.createdEvents.findIndex(elem => {
            //         return elem === args.deleteEventInput.eventID;
            //     })
            //     foundDoc.createdEvents.splice(index, 1);
            // });


            // const eventToDeleteInCreatedEvents = await User.find({_id: req.userId}, { "createdEvents": { $elemMatch: {id : args.deleteEventInput.eventID} } }, async (err, foundDoc) => {
            //     if(err) console.log(err);
            //     try {
            //         console.log("I found the id in createdEvents", foundDoc);
            //     }catch(err){
            //         throw err;
            //     }
            // });
            // const foundUser =  User.find({_id: req.userId}, (err, foundDoc) => {
            //     if (err) console.log(err);
            //     const index = foundDoc[0].createdEvents.findIndex(event => {
            //         return event === args.deleteEventInput.eventID;
            //     });
            //     return foundDoc[0].createdEvents.splice(index, 1);

            // });
            // console.log(foundUser);

           const foundUser = await User.find({_id: req.userId});
        //    console.log(foundUser[0].createdEvents);
        // console.log(args.deleteEventInput.eventID);
            const createdEvents = foundUser[0].createdEvents;
           for ( let i= 0; i < createdEvents.length; i++){
                if(createdEvents[i] == args.deleteEventInput.eventID){
                    delete createdEvents[i];
                    User.save(createdEvents);
                }
           }
            // console.log(foundUser[0].createdEvents);

            // const foundUser = await User.update({_id: req.userId}, {
            //     $pull: { createdEvents: {$elemMatch : {_id: args.deleteEventInput.eventID} } }
            // })

            console.log(foundUser);


            // console.log("deleted Event in createdEvents", eventToDeleteInCreatedEvents);
            
            // // await User.save();
            // // console.log("event deleted in user's createdEvents", eventToDeleteInCreatedEvents);
            // // const commentsInEvent = await Event.findOneAndRemove({_id: args.deleteEventInput.eventID , comments: {}});
            // const commentsToDelete  = await Comment.deleteMany({ post : args.deleteEventInput.eventID });
            // // await Comment.save();
            // console.log(commentsToDelete);
            // const eventToDelete = await Event.findByIdAndDelete({_id: args.deleteEventInput.eventID});
            // console.log(eventToDelete);
            // const deletedBooking = await Booking.findOneAndDelete({event: args.deleteEventInput.eventID});
            // console.log("Booking deleted : ", deletedBooking);
            // // 여기에 User's createdEvents에서 이벤트도 지워줘야함
            // return deletedBooking;
        } catch(err) {
            throw err;
        }
    }
}