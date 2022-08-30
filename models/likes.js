const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = Schema({
   // * Para guardar el id de la publicacion a la que se ha 
   // * hecho el like
   idPublication: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Publication",
   },
   // * Para saber que usuario agrego el like
   // * id del usuario que ha realizado el like
   idUser: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
   },
});

module.exports = mongoose.model("Like", LikeSchema);
