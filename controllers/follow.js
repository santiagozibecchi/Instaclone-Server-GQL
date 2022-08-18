const Follow = require('../models/follow');
const User = require('../models/user');

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

module.exports = {
     follow,
}
