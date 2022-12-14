const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const awsUploadImage = require("../utils/aws-upload-image");

// TOKEN
function createToken(user, SECRET_KEY, expiresIn) {
    const { id, name, email, username } = user;

    // Objeto de datos que mandamos a JWT para que genere el TOKEN
    const payload = {
        id,
        name,
        email,
        username,
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

async function getUser(id, username) {
    let user = null;

    if (id) user = await User.findById(id);
    if (username) user = await User.findOne({ username });
    if (!user) throw new Error("El usuario no existe");

    return user;
}

async function register(input) {
    const newUser = input;
    // Formateo a minuscula del email e username
    newUser.email = newUser.email.toLowerCase();
    newUser.username = newUser.username.toLowerCase();

    const { email, username, password } = newUser;

    // Revisamos si el email esta en uso
    const foundEmail = await User.findOne({ email });
    if (foundEmail) throw new Error("El email ya esta en uso");
    console.log(foundEmail);

    // Revisamos si el username esta en uso
    const foundUsername = await User.findOne({ username });
    if (foundUsername) throw new Error("El nombre de usuario ya esta en uso");
    console.log(foundUsername);

    // Encrpytar passwords
    const salt = await bcryptjs.genSaltSync(10);
    newUser.password = await bcryptjs.hash(password, salt);

    try {
        const user = new User(newUser);
        user.save();

        return user;
    } catch (error) {
        console.log(error);
    }
}

async function login(input) {
    const { email, password } = input;

    // Verificar si el usuario existe -> de esta forma evitamos hacer login que un usuario que no existe
    const userFound = await User.findOne({
        email: email.toLowerCase(),
    }); /* null or user object */
    if (!userFound) throw new Error("Error en el email o contrase??a");

    const passwordSucces = await bcryptjs.compare(password, userFound.password);
    // Si passwordSucces is null or false
    if (!passwordSucces) throw new Error("Error en el email o contrase??a");

    return {
        token: createToken(userFound, process.env.SECRET_KEY, "24h"),
    };
}

async function updateAvatar(file, ctx) {
    // Extraer el id del usuario para utilizarlo para guardar imgs
    const { id } = ctx.user;

    // Vamos a pasar el id por el HEADER
    // Para esto accedemos al token

    const { createReadStream, mimetype } = await file;
    const extension = mimetype.split("/")[1];
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
        };
    } catch (error) {
        return {
            status: false,
            urlAvatar: null,
        };
    }
}

async function deleteAvatar(ctx) {
    const { id } = ctx.user;

    try {
        // La peticion llega a este punto y la ejecuta
        // cambiando el estado del avatar a un string vacio.
        await User.findByIdAndUpdate(id, { avatar: "" });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function updateUser(input, ctx) {
    const { id } = ctx.user;

    try {
        if (input.currentPassword && input.newPassword) {
            // Cambiar password

            const userFound = await User.findById(id);
            const passwordSuccess = await bcryptjs.compare(
                input.currentPassword /* passwod que ingresa el cliente */,
                userFound.password /* password encriptada en la base de datos */
            );

            if (!passwordSuccess) throw new Error("Contrase??a incorrecta");

            // Generar nueva password encriptada y guardar en DB:
            const salt = await bcryptjs.genSaltSync(10);
            const newPasswordCrypt = await bcryptjs.hash(
                input.newPassword,
                salt
            );

            console.log(newPasswordCrypt);

            await User.findByIdAndUpdate(id, { password: newPasswordCrypt });
        } else {
            await User.findByIdAndUpdate(id, input);
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function search(search) {
    const users = await User.find({
        name: { $regex: search, $options: "i" },
    });

    return users;
}

module.exports = {
    register,
    getUser,
    login,
    updateAvatar,
    deleteAvatar,
    updateUser,
    search,
};
