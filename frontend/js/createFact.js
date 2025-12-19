const form = document.getElementById('form-create-fact');

async function validateFact(factContent) {
    const promptTemplate = `Genera un veredicto claro y conciso (maximo 300 caracteres), argumentando si crees que la siguiente informacion/dato es verdadero o falso (expresalo como una opinion basada en argumentos, no como una afirmacion de verdad absoluta): ${factContent}. La respuesta debe tener obligatoria y estrictamente el siguiente formato (sin contar lo que esta entre parentesis): V(verdadero)/F(falso)/I(indeterminado)-veredicto(desarrollo de tus argumentos y opiniones sobre la afirmacion/dato), ejemplo: 'F-el dato es falso porque...'`
    const prompt = {content: promptTemplate};
    try {
        const res = await fetch("http://localhost:3000/api/ia/getVerdict", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(prompt)
        });
        const iaResponse = await res.json();
        const index = iaResponse.indexOf('-');

        const ia_response = iaResponse.slice(0, index);
        const ia_verdict = iaResponse.slice(index + 1);

        return [ia_response, ia_verdict];
    } catch (err) {
        console.error("error al validar el contenido con IA: ", err)
        throw err;
    }
}

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
        const response = await res.json();
        return response;
    } catch (err) {
        console.error("error al crear fact: ", err)
    }
}

form.addEventListener('submit', async function(e) { 
    const btnSubmit = document.getElementById('btn-verificar-ia');
    e.preventDefault(); 
    
    const formData = new FormData(form);

    const title = formData.get('Title');
    const content = formData.get('Content');
    const font = formData.get('Font');
    const category = formData.get('Category');
    
    try {
        btnSubmit.textContent = "Procesando..."
        const iaResponse = await validateFact(content);
        
        const factObj = {
            title: title,
            content: content,
            font: font,
            category: parseInt(category),
            createdBy: null,
            iaVerdict: iaResponse[0],
            iaResponse: iaResponse[1]
        };
        
        const res = await createFact(factObj)
        window.alert(res.message);
        window.location.href = './feed.html';

        
    } catch (error) {
        console.error("Error al validar o crear el fact:", error);
    }
});