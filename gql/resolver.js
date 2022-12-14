const GraphQLUpload = require("graphql-upload/GraphQLUpload.js");
const userController = require("../controllers/user");
const followController = require("../controllers/follow");
const publicationController = require("../controllers/publication");
const commentController = require("../controllers/comment");
const likeController = require("../controllers/like");

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
      getNotFolloweds: (_, {}, ctx) => followController.getNotFolloweds(ctx),

      // * Publications
      getPublications: (_, { username }) =>
         publicationController.getPublications(username),
      getPublicationsFolloweds: (
         _,
         {},
         ctx /* ctx para sacar el id del usuario que esta haciendo la peticion
            y poder sacar todos los usuarios que sigue y luego obtener todas las 
            publicacion que tienen
         */
      ) => publicationController.getPublicationsFolloweds(ctx),

      // Comment
      getComments: (_, { idPublication }) =>
         commentController.getComments(idPublication),

      // Likes
      isLike: (_, { idPublication }, ctx) =>
         likeController.isLike(idPublication, ctx),
      countLikes: (_, { idPublication }) =>
         likeController.countLikes(idPublication),
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

      // Publication
      publish: (_, { file }, ctx) => publicationController.publish(file, ctx),

      // Comment
      addComment: (_, { input }, ctx) =>
         commentController.addComment(input, ctx),

      // Likes
      addLike: (_, { idPublication }, ctx) =>
         likeController.addLike(idPublication, ctx),
      deleteLike: (_, { idPublication }, ctx) =>
         likeController.deleteLike(idPublication, ctx),
   },
};

module.exports = resolvers;
