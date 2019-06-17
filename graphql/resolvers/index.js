const authResolver = require("./auth");
const eventsResolvers = require("./events");
const bookingResolvers = require("./booking");
const commentsResolvers = require("./comments");

const rootResolver = {
    ...authResolver,
    ...eventsResolvers,
    ...bookingResolvers,
    ...commentsResolvers
}

module.exports = rootResolver;