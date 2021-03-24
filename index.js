const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGODB } = require("./config.js");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");

const PORT = process.env.port || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to db");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`server running at ${res.url}`);
  })
  .then((err) => {
    console.error(err);
  });
