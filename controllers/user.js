const User = require("../models/user");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const awsUploadImage = require("../utils/aws-upload-image");

// TOKEN
function createToken(user, SECRET_KEY, expiresIn) {

     const { id, name, email, username } = user;

     // Objeto de datos que mandamos a JWT para que genere el TOKEN
     const payload = {
          id,
          name,
          email,
          username
     };

     return jwt.sign(payload, SECRET_KEY, { expiresIn });

}

async function getUser(id, username) {

     let user = null;

     if (id) user = await User.findById(id);
     if (username) user = await User.findOne({ username });
     if (!user) throw new Error('El usuario no existe');

     return user;
};

async function register(input) {

     const newUser = input;
     // Formateo a minuscula del email e username
     newUser.email = newUser.email.toLowerCase();
     newUser.username = newUser.username.toLowerCase();

     const { email, username, password } = newUser;

     // Revisamos si el email esta en uso
     const foundEmail = await User.findOne({ email });
     if (foundEmail) throw new Error('El email ya esta en uso');
     console.log(foundEmail)

     // Revisamos si el username esta en uso
     const foundUsername = await User.findOne({ username });
     if (foundUsername) throw new Error('El nombre de usuario ya esta en uso');
     console.log(foundUsername)

     // Encrpytar passwords
     const salt = await bcryptjs.genSaltSync(10);
     newUser.password = await bcryptjs.hash(password, salt);

     try {
          const user = new User(newUser);
          user.save();

          return user;
     } catch (error) {
          console.log(error)
     }

};

async function login(input) {
     const { email, password } = input;

     // Verificar si el usuario existe -> de esta forma evitamos hacer login que un usuario que no existe
     const userFound = await User.findOne({ email: email.toLowerCase() }); /* null or user object */
     if (!userFound) throw new Error('Error en el email o contraseña');


     const passwordSucces = await bcryptjs.compare(password, userFound.password);
     // Si passwordSucces is null or false
     if (!passwordSucces) throw new Error('Error en el email o contraseña');

     return {
          token: createToken(userFound, process.env.SECRET_KEY, '24h')
     };

}

async function updateAvatar(file, ctx) {

     // Extraer el id del usuario para utilizarlo para guardar imgs
     const { id } = ctx.user

     // Vamos a pasar el id por el HEADER
     // Para esto accedemos al token 

     const { createReadStream, mimetype } = await file;
     const extension = mimetype.split('/')[1];
     const imageName = `avatar/${id}.${extension}`;
     const fileData = createReadStream();

     console.log(imageName);

     try {

          const result = await awsUploadImage(fileData, imageName);
          await User.findByIdAndUpdate(id, { avatar: result });

          // console.log(result); -> https://instaclone-react-gql.s3.amazonaws.com/avatar/62f186e57671ab93f5d81df8.png
          return {
               status: true,
               urlAvatar: result,
          }

     } catch (error) {
          return {
               status: false,
               urlAvatar: null
          }
     }

}

module.exports = {
     register,
     getUser,
     login,
     updateAvatar,
};