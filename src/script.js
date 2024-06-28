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