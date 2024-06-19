document.addEventListener('DOMContentLoaded', function() {
    let data;

    function loadinglocalstorage() {
        fetch("games.json")
            .then(response => response.json())
            .then(gamedata => {
                data = gamedata.games; 
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

            const play = document.createElement('button');
            play.textContent = 'Play';
            play.addEventListener('click', function() {
                window.location.href = `steam://run/${game.appId}`;
            });
            section.appendChild(play);

            const info = document.createElement('button');
            info.textContent = 'Info';
            info.id = 'infobutton';
            section.appendChild(info);
        });
    }

    console.log(localStorage);
    loadinglocalstorage();
});
