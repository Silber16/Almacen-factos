const form = document.getElementById('form-create-fact');


async function createFact(factObj) {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/facts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(factObj)
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al crear el facto");
        }

        const response = await res.json();
        return response;

    } catch (err) {
        console.error("error al crear fact: ", err);
        throw err;
    }
}


form.addEventListener('submit', async function(e) { 
    const btnSubmit = document.getElementById('btn-verificar-ia');
    e.preventDefault();
    
    const textoOriginal = btnSubmit.textContent;

    try {
        btnSubmit.textContent = "Analizando y Publicando...";
        btnSubmit.disabled = true;

        const formData = new FormData(form);

        const factObj = {
            title: formData.get('Title'),
            content: formData.get('Content'),
            font: formData.get('Font'),
            category: parseInt(formData.get('Category')),
            createdBy: null
        };

        const res = await createFact(factObj);

        window.location.href = './feed.html';      

    } catch (error) {
        console.error("Error en el proceso:", error);
        window.alert("Hubo un error: " + error.message);
        
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
    }
});