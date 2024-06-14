let data;

function loadinglocalstorage() {
    fetch("games.json")
        .then(response => response.json())
        .then(gamedata => {
            data = gamedata.games; // Access the 'games' array from the JSON response
            localStorage.setItem("data", JSON.stringify(data));
            createcards(data);
        });
}

function createcards(data) {
    const section = document.getElementById("newSection");

    data.forEach(game => {
        const img = document.createElement("img");
        img.src = game.img;
        img.alt = game.title;
        section.appendChild(img);

        const play = document.createElement('button')
        play.textContent = 'Play'
        play.id = 'launchButton'
        section.appendChild(play)

        const info = document.createElement('button')
        info.textContent = 'infoButton'
        info.id = 'infobutton'
        section.appendChild(info)
    });
}

console.log(localStorage);
loadinglocalstorage();
