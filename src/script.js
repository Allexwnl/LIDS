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
        section.appendChild(card)
        
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
        play.className = 'custom-card-button';
        play.addEventListener('click', function() {
            window.location.href = `steam://run/${game.appId}`;
        });
        play.className = 'custom-card-button';
        cardButtons.appendChild(play);


        const info = document.createElement('button');
        info.className = 'custom-card-button-secondary';
        info.textContent = 'Info';
        info.addEventListener('click', function () {
            window.location.href = `moreinfo.html?game=${encodeURIComponent(game.title)}`;
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

// console.log(localStorage);
loadinglocalstorage();

const apiUrl = 'https://cors-proxy-bit-academy.azurewebsites.net/api/url/https://store.steampowered.com/api/appdetails?appids=322170';

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const gameData = data['322170'].data;

        const gameInfoContainer = document.getElementById('game-info');

        const html = `
        <div class="game-detail">
            <label>Name:</label>
            <div>${gameData.name}</div>
        </div>
        <div class="game-detail">
            <label>Description:</label>
            <div class="description">${gameData.detailed_description}</div>
        </div>
        <div class="game-detail">
            <label>Platforms:</label>
            <div>${getPlatforms(gameData.platforms)}</div>
        </div>
        <div class="game-detail">
            <label>Genres:</label>
            <div>${getGenres(gameData.genres)}</div>
        </div>
        <div class="game-detail">
            <label>Price:</label>
            <div>${gameData.price_overview.final_formatted}</div>
        </div>
        <div class="game-detail">
            <label>Release Date:</label>
            <div>${gameData.release_date.date}</div>
        </div>
        <div class="game-detail">
            <label>Developers:</label>
            <div>${gameData.developers.join(', ')}</div>
        </div>
        <div class="game-detail">
            <label>Publishers:</label>
            <div>${gameData.publishers.join(', ')}</div>
        </div>
        <div class="game-detail">
            <label>Supported Languages:</label>
            <div>${gameData.supported_languages}</div>
        </div>
        <div class="game-detail">
            <button id="infoButton" data-game-id="${gameData.steam_appid}">More Info</button>
        </div>
    `;

        gameInfoContainer.innerHTML = html;

        // Add event listener to the More Info button
        const moreInfoButton = document.getElementById('infoButton');
        moreInfoButton.addEventListener('click', function () {
            const gameId = moreInfoButton.getAttribute('data-game-id');
            window.location.href = `moreinfo.html?gameId=${gameId}`;
        });
    })
    .catch(error => {
        console.error('Error fetching game data:', error);
    });
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

document.getElementById('inputFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    try {
        const parsedData = VDF.parse(text);
        const apps = parsedData.libraryfolders["0"].apps;
        const appIds = Object.keys(apps).map(Number);
        console.log(appIds);
        document.querySelectorAll('#newSection > .card').forEach(card => {
            if (appIds.includes(Number(card.dataset.gameId))) {
                console.log('Game installed:', card.dataset.gameId);
            } else {
                card.querySelector('#launchButton').remove();
            }
        })
    } catch (error) {
        console.error("Error parsing VDF file:", error);
    }
})

const closeButton = document.getElementById('closeButton');
const menu = document.getElementById('menu')

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
    


loadinglocalstorage();
