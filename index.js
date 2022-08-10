const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolver');
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.BBDD, {
     useNewUrlParser: true,
     useUnifiedTopology: true
}, (err, _) => {
     if (err) {
          console.log(err);
     } else {
          // console.log("Success Conection!");
          server();
     }
});

function server() {
     const serverApollo = new ApolloServer({
          typeDefs,
          resolvers,
          csrfPrevention: true,
          cache: 'bounded',
          plugins: [
               ApolloServerPluginLandingPageLocalDefault({ embed: true }),
          ],
     })

     serverApollo.listen().then(({ url }) => {
          console.log('-------------------------------------------')
          console.log(`🚀  Server ready at ${url}`);
          console.log('-------------------------------------------')
     })
}