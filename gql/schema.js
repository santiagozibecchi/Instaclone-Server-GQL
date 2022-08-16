// Tipos que va a utilizar graphQL
// type -> Lo que va a devover cuando haga la peticion y nos pidan un usuario 

// En graphQL es el cliente el que decide que datos le va a mandar el servidor de 
// todos los que tiene disponible

// Query que sirven para obtener datos
// Mutations -> Para enviar datos al servidor y crear un usuario

const { gql } = require('apollo-server');


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

     # QUERIES Y MUTATIONS

     type Query {
          # User 
          getUser(id: ID, username: String): User
     }

     type Mutation {
          #User
          register(input: UserInput): User
          login(input: LoginInput): Token
     # Para actualizar el avatar del usuario
          updateAvatar(file: Upload): UpdateAvatar #FileUpload ya esta definido en gql pero hay que traerlo
          deleteAvatar: Boolean
          updateUser(input: UserUpdateInput): Boolean # true en caso de una actualizacion correcta y false en caso de cualquier tipo de error
     }
`;

module.exports = typeDefs;