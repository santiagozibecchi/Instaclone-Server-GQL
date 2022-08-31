const Follow = require("../models/follow");
const User = require("../models/user");

// Mutation
async function follow(username, ctx) {
   // console.log(username) => Usuario que vamos a seguir
   // console.log(ctx) => Usuario que lo va a seguir

   // Comprobamos que el usuario exista
   const userFound = await User.findOne({
      username,
   }); /* Devuelve el objeto usuario con todos los datos de la db */
   if (!userFound) throw new Error("Usuario no encontrado");

   try {
      const follow = new Follow({
         idUser: ctx.user.id,
         follow: userFound._id,
      });

      follow.save();
      return true;
   } catch (error) {
      console.log(error);
      return false;
   }
}

async function unFollow(username, ctx) {
   const userFound = await User.findOne({ username });
   // Si existe el usuario entre los que estamos siguiendo
   const follow = await Follow.deleteOne({ idUser: ctx.user.id })
      .where("follow")
      .equals(userFound._id);

   // console.log(follow);

   if (follow.deletedCount > 0) {
      return true;
   }

   return false;
}

// Query
async function isFollow(username, ctx) {
   const userFound = await User.findOne({ username });
   if (!userFound) throw new Error("Usuario no encontrado");

   // Buscamos si estamos siguiendo al usuario
   const follow = await Follow.find({ idUser: ctx.user.id })
      .where("follow")
      .equals(userFound._id);

   // console.log(follow);

   if (follow.length > 0) {
      return true;
   }

   return false;
}

async function getFollowers(username) {
   // usuario seleccionado o que quiero saber sus seguidores
   const user = await User.findOne({ username });

   const followers = await Follow.find({
      follow:
         user._id /* para obtener todos los usuario que  me estan siguiendo */,
   }) /* Esto extrae el usuario con todas las propiedades */
      .populate("idUser");

   const followersList = [];

   // for asincrono => espera a que el for termine para ejecutar
   for await (const data of followers) {
      followersList.push(data.idUser);
   }

   return followersList;
}

async function getFolloweds(username) {
   const user = await User.findOne({ username });

   // El resultado es un array
   const followeds = await Follow.find({
      // Que me devuelva todos los registros que tengas en Follow donde
      // el idUser sea exactamente igual al user que seleccionamos entre los seguidos
      idUser: user._id /* el ID de mi usuario */,
   }).populate(
      "follow"
   ); /* para obtener todos los datos del usuario al que sigo */

   // console.log(followeds);

   const followedsList = [];

   for await (const data of followeds) {
      followedsList.push(data.follow);
   }

   return followedsList;
}

async function getNotFolloweds(ctx) {
   const users = await await User.find().limit(50);
   const arrayUsers = [];

   // Buscamos en cada uno de los usuarios que nos ha llegado en la
   // coleccion Follow para saber si el usuario, esta siguien o no
   // Si no lo sigue, mostramos
   for await (const user of users) {
      const isFind = await Follow.findOne({
         idUser: ctx.user.id,
      })
         .where("Follow")
         .equals(user._id);

      // Comprobamos si seguimos al usuario
      // si no lo sigue entra ...
      if (!isFind) {
         // Para que no muestre al mismo usuario
         if (user._id.toString() !== ctx.user.id.toString()) {
            arrayUsers.push(user);
         }
      }
   }
   return arrayUsers;
}

module.exports = {
   follow,
   isFollow,
   unFollow,
   getFollowers,
   getFolloweds,
   getNotFolloweds,
};
