document.addEventListener('DOMContentLoaded', () => {
    // Create and append the game-info-container
    const gameInfoContainer = document.createElement('div');
    gameInfoContainer.classList.add('game-info-container');
    document.body.appendChild(gameInfoContainer);

    fetch('games.json')
        .then(response => response.json())
        .then(data => {
            const games = data.games;
            const urlParams = new URLSearchParams(window.location.search);
            const gameTitle = urlParams.get('game');
            const gameData = games.find(game => game.name === gameTitle);

            if (gameData) {
                // Insert the main image at the beginning of the gallery array
                const galleryImages = [gameData.img, ...gameData.gallery];

                const galleryImagesHTML = galleryImages.map((imgSrc, index) => `
                    <img src="${imgSrc}" alt="${gameData.name} Gallery Image ${index + 1}" class="gallery-image">
                `).join('');

                const html = `
                    <div class="main-content">
                        <div class="main-image-container">
                            <img src="${gameData.img}" alt="${gameData.name}" class="main-game-image">
                        </div>
                        <div class="game-gallery">
                            ${galleryImagesHTML}
                        </div>
                    </div>
                    <div class="game-details">
                        <h1 class="game-title">${gameData.name}</h1>
                        <p class="game-description">
                            ${gameData.description || "Description for " + gameData.name + ". Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nulla facilisi. Proin convallis nulla a purus gravida, ut dignissim nulla scelerisque."}
                        </p>
                    </div>
                `;
                gameInfoContainer.innerHTML = html;

                // Add event listeners to gallery images for displaying as the main image
                const mainImage = document.querySelector('.main-game-image');
                const galleryImagesElements = document.querySelectorAll('.gallery-image');

                galleryImagesElements.forEach(galleryImage => {
                    galleryImage.addEventListener('click', () => {
                        mainImage.src = galleryImage.src;
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching game data:', error);
        });
});
