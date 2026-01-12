const form = document.getElementById('form-create-fact');


async function createFact(factObj) {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch("http://localhost:3000/api/facts/", {
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

        //se arma el objeto con los datos del usuario
        const factObj = {
            title: formData.get('Title'),
            content: formData.get('Content'),
            font: formData.get('Font'),
            category: parseInt(formData.get('Category')),
            createdBy: null
        };

        console.log("Enviando al servidor:", factObj);
        const res = await createFact(factObj);

        //veredicto de la ia
        const veredicto = res.fact.ia_responseverdict || "Procesando";
        
        window.alert(`¡Facto Publicado con Éxito!\nVeredicto IA: ${veredicto}`);
        window.location.href = './feed.html';      

    } catch (error) {
        console.error("Error en el proceso:", error);
        window.alert("Hubo un error: " + error.message);
        
        //si falla se restaura el boton para que intente de nuevo
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
    }
});