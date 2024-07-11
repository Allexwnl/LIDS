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
            }); // <--- Add this closing parenthesis
        });
}

function createcards(data, Newsection) {
    // Ensure section is reset for each call
    let section = Newsection;


    data.forEach(game => {
        // Determine which section the game belongs to
        if (game.genre === "techniek") {
            section = document.getElementById("techniekSection");
        } else if (game.genre === "care") {
            section = document.getElementById("careSection");
        } else if (game.genre === "horeca") {
            section = document.getElementById("touristSection");
        } else  if (document.getElementsByClassName("techniek").checked || document.getElementById("searchBar").value.trim() !== "") {
            section = document.getElementById("newSection");
        } else {
            console.error(`No section found for genre: ${game.genre}`);
            return; // Skip to the next game if no section is found
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
        info.addEventListener('click', function () {
            window.location.href = `moreinfo.html?game=${encodeURIComponent(game.name)}`;
        });
        cardButtons.appendChild(info);
        
        const play = document.createElement('button');
        play.textContent = 'Play';
        play.id = 'launchButton';
        play.style.display = 'none';
        play.className = 'custom-card-button';
        play.addEventListener('click', function() {
            window.location.href = `steam://run/${game.appId}`;
        });
        cardButtons.appendChild(play);


        // Append the card to the appropriate section
        if (section) {
            section.appendChild(card);
        } else {
            console.error(`No section found for genre: ${game.genre}`);
        }    });
}



function filterResultsByLetter(results, letter) {
    return results.filter(name => name?.toLowerCase().includes(letter.toLowerCase()));
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
        document.querySelectorAll('#techniekSection > .custom-card').forEach(card => {
            const gameId = Number(card.dataset.gameId);
            const launchButton = card.querySelector('#launchButton');
            
            if (!appIds.includes(gameId)) {
                launchButton.textContent = 'Install';
                launchButton.addEventListener('click', function() {
                    window.location.href = `https://store.steampowered.com/app/${gameId}`;
                });
            }

            console.log(appIds);
        });
    } catch (error) {
        console.error("Error parsing VDF file:", error);
    }
});

function filterItems(genre) {
    const searchTerm = document.getElementsByClassName(genre);
    const gamesSection = document.getElementById('gamesSection');

    gamesSection.innerHTML = ''; // Clear the gamesSection

    if (searchTerm[0].checked) {
        // Filter items by genre
        const filteredItems = data.filter(item => item.genre && item.genre.toLowerCase() === genre.toLowerCase);

        // Add filtered items to the gamesSection
        filteredItems.forEach(item => {
            createcards([item], gamesSection); // Pass the item as an array to createcards and the gamesSection as an argument
        });
    } else {
        // Display all cards again
        createcards(data, gamesSection);
    }
}

document.querySelector('.techniek').addEventListener('input', function() {
    filterItems('techniek');
});

document.querySelector('.rythm').addEventListener('input', function() {
    filterItems('care');
});

document.querySelector('.design').addEventListener('input', function() {
    filterItems('horeca');
});
