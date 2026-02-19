const DEFAULT_IMAGE = '../img/default-user.png';

//boton verificacion ia
function toggleIaVerdict(iaResponseDiv, iaResponseButton) {
    iaResponseDiv.classList.toggle('display-none');
            
    if (iaResponseDiv.classList.contains('display-none')) {
        iaResponseButton.innerHTML = '<span class="material-symbols-outlined">stars_2</span>Ver verificación IA';
    } else {
        iaResponseButton.innerHTML = '<i class="fa-solid fa-x"></i>Ocultar verificación IA';
    }
}

//funcion para sacar mi id del token
function getMyIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        // Decodificamos el payload (la parte del medio del token)
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Probamos todas las variantes comunes que puede devolver el back
        return payload.id || payload.userId || payload.sub;
    } catch (e) {
        console.error("error al leer token", e);
        return null;
    }
}

//leer el ID de la URL (buscamos lo que está después del ?)
const params = new URLSearchParams(window.location.search);
let currentUserId = params.get('userId') || params.get('id');

//variable para guardar mis factos originales y no recargar al cambiar pestaña
let misFactosCache = []; 

// si no hay id en la url buscamos el nuestro, si no hay nada al login
if (!currentUserId || currentUserId === 'undefined') {
    currentUserId = getMyIdFromToken();
}
// si despues de intentar todo no hay id, mandamos al login
if (!currentUserId || currentUserId === 'undefined') {
    console.warn("no se encontro id de usuario, redirigiendo...");
    window.location.href = './login.html';
}


//al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    setupEventListeners();
});

//logica de la carga y renderizado
async function loadUserProfile() {
    try {
        const token = localStorage.getItem('token');

        // mandamos el token para que el back sepa si soy yo
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/users/${currentUserId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) {
            throw new Error('Error al cargar el perfil');
        }

        const data = await res.json();
        
        misFactosCache = data.factos;

        const btnEdit = document.getElementById('btn-edit-profile');
        if (btnEdit) {
            //si se confirma que es mi perfil se muestra el boton paa editar
            if (data.isOwnProfile) {
                btnEdit.classList.remove('hidden');
            } else {
                btnEdit.classList.add('hidden');
            }
        }

        const btnGuardados = document.getElementById('tab-guardados');
        if (btnGuardados && data.isOwnProfile) {
            btnGuardados.classList.remove('hidden');
        }

        renderProfile(data.user);
        renderTrophies(data.trophies);
        renderFactos(data.factos, false, data.isOwnProfile);

    } catch (error) {
        console.error(error);
        //si falla porque el token expiro redigrige al login
    }
}

function renderProfile(user) {
    const imgElement = document.getElementById('profile-picture');
    if (imgElement) {
        const fotoUsuario = user.profilePicture || DEFAULT_IMAGE;
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
    if (createdEl && user.createdAt) {
        const date = new Date(user.createdAt);
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
    const trophiesHTML = trophies.map(trophy => {
        return `
            <li class="trophy-item" key="${trophy.id}" >
                <img class="trophy-img" src="${trophy.iconUrl}" />
                <h3 class="trophy-title" >${trophy.title}</h3>
                <label class="trophy-points" >pts: ${trophy.points}</label>
            </li>
        `;
    }).join('');

    container.innerHTML = trophiesHTML;
}

function renderFactos(factos, canDelete = false, canDeleteOwn = false) {
    const container = document.getElementById('user-factos-container');
    if (!container) return;

    container.innerHTML = '';

    factos.forEach(fact => {
        fact.iaVerdict = fact.iaVerdict || fact.ia_responseverdict || fact.ia_verdict;
        fact.iaResponse = fact.iaResponse || fact.ia_response;
        fact.userName = fact.userName || fact.username;
        fact.createdBy = fact.createdBy || fact.user_id;

        const factItem = document.createElement("li");

        let ia_verdict_emoji = "";
        switch (fact.iaVerdict) {
            case 'F':
                ia_verdict_emoji = "❌❌❌❌"
                break;
            case 'V':
                ia_verdict_emoji = "✅✅✅✅"
                break;
            case 'I':
                ia_verdict_emoji = "🤔🤔❔❔"
                break;
            default:
                ia_verdict_emoji = "❓"
                break;
        };

        factItem.className = "fact-item";
        factItem.id = `card-facto-${fact.id}`;
        
        factItem.innerHTML = `
            <a href="./profile.html?userId=${fact.createdBy}" class="fact-user-link">
                <label class="fact-user" style="cursor: pointer;">${fact.userName}</label>
            </a>
            <h3 class="fact-title">${fact.title}</h3>
            <p class="fact-content">${fact.content}</p>
            <label class="fact-font">Fuente: ${fact.font}</label>
            <div class="btn-container">
                <button class="fact-btn-iaResponse"><span class="material-symbols-outlined">stars_2</span>Ver verificación IA</button>
                ${canDelete ? `<button class="fact-btn-addToRepository"><i class="fa-solid fa-trash"></i> Quitar</button>` : ''}
                ${canDeleteOwn ? `<button class="fact-btn-delete"><i class="fa-solid fa-trash"></i> Eliminar</button>` : ''}
            </div>
            <div class="fact-iaResponse display-none">${ia_verdict_emoji} ${fact.iaResponse}</div>
        `;

        const iaResponseButton = factItem.querySelector('.fact-btn-iaResponse');
        const iaResponseDiv = factItem.querySelector('.fact-iaResponse');

        iaResponseButton.addEventListener('click', () => {
            toggleIaVerdict(iaResponseDiv, iaResponseButton);
        });

        //boton eliminar del repo
        const deleteButton = factItem.querySelector('.fact-btn-addToRepository');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                deleteSavedFact(fact.id);
            });
        }

        //boton eliminar facto propio
        const deleteOwnButton = factItem.querySelector('.fact-btn-delete');
        if (deleteOwnButton) {
            deleteOwnButton.addEventListener('click', async () => {
                if (!confirm('¿Seguro que querés eliminar este facto?')) return;
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/facts/${fact.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const card = document.getElementById(`card-facto-${fact.id}`);
                    if (card) card.remove();
                } else {
                    alert('Error al eliminar el facto');
                }
            });
        }

        container.appendChild(factItem);
    });
}

//logica botones
function setupEventListeners() {
    const btnEdit = document.getElementById('btn-edit-profile');
    const btnClose = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-cancel-edit');
    const formEdit = document.getElementById('form-edit-profile');
    const btnDeletePic = document.getElementById('btn-delete-pic');
    const inputPic = document.getElementById('edit-picture');
    const deleteFlag = document.getElementById('delete-picture-flag');
    
    //botones de pestañas
    const btnMisFactos = document.getElementById('tab-mis-factos');
    const btnGuardados = document.getElementById('tab-guardados');

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

    if (btnDeletePic) {
        btnDeletePic.addEventListener('click', () => {
            if (inputPic) inputPic.value = ''; 
            
            if (deleteFlag) deleteFlag.value = 'true';

            alert('La foto se borrará al guardar los cambios.');
        });
    }

    if (inputPic) {
        inputPic.addEventListener('change', () => {
            if (deleteFlag) deleteFlag.value = 'false';
        });
    }

    //listeners de pestañas
    if (btnMisFactos) btnMisFactos.addEventListener('click', showMisFactos);
    if (btnGuardados) btnGuardados.addEventListener('click', loadSavedFacts);
    // logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "./login.html";
    });
}

}

//logica del modal
function openEditModal() {
    const modal = document.getElementById('edit-modal');
    if (!modal) return;

    //se bloquea el scroll
    document.body.style.overflow = 'hidden';

    //se resetea la bandera
    const deleteFlag = document.getElementById('delete-picture-flag');
    if (deleteFlag) deleteFlag.value = 'false';
    
    //al estar ocultos los elementos, textContent devuelve vacio
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
    if (inputPic) {
        inputPic.value = "";
    }

    //se muestra el modal
    modal.classList.remove('hidden');
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    document.body.style.overflow = '';
}

async function handleEditProfile(e) {
    e.preventDefault(); //evitar recarga de la pagina

    //obbtener valores de los inputs
    const nameVal = document.getElementById('edit-name').value.trim();
    const userVal = document.getElementById('edit-username').value.trim();
    const bioVal = document.getElementById('edit-bio').value.trim();
    const picInput = document.getElementById('edit-picture'); 

    const deleteFlag = document.getElementById('delete-picture-flag').value === 'true';

    if (nameVal === '' || userVal === '') {
        alert('El nombre y el usuario son obligatorios');
        return;
    }

    const formData = new FormData();
    formData.append('name', nameVal);
    formData.append('username', userVal);
    formData.append('bio', bioVal);

    if (picInput.files && picInput.files[0]) {
        formData.append('profilePicture', picInput.files[0]);
    } else if (deleteFlag) {
        formData.append('profilePicture', '');
    }

    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/users/${currentUserId}`, {
            method: 'PUT',
            body: formData,
            // mandamos el token para que nos deje editar
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (res.ok) {
            const updatedData = await res.json();
            const userObj = updatedData.user || updatedData; 
            
            renderProfile(userObj);
            closeEditModal();
            document.getElementById('delete-picture-flag').value = 'false';
        } else {
            const errorData = await res.json();
            alert('Error: ' + (errorData.error || 'No se pudo actualizar'));
        }

    } catch (error) {
        console.error(error);
        alert('Error de conexión al actualizar');
    }
}



function showMisFactos() {
    const container = document.getElementById('user-factos-container');
    container.classList.add('slide-out');
    
    setTimeout(() => {
        document.getElementById('tab-mis-factos').style.backgroundColor = ''; 
        document.getElementById('tab-guardados').style.backgroundColor = '#444'; 
        
        //cambiar titulo de la seccion
        document.getElementById('section-title-text').innerHTML = '<i class="fa-solid fa-lightbulb"></i> Factos Publicados';

        //renderizar lo que teniamos guardado en cache
        renderFactos(misFactosCache, false, true);
        
        container.classList.remove('slide-out');
        container.classList.add('slide-in');
        
        setTimeout(() => {
            container.classList.remove('slide-in');
        }, 500);
    }, 250);
}


async function loadSavedFacts() {
    //obtener token del localStorage
    const container = document.getElementById('user-factos-container');
    container.classList.add('slide-out');
    
    setTimeout(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Debes iniciar sesión para ver tus guardados.");
            return;
        }

        //cambiar estilos visuales
        document.getElementById('tab-mis-factos').style.backgroundColor = '#444';
        document.getElementById('tab-guardados').style.backgroundColor = '#e67e22'; 

        //cambiar titulo
        document.getElementById('section-title-text').innerHTML = '<i class="fa-solid fa-bookmark"></i> Repositorio Personal';

        //mostrar cargando
        container.innerHTML = '<p>Cargando repositorio...</p>';

        try {
            //fetch con autenticacion
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/saved/${currentUserId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (res.ok) {
                const savedFacts = await res.json();
                renderFactos(savedFacts, true);
                container.classList.remove('slide-out');
                container.classList.add('slide-in');
                
                setTimeout(() => {
                    container.classList.remove('slide-in');
                }, 500);
            } else {
                container.innerHTML = '<p>Error al cargar el repositorio.</p>';
                container.classList.remove('slide-out');
                container.classList.add('slide-in');
                
                setTimeout(() => {
                    container.classList.remove('slide-in');
                }, 500);
            }

        } catch (error) {
            console.error(error);
            container.innerHTML = '<p>Error de conexión.</p>';
            container.classList.remove('slide-out');
            container.classList.add('slide-in');
            
            setTimeout(() => {
                container.classList.remove('slide-in');
            }, 500);
        }
    }, 250);
}

async function deleteSavedFact(factId) {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/saved/toggle`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ factId: factId })
        });

        const data = await res.json();

        if (res.ok) {
            //si el backend dice saved false es que se borro
            if (data.saved === false) {
                
                //se borra el facto
                const card = document.getElementById(`card-facto-${factId}`);
                if (card) card.remove();
                
                const container = document.getElementById('user-factos-container');
                
                if (container && container.children.length === 0) {
                    container.innerHTML = '<p class="empty-state">No hay factos guardados.</p>';
                }
            } 
        } else {
            console.error("Error al eliminar:", data.error);
        }

    } catch (error) {
        console.error("Error de conexión:", error);
    }
}