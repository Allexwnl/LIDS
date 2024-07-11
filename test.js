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

function createcards(data) {
    const section = document.getElementById("newSection");

    data.forEach(game => {
        const card = document.createElement("div");
        card.className = "custom-card";
        section.appendChild(card)
        
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