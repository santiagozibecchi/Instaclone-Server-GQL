const Like = require("../models/like");

// Hay que guardar en la base de datos el id de la publicacion y el
// id del usuario que esta dando like
async function addLike(idPublication, ctx) {
   try {
      // Pasamos los parametros al modelo Like
      const like = await new Like({
         idPublication,
         idUser: ctx.user.id,
      });

      like.save();

      return true;
   } catch (error) {
      console.log(error);
      return false;
   }
}

module.exports = {
   addLike,
};
