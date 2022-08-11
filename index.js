const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolver');
require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.BBDD, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify: true,
     useCreateIndex: true,
}, (err, _) => {
     if (err) {
          console.log(err);
     } else {
          // console.log("Success Conection!");
          server();
     }
});

async function server() {
     const serverApollo = new ApolloServer({
          typeDefs,
          resolvers,
     });

     await serverApollo.start();
     const app = express();
     app.use(graphqlUploadExpress());
     serverApollo.applyMiddleware({ app });
     await new Promise((r) => app.listen({ port: process.env.PORT || 4000 }, r));

     console.log('--------------------------------------------------------------------------------------');
     console.log(`Server ready at http://localhost:4000${serverApollo.graphqlPath}`);
     console.log('--------------------------------------------------------------------------------------');


}