const factsContainer = document.getElementById("facts-container");

const CATEGORIES = [
    { id: 1, name: 'Ciencia' },
    { id: 2, name: 'Historia' },
    { id: 3, name: 'Tecnologia' },
    { id: 4, name: 'Arte' }
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
    allOption.onclick = () => filterFactsByCategory(null); 
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

function renderFeed (facts) {
    factsContainer.innerHTML = ''
    facts.forEach( fact => {
        const factItem = document.createElement("li");
        factItem.className = "fact-item"
        factItem.innerHTML = `
            <label class="fact-user" >${fact.createdBy}</label>
            <h3 class="fact-title" >${fact.title}</h3>
            <p class="fact-content" >${fact.content}</p>
            <label class="fact-category" >${fact.category}</label>
            <label class="fact-font" >${fact.font}</label>
            <div class="fact-vote-container">
                <button class="fact-vote">
                    <i class="fa-solid fa-arrow-up"></i>
                </button>
                <button class="fact-vote">
                    <i class="fa-solid fa-arrow-down"></i>
                </button>
            </div>
        `;

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