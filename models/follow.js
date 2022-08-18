const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = Schema({
     idUser: { /* Usuario de la cuenta */
          type: Schema.Types.ObjectId, /* para poder extraer luego la informacion del usuario */
          require: true,
          ref: 'User'
     },
     follow: { /* usuarios que siguen al Usuario de la cuenta */
          type: Schema.Types.ObjectId,
          require: true,
          ref: 'User'
     },
     createAt: {
          type: Date,
          default: Date.now()
     }
});

module.exports = mongoose.model('Follow', FollowSchema);
