const GraphQLUpload = require("graphql-upload/GraphQLUpload.js");
const userController = require("../controllers/user");
const followController = require("../controllers/follow");

const resolvers = {
   Upload: GraphQLUpload,

   Query: {
      // User
      getUser: (_, { id, username }) => userController.getUser(id, username),
      search: (_, { search }) => userController.search(search),

      // Follow
      isFollow: (_, { username }, ctx) =>
         followController.isFollow(username, ctx),
      getFollowers: (_, { username }) =>
         followController.getFollowers(username),
      getFolloweds: (_, { username }) =>
         followController.getFolloweds(username),
   },

   Mutation: {
      // User - El tercer parametro es el contexto -> viene el token desde el header
      register: (_, { input }) => userController.register(input),
      login: (_, { input }) => userController.login(input),
      // ctx -> Objeto user
      updateAvatar: (_, { file }, ctx) =>
         userController.updateAvatar(file, ctx),
      deleteAvatar: (_, {}, ctx) => userController.deleteAvatar(ctx),
      updateUser: (_, { input }, ctx) => userController.updateUser(input, ctx),

      // Follow
      follow: (_, { username }, ctx) => followController.follow(username, ctx),
      unFollow: (_, { username }, ctx) =>
         followController.unFollow(username, ctx),
   },
};

module.exports = resolvers;
