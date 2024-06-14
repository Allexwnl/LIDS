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
    });
}

console.log(localStorage);
loadinglocalstorage();
