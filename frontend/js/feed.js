const factsContainer = document.getElementById("facts-container");

const CATEGORIES = [
    { id: 1, name: 'Geografía' },
    { id: 2, name: 'Ciencia' },
    { id: 3, name: 'Historia' },
    { id: 4, name: 'Deportes' },
    { id: 5, name: 'Arte' },
    { id: 6, name: 'Entretenimiento' },
    { id: 7, name: 'Otros' }
];

async function filterFactsByCategory(categoryId) {
    if (!categoryId) {
        return
    }
    console.log(categoryId)
    try {
        const res = await fetch(`http://localhost:3000/api/facts/category/${categoryId}`);
        const facts = await res.json();
        renderFeed(facts);
    }
    catch (err) {
        console.error("error al obtener los facts para cargar el feed: ", err)
    }
}

function toggleMenuCategory() {
    document.getElementById('categories-btn-options').classList.toggle('hidden');
}

function renderCategoryMenu() {
    const manuCategories = document.getElementById('categories-btn-options');
    manuCategories.innerHTML = ''; 

    const allOption = document.createElement('li');
    allOption.textContent = 'Todos';
    allOption.onclick = () => fetchFacts(); 
    manuCategories.appendChild(allOption);

    CATEGORIES.forEach(category => {
        const itemCategory = document.createElement('li');
        itemCategory.textContent = category.name; 
        
        itemCategory.onclick = () => {
            filterFactsByCategory(category.id);
            toggleMenuCategory();
        };
        
        manuCategories.appendChild(itemCategory);
    });
}

function toggleIaVerdict(iaResponseDiv, iaResponseButton) {
    iaResponseDiv.classList.toggle('display-none');
            
    if (iaResponseDiv.classList.contains('display-none')) {
        iaResponseButton.innerHTML = '<span class="material-symbols-outlined">stars_2</span>Ver verificación IA';
    } else {
        iaResponseButton.innerHTML = '<span class="material-symbols-outlined">stars_2</span>Ocultar verificación IA';
    }
}

function renderFeed (facts) {
    factsContainer.innerHTML = ''
    facts.forEach( fact => {
        const factItem = document.createElement("li");

        switch (fact.ia_responseverdict) {
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
                break;
        };
        factItem.className = "fact-item"
        factItem.innerHTML = `
            <label class="fact-user" >${fact.username}</label>
            <h3 class="fact-title" >${fact.title}</h3>
            <p class="fact-content" >${fact.content}</p>
            <label class="fact-category" >Categoria: ${CATEGORIES.find(cat => cat.id === fact.category)?.name ?? "No informada"}</label>
            <label class="fact-font" >Fuente: ${fact.font}</label>
            <div class="btn-iaResponse-container">
                <button class="fact-btn-iaResponse"><span class="material-symbols-outlined">stars_2</span>Ver verificación IA</button>
            </div>
            <div class="fact-iaResponse display-none">${ia_verdict_emoji} ${fact.ia_response}</div>
        `;

        const iaResponseButton = factItem.querySelector('.fact-btn-iaResponse');
        const iaResponseDiv = factItem.querySelector('.fact-iaResponse');

        iaResponseButton.addEventListener('click', () => {
            toggleIaVerdict(iaResponseDiv, iaResponseButton);
        });

        factsContainer.appendChild(factItem);
    });
}

async function fetchFacts () {
    try {
        const res = await fetch("http://localhost:3000/api/facts/");
        const facts = await res.json();
        console.log(facts)

        renderFeed(facts);
    }
    catch (err) {
        console.error("error al obtener los facts para cargar el feed: ", err)
    }
}



document.addEventListener('DOMContentLoaded', () => {

    const btnFilter = document.getElementById('categories-btn');
    btnFilter.addEventListener('click', toggleMenuCategory);
    
    fetchFacts();
    renderCategoryMenu();
});