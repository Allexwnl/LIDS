import VDF from 'vdf-parser';

let data;
const gameMap = new Map();

function loadingLocalStorage() {
    fetch("games.json")
    .then(response => response.json())
    .then(gamedata => {
        data = gamedata.games;
        localStorage.setItem("data", JSON.stringify(data));

        // Create a Map of game objects with their names as keys
        data.forEach(game => gameMap.set(game.name, game));

        createCards(data);

        const names = data.map(game => game.name);

        document.getElementById('searchBar').addEventListener('input', () => {
            const letter = document.getElementById('searchBar').value.trim();
            const filteredNames = filterResultsByLetter(names, letter);
            displayResults(filteredNames);
        });
    });
}

function createCards(data) {
    // Clear sections before populating
    document.getElementById("techniekSection").innerHTML = '';
    document.getElementById("careSection").innerHTML = '';
    document.getElementById("touristSection").innerHTML = '';
    document.getElementById("newSection").innerHTML = '';

    data.forEach(game => {
        let section;

        // Determine which section the game belongs to
        switch (game.genre) {
            case "techniek":
                section = document.getElementById("techniekSection");
                break;
            case "care":
                section = document.getElementById("careSection");
                break;
            case "horeca":
                section = document.getElementById("touristSection");
                break;
            default:
                if (document.querySelector(".techniek").checked || document.getElementById("searchBar").value.trim() !== "") {
                    section = document.getElementById("newSection");
                } else {
                    console.error(`No section found for genre: ${game.genre}`);
                    return; // Skip to the next game if no section is found
                }
                break;
        }

        // Create the card element
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.gameId = game.appId;

        // Create and append the game title
        const gametitle = document.createElement("h3");
        gametitle.textContent = game.name;
        card.appendChild(gametitle);

        // Create and append the game image, if it exists
        if (game.img) {
            const img = document.createElement("img");
            img.className = "card-img";
            img.src = game.img;
            card.appendChild(img);
        }

        // Create and append the card content container
        const cardContent = document.createElement("div");
        cardContent.className = "card-content";
        card.appendChild(cardContent);

        // Create and append the card buttons container
        const cardButtons = document.createElement("div");
        cardButtons.className = "custom-card-buttons";
        cardContent.appendChild(cardButtons);

        // Create and append the Info button
        const info = document.createElement('i');
        info.className = 'custom-card-button-secondary bx bx-play bx-lg';
        info.textContent = '';
        info.addEventListener('click', () => {
            window.location.href = `moreinfo.html?game=${encodeURIComponent(game.name)}`;
        });
        cardButtons.appendChild(info);

        const play = document.createElement('button');
        play.textContent = 'Play';
        play.id = 'launchButton';
        play.style.display = 'none';
        play.className = 'custom-card-button';
        play.addEventListener('click', () => {
            window.location.href = `steam://run/${game.appId}`;
        });
        cardButtons.appendChild(play);

        // Append the card to the appropriate section
        section.appendChild(card);
    });
}

function filterResultsByLetter(results, letter) {
    return results.filter(name => name?.toLowerCase().includes(letter.toLowerCase()));
}

function displayResults(filteredNames) {
    const newSection = document.getElementById('newSection');
    newSection.innerHTML = '';

    const filteredGames = filteredNames.map(name => gameMap.get(name));
    createCards(filteredGames);
}

// Load game data from local storage and display cards
loadingLocalStorage();

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
        document.querySelectorAll('.card').forEach(card => {
            const gameId = Number(card.dataset.gameId);
            const launchButton = card.querySelector('#launchButton');

            if (appIds.includes(gameId)) {
                launchButton.style.display = 'block';
            } else {
                launchButton.textContent = 'Install';
                launchButton.addEventListener('click', () => {
                    window.location.href = `https://store.steampowered.com/app/${gameId}`;
                });
            }
        });
    } catch (error) {
        console.error("Error parsing VDF file:", error);
    }
});

function filterItems(genre) {
    const genreCheckbox = document.querySelector(`.${genre}`);
    const gamesSection = document.getElementById('gamesSection');

    if (!genreCheckbox || !gamesSection) return;

    gamesSection.innerHTML = ''; // Clear the gamesSection

    if (genreCheckbox.checked) {
        // Filter items by genre
        const filteredItems = data.filter(item => item.genre && item.genre.toLowerCase() === genre.toLowerCase());

        // Add filtered items to the gamesSection
        createCards(filteredItems);
    } else {
        // Display all cards again
        createCards(data);
    }
}

// Attach event listeners for genre filters
document.querySelectorAll('.genre-filter').forEach(filter => {
    filter.addEventListener('input', (event) => {
        filterItems(event.target.className.split(' ')[0]);
    });
});
