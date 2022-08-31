const Publication = require("../models/publication");
const Follow = require("../models/follow");
const awsUploadImage = require("../utils/aws-upload-image");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");

async function publish(file, ctx) {
   // Subir a aws y luego guardar el regisstro en la DB
   const { id } = ctx.user; /* id del usuario que creo la publicacion */
   console.log(ctx);
   const { createReadStream, mimetype } = await file;
   console.log(id);

   const extension = mimetype.split("/")[1];
   const fileName = `publication/${uuidv4()}.${extension}`;
   const fileData = createReadStream();

   try {
      const result = await awsUploadImage(fileData, fileName);
      const publication = new Publication({
         idUser: id,
         file: result,
         typeFile: mimetype.split("/")[0],
         createAt: Date.now(),
      });
      // console.log(publication);
      publication.save();

      // lo que retorna al cliente para posteriormente mostrarlo
      return {
         status: true,
         urlFile: result,
      };
   } catch (error) {
      return {
         status: null,
         urlFile: "",
      };
   }

   return null;
}

async function getPublications(username) {
   const user = await User.findOne({
      username,
   }); /* Devuelve los datos del usuario que mandamos */
   if (!user) throw new Error("Usuario no encontrado");

   // constante para guardar todas las publicaciones del usuario
   const publications = await Publication.find()
      .where({ idUser: user._id })
      .sort({ createAt: -1 });
   // where => Trear todas las publicaciones que tenga como idUser
   // el id del usuario que estamos pasando
   // sort => filtra por la propiedad createAd y ordena de
   // manera que la primera publi sea la mas actual y la mas vieja

   return publications;
}

async function getPublicationsFolloweds(ctx) {
   // * 1. Obtener los datos(USER) de todos los usuarios que sigue la cuenta logeada:
   const followeds = await Follow.find({ idUser: ctx.user.id }).populate(
      "follow"
   );

   // 2. Crear un array solo de los datos de los usuarios, para despues poder iterarla
   // y poder obtener de cada user todas sus publicaciones

   const followedsList = [];
   for await (const data of followeds) {
      followedsList.push(data.follow);
   }
   console.log(followedsList);

   // 3. Obtener las listas de todos nuestros usuarios
   const publicationList = [];
   for await (const data of followedsList) {
      const publications = await Publication.find()
         .where({
            idUser: data._id,
         })
         .sort({ createAt: -1 })
         .limit(10)
         .populate("idUser");
      publicationList.push(
         ...publications
      ); /* [{}, {}, {}] => ... => {} ,{} ,{} */
   }

   // Ordenar por fechas
   const result = publicationList.sort((a, b) => {
      return new Date(b.createAt) - new Date(a.createAt);
   });

   return result;
}

module.exports = {
   publish,
   getPublications,
   getPublicationsFolloweds,
};
