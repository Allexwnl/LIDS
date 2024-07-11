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

                let currentIndex = 0;

                const html = `
                    <div class="game-details">
                        <h1 class="game-title">${gameData.name}</h1>
                        <div class="game-map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434508933!2d144.95373531531566!3d-37.8172099797519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5770df66c6a8b0!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1615168257202!5m2!1sen!2sau"
                                width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                        </div>
                        <div class="game-buttons">
                            <button id="launchButton" class="custom-card-button">Play</button>
                        </div>
                    </div>
                    <div class="main-content">
                        <div class="main-image-container">
                            <img src="${galleryImages[currentIndex]}" alt="${gameData.name}" class="main-game-image">
                            <div class="arrow left-arrow">&lt;</div>
                            <div class="arrow right-arrow">&gt;</div>
                        </div>
                        <div class="small-cards-container">
                            <div class="small-card">
                                <p class="small-card-text">Small Card 1 Content</p>
                            </div>
                            <div class="small-card">
                                <p class="small-card-text">Small Card 2 Content</p>
                            </div>
                        </div>
                    </div>
                `;
                gameInfoContainer.innerHTML = html;

                const mainImage = document.querySelector('.main-game-image');
                const leftArrow = document.querySelector('.left-arrow');
                const rightArrow = document.querySelector('.right-arrow');

                function updateMainImage(index) {
                    mainImage.src = galleryImages[index];
                }

                leftArrow.addEventListener('click', () => {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryImages.length - 1;
                    updateMainImage(currentIndex);
                });

                rightArrow.addEventListener('click', () => {
                    currentIndex = (currentIndex < galleryImages.length - 1) ? currentIndex + 1 : 0;
                    updateMainImage(currentIndex);
                });

                // Add event listener to Play button
                const playButton = document.getElementById('launchButton');
                playButton.addEventListener('click', () => {
                    window.location.href = `steam://run/${gameData.appId}`;
                });
            }
        })
        .catch(error => {
            console.error('Error fetching game data:', error);
        });
});
