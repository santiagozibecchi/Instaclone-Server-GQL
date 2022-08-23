const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = Schema({
   // Para saber de que publicacion se trata 
   idPublication: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Publication",
   },
   // id del usuario que ha enviado el comentario
   idUser: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
   },
   comment: {
      type: String,
      trim: true,
      require: true,
   },
   createAt: {
      type: Date,
      default: Date.now(),
   },
});

module.exports = mongoose.model("Comment", CommentSchema);
