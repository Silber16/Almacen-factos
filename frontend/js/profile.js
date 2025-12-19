const API_URL = 'http://localhost:3000/api';
const DEFAULT_IMAGE = '../img/default-user.png';

//leer el ID de la URL (buscamos lo que está después del ?)
const params = new URLSearchParams(window.location.search);
let currentUserId = params.get('userId');

if (!currentUserId) {
    currentUserId = 1;
}

//al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    setupEventListeners();
});

//logica de la carga y renderizado
async function loadUserProfile() {
    try {
        const res = await fetch(`${API_URL}/users/${currentUserId}`);
        
        if (!res.ok) {
            throw new Error('Error al cargar el perfil');
        }

        const data = await res.json();
        
        //mostrar boton de editar solo si es mi perfil
        const btnEdit = document.getElementById('btn-edit-profile');
        if (btnEdit) {
            if (data.isOwnProfile) {
                btnEdit.classList.remove('hidden');
            } else {
                btnEdit.classList.add('hidden');
            }
        }

        renderProfile(data.user);
        renderTrophies(data.trophies);
        renderFactos(data.factos);

    } catch (error) {
        console.error(error);
        alert('Error al cargar el perfil.');
    }
}

function renderProfile(user) {
    const imgElement = document.getElementById('profile-picture');
    if (imgElement) {
        const fotoUsuario = user.profile_picture || DEFAULT_IMAGE;
        imgElement.src = fotoUsuario;
        
        imgElement.onerror = function() {
            this.src = DEFAULT_IMAGE;
            this.onerror = null; 
        };
    }

    const usernameEl = document.getElementById('profile-username');
    if (usernameEl) usernameEl.textContent = '@' + (user.username || 'usuario');

    const nameEl = document.getElementById('profile-name');
    if (nameEl) {
        //si hay nombre se muestra, sino se oculta
        if (user.name && user.name.trim() !== "") {
            nameEl.textContent = user.name;
            nameEl.style.display = 'block';
        } else {
            nameEl.style.display = 'none';
        }
    }

    const scoreEl = document.getElementById('profile-score');
    if (scoreEl) scoreEl.textContent = user.score || 0;

    //biografia
    const bioEl = document.getElementById('profile-bio');
    if (bioEl) {
        //si hay bio se muestra si no se oculta
        if (user.bio && user.bio.trim() !== "") {
            bioEl.textContent = user.bio;
            bioEl.style.display = 'block';
        } else {
            bioEl.style.display = 'none';
        }
    }

    //fecha
    const createdEl = document.getElementById('profile-created');
    if (createdEl && user.created_at) {
        const date = new Date(user.created_at);
        createdEl.textContent = date.toLocaleDateString('es-AR');
    }
}

function renderTrophies(trophies) {
    const container = document.getElementById('trophies-container');
    //si no existe la caja, salimos
    if (!container) return; 

    container.innerHTML = '';

    if (!trophies || trophies.length === 0) {
        container.innerHTML = '<p class="empty-state">Aún no hay logros.</p>';
        return;
    }

    const htmlString = trophies.map(trophy => {
        const date = new Date(trophy.earned_at).toLocaleDateString('es-AR');
        return `
            <div class="trophy-item">
                <div class="trophy-title">
                    <i class="fa-solid fa-trophy"></i> ${trophy.title}
                </div>
                <div class="trophy-description">${trophy.description}</div>
                <div class="trophy-points">${trophy.pointsneeded} puntos necesarios</div>
                <div class="trophy-earned">Obtenido: ${date}</div>
            </div>
        `;
    }).join('');

    container.innerHTML = htmlString;
}

function renderFactos(factos) {
    const container = document.getElementById('user-factos-container');
    if (!container) return;

    container.innerHTML = '';

    if (!factos || factos.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay factos publicados.</p>';
        return;
    }

    const htmlString = factos.map(facto => {
        //se verifica si hay fuente para mostrarla o no
        const fuenteHtml = facto.font ? `<p class="facto-font">Fuente: ${facto.font}</p>` : '';
        
        return `
            <li class="facto-item">
                <h4 class="facto-title">${facto.title}</h4>
                <p class="facto-content">${facto.content}</p>
                ${fuenteHtml}
            </li>
        `;
    }).join('');

    container.innerHTML = htmlString;
}

//logica botones
function setupEventListeners() {
    const btnEdit = document.getElementById('btn-edit-profile');
    const btnClose = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-cancel-edit');
    const formEdit = document.getElementById('form-edit-profile');

    if (btnEdit) {
        btnEdit.addEventListener('click', openEditModal);
    }

    if (btnClose) {
        btnClose.addEventListener('click', closeEditModal);
    }

    if (btnCancel) {
        btnCancel.addEventListener('click', closeEditModal);
    }

    if (formEdit) {
        formEdit.addEventListener('submit', handleEditProfile);
    }
}

//logica del modal
function openEditModal() {
    const modal = document.getElementById('edit-modal');
    if (!modal) return;
    
    // Al estar ocultos los elementos, textContent devuelve "" (vacío), lo cual es perfecto para el input
    const currentName = document.getElementById('profile-name').textContent;
    const currentUsername = document.getElementById('profile-username').textContent;
    const currentBio = document.getElementById('profile-bio').textContent;
    const imgElement = document.getElementById('profile-picture');
    const currentPic = imgElement ? imgElement.src : '';

    //se rellenan los inputs
    const inputName = document.getElementById('edit-name');
    if (inputName) inputName.value = currentName;

    const inputUser = document.getElementById('edit-username');
    if (inputUser) {
        inputUser.value = currentUsername.replace('@', '');
    }

    const inputBio = document.getElementById('edit-bio');
    if (inputBio) {
        inputBio.value = currentBio;
    }

    const inputPic = document.getElementById('edit-picture');
    if (inputPic) inputPic.value = currentPic.includes('default-user.png') ? '' : currentPic;

    //se muestra el modal
    modal.classList.remove('hidden');
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

async function handleEditProfile(e) {
    e.preventDefault(); //evitar recarga de la pagina

    //obbtener valores de los inputs
    const nameVal = document.getElementById('edit-name').value.trim();
    const userVal = document.getElementById('edit-username').value.trim();
    const bioVal = document.getElementById('edit-bio').value.trim();
    const picVal = document.getElementById('edit-picture').value.trim();

    //validacion
    if (nameVal === '' || userVal === '') {
        alert('El nombre y el usuario son obligatorios');
        return;
    }

    const datosAEnviar = {
        name: nameVal,
        username: userVal,
        bio: bioVal,
        profile_picture: picVal
    };

    try {
        const res = await fetch(`${API_URL}/users/${currentUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosAEnviar)
        });

        if (res.ok) {
            const updatedData = await res.json();
            const userObj = updatedData.user || updatedData; 
            
            renderProfile(userObj);
            closeEditModal();
            alert('Perfil actualizado con éxito');
        } else {
            const errorData = await res.json();
            alert('Error: ' + (errorData.error || 'No se pudo actualizar'));
        }

    } catch (error) {
        console.error(error);
        alert('Error de conexión al actualizar');
    }
}