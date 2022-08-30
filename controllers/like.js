const Like = require("../models/like");

// Hay que guardar en la base de datos el id de la publicacion y el
// id del usuario que esta dando like

// MUTATION
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

async function deleteLike(idPublication, ctx) {
   try {
      // * Para borrar el like de la publicacion y que solo sea del usuario
      // * que anteriormente puso like
      await Like.findOneAndDelete({ idPublication }).where({
         idUser: ctx.user.id,
      }); /* donde el idUser y el que dio su like previamente,
         de esta manera evitamos eliminar todos los like del post
      */

      return true;
   } catch (error) {
      console.log(error);
      return false;
   }
}

// QUERY
async function isLike(idPublication, ctx) {
   try {
      //* Busca un registro en la coleccion de LIKES que tenga como idPublication
      //* el id de la publicacion y como idUser el id del usuario activo en la cuenta
      const result = await Like.findOne({ idPublication }).where({
         idUser: ctx.user.id,
      });
      // Si existe significa que el usuario ha dado like a la publicacion
      // caso contrario, no ha dado like

      if (!result) throw new Error("No le ha dado like");

      return true; /* El usuario si ha dado like */
   } catch (error) {
      console.log(error);
      return false;
   }
}

module.exports = {
   addLike,
   deleteLike,
   isLike,
};
