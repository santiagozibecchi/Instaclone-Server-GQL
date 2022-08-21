const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublicationSchema = Schema({
   // ID del usuario -> proviene del modelo "User"
   idUser: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
   },
   // url del fichero
   file: {
      type: String,
      trim: true,
      require: true,
   },
   // Tipo de fichero
   typeFile: {
      type: String,
      trim: true,
   },
   createAt: {
      type: Data,
      default: Date.now(),
   },
});

module.export = mongoose.model("Publication", PublicationSchema);
