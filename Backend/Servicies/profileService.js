const userRepository = require('../Repositories/profileRepository');
const User = require('../Models/Users');

//obtener perfil completo de un usuario
async function getUserProfile(userId) {
    //valida q el userId sea valido, osea q exista
    if (!userId || isNaN(Number(userId))) {
        throw new Error('ID de usuario no valido.');
    }

    try {
        const userData = await userRepository.getUserById(userId);
        if (!userData) {
            throw new Error('Usuario no encontrado.');
        }
        //objeto user
        const user = new User(
            userData.id,
            userData.name,
            userData.username,
            userData.bio,
            userData.profile_picture,
            userData.created_at,
            userData.score
        );
        //obtener factos y logros del usuario
        const factos = await userRepository.getUserFactos(userId);
        const trophies = await userRepository.getUserTrophies(userId);
        
        return {
            user,
            factos,
            trophies
        };
    } catch (err) {
        throw err;
    }
}


//actualizar o editar perfil de usuario
async function updateUserProfile(userId, name, username, bio, profilePicture) {
    if (!userId || isNaN(Number(userId))) {
        throw new Error("ID de usuario no valido.");
    }
    //validar name
    if (name && name.length > 40) {
        throw new Error('El nombre no puede tener mas de 40 caracteres.');
    }
    //validar username
    if (username && username.length > 20) {
        throw new Error('El username no puede tener mas de 20 caracteres.');
    }
    //validar bio
    if (bio && bio.length > 200) {
        throw new Error('La biografia no puede tener mas de 200 caracteres.');
    }
    //validar url de foto
    if (profilePicture && profilePicture.length > 500) {
        throw new Error('URL de imagen demasiado larga.');
    }

    try {
        //verifica si el username ya esta en uso
        if (username) {
            const existingUser = await userRepository.getUserByUsername(username);
            if (existingUser && existingUser.id !== userId) {
                throw new Error('El username ya esta en uso.');
            }
        }
        //objeto
        const updatedUser = await userRepository.updateUserProfile(
            userId,
            name,
            username,
            bio,
            profilePicture,
        );
        if (!updatedUser) {
            throw new Error('No se pudo actualizar el perfil.');
        }
        return updatedUser;

    } catch (err) {
        throw err;
    }
}


module.exports = {
    getUserProfile,
    updateUserProfile
};