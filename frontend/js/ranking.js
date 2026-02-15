const rankingList = document.getElementById("ranking-list");

async function fetchRanking() {
    try {
        const res = await fetch(`${import.meta.env.VITE_VITE_BACKEND_URI}/api/ranking`);
        const ranking = await res.json();
        renderRanking(ranking);
    } catch (err) {
        console.error("Error al obtener ranking:", err);
    }
}

function getPositionIcon(index) {
    if (index === 0) return '<i class="fa-solid fa-trophy gold"></i>'
    if (index === 1) return '<i class="fa-solid fa-medal silver"></i>'
    if (index === 2) return '<i class="fa-solid fa-medal bronze"></i>'
    else    return` <span class="ranking-position">#${index + 1}</span>`;}

function renderRanking(ranking) {
    rankingList.innerHTML = "";

    ranking.forEach((user, index) => {
        const li = document.createElement("li");
        li.className = "ranking-item";

        li.innerHTML = `
            <div class="ranking-left">
                ${getPositionIcon(index)}
                <span class="ranking-username">${user.username}</span>
                <span class="ranking-facts">
                    <i class="fa-solid fa-file-lines"></i>
                    ${user.facts_count} factos
                </span>
            </div>
            <div class="ranking-right">
                ${user.score} pts
            </div>
        `;

        rankingList.appendChild(li);
    });
}


document.addEventListener('DOMContentLoaded', () => {

    fetchRanking();

    const navBtnHome = document.getElementById('btn-ranking');
    navBtnHome.classList.toggle('nav-btn-active');

});
