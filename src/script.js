let data;
const gameMap = new Map();

function loadinglocalstorage() {
    fetch("games.json")
       .then(response => response.json())
       .then(gamedata => {
            data = gamedata.games;
            localStorage.setItem("data", JSON.stringify(data));

            data.forEach(game => gameMap.set(game.name, game));

            createcards(data);

            const names = data.map(game => game.name);

            document.getElementById('searchBar').addEventListener('input', () => {
                const letter = document.getElementById('searchBar').value.trim();
                const filteredNames = filterResultsByLetter(names, letter);
                displayResults(filteredNames);
            });

            console.log(localStorage);
        });
}

function createcards(data) {
    const section = document.getElementById("newSection");

    data.forEach(game => {
        const card = document.createElement("div");
        card.className = "card";
        section.appendChild(card)

        const img = document.createElement("img");
        img.src = game.img;
        img.alt = game.title;
        card.appendChild(img);

        const play = document.createElement('button');
        play.textContent = 'Play';
        play.addEventListener('click', function() {
            window.location.href = `steam://run/${game.appId}`;
        });
        play.id = 'launchButton'
        card.appendChild(play);

        const info = document.createElement('button')
        info.textContent = 'infoButton'
        info.id = 'infobutton'
        card.appendChild(info)
    });
}

function filterResultsByLetter(results, letter) {
    return results.filter(name => name.toLowerCase().includes(letter.toLowerCase()));
}

function displayResults(filteredNames) {
    const newSection = document.getElementById('newSection');
    newSection.innerHTML = '';

    const filteredGames = filteredNames.map(name => gameMap.get(name));
    createcards(filteredGames);
}

const filterButton = document.getElementById('filterButton');
const closeButton = document.getElementById('closeButton');
const menu = document.getElementById('menu')

filterButton.addEventListener('click', function() {
    toggleMenu();
});

closeButton.addEventListener('click', function() {
    toggleMenu();
});

function toggleMenu() {
    menu.classList.toggle('hidden');
    menu.classList.toggle('visible');
}

function filterItems(genre) {
    const searchTerm = document.getElementsByClassName(genre);
    const filteredContainer = document.getElementById('newSection');

    if (searchTerm[0].checked) {
        // Filter items by genre
        const filteredItems = data.filter(item => item.genre && item.genre.toLowerCase() === genre.toLowerCase());

        // Clear the container
        filteredContainer.innerHTML = '';

        // Add filtered items to the container
        filteredItems.forEach(item => {
            createcards([item]); // Pass the item as an array to createcards
        });
    } else {
        filteredContainer.innerHTML = '';
        // Display all cards again
        createcards(data);
    }
}

document.querySelector('.koken').addEventListener('input', function() {
    filterItems('koken');
});

document.querySelector('.rythm').addEventListener('input', function() {
    filterItems('rythm');
});

document.querySelector('.design').addEventListener('input', function() {
    filterItems('design');
});
    


loadinglocalstorage();