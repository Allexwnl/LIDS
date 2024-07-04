import VDF from 'vdf-parser';

let data;
const gameMap = new Map();

function loadinglocalstorage() {
    fetch("games.json")
        .then(response => response.json())
        .then(gamedata => {
            data = gamedata.games;
            localStorage.setItem("data", JSON.stringify(data));

            // Create a Map of game objects with their names as keys
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
        card.className = "custom-card";
        card.dataset.gameId = game.appId; // Store the game ID in the dataset
        section.appendChild(card);

        const img = document.createElement("div");
        img.className = "custom-card-image";
        img.style.backgroundImage = `url(${game.img})`;
        img.style.backgroundSize = "cover";
        img.style.backgroundPosition = "center";
        card.appendChild(img);

        const cardContent = document.createElement("div");
        cardContent.className = "custom-card-content";
        card.appendChild(cardContent);

        const cardTitle = document.createElement("h2");
        cardTitle.className = "custom-card-title";
        cardTitle.textContent = game.title;
        cardContent.appendChild(cardTitle);

        const cardDescription = document.createElement("p");
        cardDescription.className = "custom-card-description";
        cardDescription.textContent = game.description;
        cardContent.appendChild(cardDescription);

        const cardButtons = document.createElement("div");
        cardButtons.className = "custom-card-buttons";
        cardContent.appendChild(cardButtons);

        const play = document.createElement('button');
        play.textContent = 'Play';
        play.id = 'launchButton';
        play.className = 'custom-card-button';
        play.addEventListener('click', function() {
            window.location.href = `steam://run/${game.appId}`;
        });
        cardButtons.appendChild(play);

        const info = document.createElement('button');
        info.className = 'custom-card-button-secondary';
        info.textContent = 'Info';
        info.addEventListener('click', function () {
            window.location.href = `moreinfo.html?game=${encodeURIComponent(game.name)}`;
        });
        cardButtons.appendChild(info);
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

// Load game data from local storage and display cards
loadinglocalstorage();



function getPlatforms(platforms) {
    const platformNames = [];
    if (platforms.windows) platformNames.push('Windows');
    if (platforms.mac) platformNames.push('Mac');
    if (platforms.linux) platformNames.push('Linux');
    return platformNames.join(', ');
}

function getGenres(genres) {
    return genres.map(genre => genre.description).join(', ');
}

// Event listener for file input
document.getElementById('inputFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    try {
        const parsedData = VDF.parse(text);
        const apps = parsedData.libraryfolders["0"].apps;
        const appIds = Object.keys(apps).map(Number);

        // Update cards based on installed games
        document.querySelectorAll('#newSection > .custom-card').forEach(card => {
            const gameId = Number(card.dataset.gameId);
            const launchButton = card.querySelector('#launchButton');
            
            if (!appIds.includes(gameId)) {
                launchButton.textContent = 'Install';
                launchButton.addEventListener('click', function() {
                    window.location.href = `https://store.steampowered.com/app/${gameId}`;
                });
            }
        });
    } catch (error) {
        console.error("Error parsing VDF file:", error);
    }
});

// Toggle menu visibility
const closeButton = document.getElementById('closeButton');
const menu = document.getElementById('menu');
let isRotated = false;

closeButton.addEventListener('click', function() {
    toggleMenu();
    if (isRotated) {
        closeButton.style.transform = 'rotate(0deg)';
    } else {
        closeButton.style.transform = 'rotate(180deg)';
    }
    isRotated = !isRotated;
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
