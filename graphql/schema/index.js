const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Booking {
    _id: ID!
    event : Event!
    user : User!
    createdAt : String!
    updatedAt : String!
}

type CancelledEvents {
    _id: ID!
    event: Event!
    user: User!
    createdAt : String!
    updatedAt : String!
}

type Event {
    _id : ID!
    title: String!
    description: String!
    price: Float
    startDateTime: String!
    endDateTime : String! 
    img: String
    location: String
    cancelled: Boolean
    comments: [Comment!]
    creator: User!
    bookers: [Bookers!]
    likes: [Like!]
}

type User {
    _id : ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

type Comment {
    _id : ID!
    author: User!
    post: Event!
    text: String!
    createdAt : String!
    updatedAt : String!
}
type Bookers{
    _id: ID!
    userId: String!
    bookedAt: String!
}
type Like{
    _id: ID
    eventId: String
    userId: String
    likedAt: String
}

type AuthData {
    userId: ID!
    token: String!
    email: String!
    tokenExpiration: Int!
}

input EventInput {
    title: String!
    description: String!
    price: Int
    img: String
    startDateTime: String!
    endDateTime: String!
    location: String! 
}

input UpdatedEventInput {
    _id: ID!
    title: String!
    description: String!
    price: Float
    img: String
    startDateTime: String!
    endDateTime: String!
    location: String! 
}

input DeleteEventInput {
    userID: ID!
    eventID: ID!
}

input UserInput {
    email: String!
    password: String!
}

type Count {
    count: Int
}


type RootQuery {
    event(eventID: ID!): Event!
    events: [Event!]! 
    myEvents(userID: ID!): [Event!]!
    cancelledEvents(userID: ID!): [CancelledEvents!]!
    bookings: [Booking!]!
    countRegistrations(eventID: ID!): Count
    login(email: String!, password: String!): AuthData!
}


type RootMutation {
    createEvent(eventInput: EventInput): Event
    editEvent(updatedEventInput: UpdatedEventInput): Event
    cancelEvent(eventID: ID!): Event
    deleteEvent(deleteEventInput: DeleteEventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventID: ID!, userID: String!): Booking!
    cancelBooking(bookingID: ID!, eventID: ID!, userID: String!): Event!
    deleteBooking(bookingID: ID!): DeleteResponse
    createComment(commentInput: CommentInput) : Comment
    likeEvent(eventID: ID!, userID: String!): Like
    unlikeEvent(eventID: ID!, userID: String!): Like
    
}


type DeleteResponse {
    ok: String!
    err: String!
}

input CommentInput {
    post: ID!
    author: ID!
    text: String!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);