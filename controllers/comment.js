const Comment = require("../models/comment");

function addComment(input, ctx) {
   try {
      const comment = new Comment({
         idPublication: input.idPublication,
         idUser: ctx.user.id,
         comment: input.comment,
      });

      comment.save();
      return comment;
   } catch (error) {
      console.log(error);
   }
}

async function getComments(idPublication) {
   // populate para tambien obtener los datos del usuario que ha enviado el comentario
   const result = await Comment.find({ idPublication }).populate("idUser");

   return result;
}

module.exports = {
   addComment,
   getComments,
};
