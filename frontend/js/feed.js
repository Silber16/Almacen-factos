const factsContainer = document.getElementById("facts-container");
const feedEnd = document.getElementById("feed-end");

let currentOffset = 0;
let currentCategory = null; 
const LIMIT = 10;
let isLoading = false;
let hasMore = true;

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
    try {
        currentOffset = 0; 
        hasMore = true;    
        currentCategory = categoryId;
        
        const res = await fetch(`http://localhost:3000/api/facts/category/${categoryId}`);
        const facts = await res.json();
        renderFeed(facts, true); 
    }
    catch (err) {
        console.error("error al obtener los facts para cargar el feed: ", err)
    }
}

function toggleMenuCategory() {
    document.getElementById('categories-btn-options').classList.toggle('show');
}

function renderCategoryMenu() {
    const manuCategories = document.getElementById('categories-btn-options');
    manuCategories.innerHTML = ''; 

    const allOption = document.createElement('li');
    allOption.textContent = 'Todos';
    allOption.onclick = () => {
        currentOffset = 0;
        hasMore = true;
        currentCategory = null;
        fetchFacts(0);
        toggleMenuCategory();
    };
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
        iaResponseButton.innerHTML = '<i class="fa-solid fa-x"></i>Ocultar verificación IA';
    }
}

async function addToRepository(factId) {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch("http://localhost:3000/api/facts/addToRepo", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({factId: factId})
        });

        if (res) {
            alert("Facto guardado en repositorio pesonal.")
        }
    }
    catch (err) {
        console.error("error al guardar el fact en el repo personal: ", err)
    }
}

function renderFeed(facts, clearContainer = false) {
    if (clearContainer) {
        factsContainer.innerHTML = '';
    }
    
    facts.forEach(fact => {
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

        factItem.className = "fact-item"
        
        factItem.innerHTML = `
            <a href="./profile.html?userId=${fact.createdBy}" class="fact-user-link">
                <label class="fact-user" style="cursor: pointer;">${fact.userName}</label>
            </a>
            <h3 class="fact-title" >${fact.title}</h3>
            <p class="fact-content" >${fact.content}</p>
            <label class="fact-category" >Categoria: ${CATEGORIES.find(cat => cat.id === fact.category)?.name ?? "No informada"}</label>
            <label class="fact-font" >Fuente: ${fact.font}</label>
            <div class="btn-container">
                <button class="fact-btn-iaResponse"><span class="material-symbols-outlined">stars_2</span>Ver verificación IA</button>
                <button class="fact-btn-addToRepository"><i class="fa-solid fa-floppy-disk"></i>Guardar</button>
            </div>
            <div class="fact-iaResponse display-none">${ia_verdict_emoji} ${fact.iaResponse}</div>
        `;

        const iaResponseButton = factItem.querySelector('.fact-btn-iaResponse');
        const iaResponseDiv = factItem.querySelector('.fact-iaResponse');

        iaResponseButton.addEventListener('click', () => {
            toggleIaVerdict(iaResponseDiv, iaResponseButton);
        });

        const addToRepositoryButton = factItem.querySelector('.fact-btn-addToRepository');

        addToRepositoryButton.addEventListener('click', () => {
            addToRepository(fact.id);
        })

        factsContainer.appendChild(factItem);
    });
}

async function fetchFacts(offset = 0) {
    if (isLoading || !hasMore) return;
    
    isLoading = true;
    const loader = document.getElementById('feed-loader');
    loader.classList.remove('loader-hidden');
    loader.classList.add('loader-visible');

    try {
        const res = await fetch(`http://localhost:3000/api/facts/?limit=${LIMIT}&offset=${offset}`);
        const facts = await res.json();

        if (facts.length === 0) {
            hasMore = false;
            return;
        }

        renderFeed(facts, offset == 0);
        
        currentOffset += LIMIT;
    }
    catch (err) {
        console.error("error al obtener los facts para cargar el feed: ", err)
    }
    finally {
        isLoading = false;
        loader.classList.remove('loader-visible');
        loader.classList.add('loader-hidden');
    }
}

function loadMoreFacts() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && hasMore && !isLoading) {
                document.getElementById('feed-loader').toggle
                fetchFacts(currentOffset);
            }
        });
    }, { 
        rootMargin: '200px',
        threshold: 0.1
    });
    observer.observe(feedEnd);
}

document.addEventListener('DOMContentLoaded', () => {
    const btnFilter = document.getElementById('categories-btn');
    if(btnFilter) btnFilter.addEventListener('click', toggleMenuCategory);
    
    fetchFacts(0);
    loadMoreFacts();
    renderCategoryMenu();

    const navBtnHome = document.getElementById('btn-home');
    navBtnHome.classList.toggle('nav-btn-active');
});