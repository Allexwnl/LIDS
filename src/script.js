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
        section.appendChild(card)

        const img = document.createElement("img");
        img.src = game.img;
        img.alt = game.title;
        card.appendChild(img);

        const play = document.createElement('button')
        play.textContent = 'Play'
        play.id = 'launchButton'
        card.appendChild(play)

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

console.log(localStorage);
loadinglocalstorage();

document.getElementById('launchButton').addEventListener('click', function() {
    window.location.href = 'steam://run/322170';
});