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

// Voeg een event listener toe aan het zoekveld
document.getElementById('searchBar').addEventListener('input', () => {
    const letter = document.getElementById('searchBar').value.trim();
    const filteredNames = filterResultsByLetter(names, letter);
    displayResults(filteredNames);
});
});
}

function createcards(data) {
    const section = document.getElementById("newSection");

data.forEach(game => {
    const card = document.createElement("div");
    card.className = "card";
    section.appendChild(card);

    const img = document.createElement("img");
    img.src = game.img;
    img.alt = game.title;
    card.appendChild(img);

    const play = document.createElement('button');
    play.textContent = 'Play';
    play.id = 'launchButton'
    play.addEventListener('click', function() {
        window.location.href = `steam://run/${game.appId}`;
    });
    play.className = 'launchButton';
    card.appendChild(play);

    const info = document.createElement('button');
    info.textContent = 'infobutton';
    info.id = 'infobutton'
    info.addEventListener('click', function() {
        window.location.href = `moreinfo.html?gameId=${game.appId}`;
    });
    info.className = 'infoButton';
    card.appendChild(info);
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

// new code 

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
    moreInfoButton.addEventListener('click', function() {
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



document.addEventListener('DOMContentLoaded', () => {
    const butDir = document.getElementById('butDirectory');
    const output = document.getElementById('output');

    butDir.addEventListener('click', async () => {

        try {
            const dirHandle = await window.showOpenFilePicker({
                // mode: 'read',

            });
            // const fileDetails = await scanDirectory(dirHandle);
            // output.textContent = fileDetails.join('\n');
        } catch (error) {
            output.textContent = `Error: ${error.message}`;
        }
    });

    async function scanDirectory(dirHandle) {
        const promises = [];

        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file') {
                promises.push(entry.getFile().then((file) => `${file.name} (${file.size} bytes)`));
            } else if (entry.kind === 'directory') {
                promises.push(scanDirectory(entry));
            }
        }

        const results = await Promise.all(promises);
        return results.flat();
    }
});

document.getElementById('inputFile').addEventListener('change', (event) => {
    event.target.files[0].text().then((text) => {
        console.log(text);
        console.log(text.match(/\"\d{2,}\"/g));
    });
})
