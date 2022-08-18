const Follow = require('../models/follow');
const User = require('../models/user');

// Mutation
async function follow(username, ctx) {

     // console.log(username) => Usuario que vamos a seguir
     // console.log(ctx) => Usuario que lo va a seguir

     // Comprobamos que el usuario exista
     const userFound = await User.findOne({ username }); /* Devuelve el objeto usuario con todos los datos de la db */
     if (!userFound) throw new Error('Usuario no encontrado');

     try {

          const follow = new Follow({
               idUser: ctx.user.id,
               follow: userFound._id
          });

          follow.save();
          return true;

     } catch (error) {
          console.log(error);
          return false;
     }
}

// Query
async function isFollow(username, ctx) {

     const userFound = await User.findOne({ username });
     if (!userFound) throw new Error('Usuario no encontrado');

     // Buscamos si estamos siguiendo al usuario 
     const follow = await Follow.find({ idUser: ctx.user.id })
          .where('follow')
          .equals(userFound._id);

     console.log(follow);

     if (follow.length > 0) {
          return true
     }

     return false;
}

module.exports = {
     follow,
     isFollow,
}
