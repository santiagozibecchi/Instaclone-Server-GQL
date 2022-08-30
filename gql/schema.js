// Tipos que va a utilizar graphQL
// type -> Lo que va a devover cuando haga la peticion y nos pidan un usuario

// En graphQL es el cliente el que decide que datos le va a mandar el servidor de
// todos los que tiene disponible

// Query que sirven para obtener datos
// Mutations -> Para enviar datos al servidor y crear un usuario

const { gql } = require("apollo-server");

const typeDefs = gql`
   scalar Upload

   type User { # En el tipo se definen todos los datos que puede devolver la peticion
      id: ID
      name: String
      username: String
      email: String
      siteWeb: String
      description: String
      password: String
      avatar: String
      createAt: String
   }
   type Token {
      token: String
   }

   type UpdateAvatar {
      status: Boolean
      urlAvatar: String
   }

   type Publish {
      status: Boolean
      urlFile: String # url que se va a generar en aws S3
   }

   type Publication {
      id: ID # id de la publicacion
      idUser: ID # id del usuario que ha publicado
      file: String
      typeFile: String
      createAt: String
   }

   type Comment {
      idPublication: ID
      idUser: User
      comment: String
      createAt: String
   }

   # Siempre se intenta poder el tipo y despues en input para saber lo que le vamos a mandar
   # Datos que queremos que nos lleguen para poder realizar dicha accion

   # TIPOS DE INPUTS
   input UserInput {
      name: String!
      username: String!
      email: String!
      password: String!
   }
   input LoginInput {
      email: String!
      password: String!
   }

   # Se agrega name e email para que pueda hacer todas las actualizaciones que estamos requiriendo
   input UserUpdateInput {
      name: String
      email: String
      currentPassword: String
      newPassword: String
      siteWeb: String
      description: String
   }

   input CommentInput {
      idPublication: ID
      comment: String
   }

   # QUERIES Y MUTATIONS

   type Query {
      # ------------------ User -----------------------
      getUser(id: ID, username: String): User

      search(search: String): [User] #Devuelve un array de usuarios
      # ------------------ Follow ----------------------
      isFollow(username: String!): Boolean
      getFollowers(username: String!): [User] # obtener seguidores
      getFolloweds(username: String!): [User] # obtener seguidos
      # ------------------ Publication -----------------

      getPublications(username: String!): [Publication]

      # ------------------ Comment ---------------------
      getComments(idPublication: ID!): [Comment]

      # ------------------ Likes ---------------------
      isLike(idPublication: ID!): Boolean # Para comprobar si un usuario ha dado like a una publicacion
   }

   type Mutation {
      # ------------------ User ------------------
      register(input: UserInput): User
      login(input: LoginInput): Token
      updateAvatar(file: Upload): UpdateAvatar #FileUpload ya esta definido en gql pero hay que traerlo
      deleteAvatar: Boolean
      updateUser(input: UserUpdateInput): Boolean # true en caso de una actualizacion correcta y false en caso de cualquier tipo de error
      # ------------------ Follow -----------------
      follow(username: String!): Boolean
      unFollow(username: String!): Boolean

      # ------------------ Publication -------------
      publish(file: Upload): Publish

      # ------------------ Comment -----------------
      addComment(input: CommentInput): Comment

      # ------------------ Likes -----------------
      addLike(idPublication: ID!): Boolean
      deleteLike(idPublication: ID!): Boolean
   }
`;

module.exports = typeDefs;
