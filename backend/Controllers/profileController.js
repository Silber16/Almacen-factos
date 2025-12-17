import * as profileService from '../Servicies/profileService.js';

//obtener perfil de un usuario
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const loggedUserId = req.user?.id; //id del usuario logueado
        const profileData = await profileService.getUserProfile(userId);

        //agregar flag si es el perfil del usuario, osea el mio
        profileData.isOwnProfile = (userId == loggedUserId);

        res.json(profileData);

    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        res.status(404).json({ error: error.message });
    }
};

//actualizar perfil de usuario
const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, username, bio, profile_picture } = req.body;

        const imagePath = req.file ? req.file.path : undefined;

        const updatedUser = await profileService.updateUserProfile(
            userId,
            name,
            username,
            bio,
            imagePath
        );
        res.json(updatedUser);

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(400).json({ error: error.message });
    }
};


export {
    getUserProfile,
    updateUserProfile
};