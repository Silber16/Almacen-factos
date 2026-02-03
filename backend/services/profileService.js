import * as userRepository from '../repositories/profileRepository.js';
import User from '../models/Users.js';
import Trophy from '../models/Trophy.js';

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

        //facts del usuario
        const factos = await userRepository.getUserFactos(userId);

        const currentScore = parseInt(user.score) || 0;

        //trofeos/logros del usuario
        const preTrophies = await userRepository.getUserTrophies(currentScore);
        
        const trophies = preTrophies.map(t => new Trophy({
            id: t.id,
            title: t.title,
            name: t.title,
            iconUrl: t.iconurl,
            points: t.points
        }));
        
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
    //validaciones
    if (name && name.length > 40) {
        throw new Error('El nombre no puede tener mas de 40 caracteres.');
    }
    if (username && username.length > 20) {
        throw new Error('El username no puede tener mas de 20 caracteres.');
    }
    if (bio && bio.length > 200) {
        throw new Error('La biografia no puede tener mas de 200 caracteres.');
    }
    if (profilePicture && profilePicture.length > 500) {
        throw new Error('URL de imagen demasiado larga.');
    }

    try {
        const currentUser = await userRepository.getUserById(userId);

        if(!currentUser) {
            throw new Error('Usuario no encontrado.');
        }

        //aca se decide q valores se usan, si los nuevos o los que ya estaban
        let finalName;
        if (name !== undefined) {
            finalName = name;
        } else {
            finalName = currentUser.name;
        }

        let finalUsername;
        if (username !== undefined) {
            finalUsername = username;
        } else {
            finalUsername = currentUser.username;
        }

        let finalBio;
        if (bio !== undefined) {
            finalBio = bio;
        } else {
            finalBio = currentUser.bio;
        }

        let finalPicture;
        if (profilePicture !== undefined) {
            finalPicture = profilePicture;
        } else {
            finalPicture = currentUser.profile_picture;
        }

        //verifica si el username ya esta en uso
        if (username && username !== currentUser.username) {
            const existingUser = await userRepository.getUserByUsername(username);
            if (existingUser && existingUser.id !== userId) {
                throw new Error('El username ya esta en uso.');
            }
        }
        //actualizar valores finales
        const updatedUser = await userRepository.updateUserProfile(
            userId,
            finalName,
            finalUsername,
            finalBio,
            finalPicture
        );
        if (!updatedUser) {
            throw new Error('No se pudo actualizar el perfil.');
        }
        return updatedUser;

    } catch (err) {
        throw err;
    }
}


export {
    getUserProfile,
    updateUserProfile
};