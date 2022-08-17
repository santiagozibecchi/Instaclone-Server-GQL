const userController = require('../controllers/user');
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');

const resolvers = {
     Upload: GraphQLUpload,

     Query: {
          // User
          getUser: (_, { id, username }) => userController.getUser(id, username),
          search: (_, { search }) => userController.search(search),
     },

     Mutation: {
          // User - El tercer parametro es el contexto -> viene el token desde el header
          register: (_, { input }) => userController.register(input),
          login: (_, { input }) => userController.login(input),
          // ctx -> Objeto user
          updateAvatar: (_, { file }, ctx) => userController.updateAvatar(file, ctx),
          deleteAvatar: (_, { }, ctx) => userController.deleteAvatar(ctx),
          updateUser: (_, { input }, ctx) => userController.updateUser(input, ctx),
     },

};

module.exports = resolvers;