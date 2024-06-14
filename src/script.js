let data;

function loadinglocalstorage() {
    fetch("games.json")
        .then(response => response.json())
        .then(gamedata => {
            data = gamedata.games; // Access the 'games' array from the JSON response
            localStorage.setItem("data", JSON.stringify(data));
            createcards(data);
            displayResults(data);
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

        // Get references to the DOM elements
        const searchBar = document.getElementById('searchBar');
        const searchResults = document.getElementById('searchResults');

        // Function to display results
        function displayResults(results) {
            searchResults.innerHTML = ''; 
            results.forEach(item => {
                const div = document.createElement('div');
                div.className = 'resultItem';
                div.textContent = item.title;
                searchResults.appendChild(div);
            });
        }

        // Function to filter the JSON data based on search input
        function filterResults(query) {
            const filtered = jsonData.filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase())
            );
            displayResults(filtered);
        }

        // Event listener for the search bar
        searchBar.addEventListener('input', (event) => {
            const query = event.target.value;
            filterResults(query);
        });

console.log(localStorage);
loadinglocalstorage();

document.getElementById('launchButton').addEventListener('click', function() {
    window.location.href = 'steam://run/322170';
});
