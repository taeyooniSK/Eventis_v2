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
    price: Float!
    date: String! 
    img: String
    cancelled: Boolean
    comments: [Comment!]
    creator: User!
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
    text: String!
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}


input EventInput {
    title: String!
    description: String!
    price: Float!
    img: String
    date: String!
}

input UpdatedEventInput {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
}

input UserInput {
    email: String!
    password: String!
}

type RootQuery {
    event(eventID: ID!): Event!
    events: [Event!]! 
    myEvents(userID: ID!): [Event!]!
    cancelledEvents(userID: ID!): [CancelledEvents!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    editEvent(updatedEventInput: UpdatedEventInput): Event
    cancelEvent(eventID: ID!): Event
    deleteEvent(eventID: ID!): Event
    createUser(userInput: UserInput): User
    bookEvent(eventID: ID!): Booking!
    cancelBooking(bookingID: ID!): Event!
    deleteBooking(bookingID: ID!): DeleteResponse
    createComment(commentInput: CommentInput) : Comment
}


type DeleteResponse {
    ok: String!
    err: String!
}

input CommentInput {
    eventId : ID!
    author: ID!
    text: String!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);