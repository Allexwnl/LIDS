const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Common directories to check for Steam games (adjust based on your setup)
const steamDirectories = [
    'C:/Program Files (x86)/Steam/steamapps/common',
    'C:/Program Files/Steam/steamapps/common',
    'D:/SteamLibrary/steamapps/common',  // Add more paths as necessary
];

// Example list of games with their folder names
const games = [
    { name: 'Game Name 1', folderName: 'GameFolder1' },
    { name: 'Game Name 2', folderName: 'GameFolder2' },
    // Add more games as necessary
];

// Function to check if a game is installed
function checkIfGameInstalled(game) {
    for (const dir of steamDirectories) {
        const gamePath = path.join(dir, game.folderName);
        if (fs.existsSync(gamePath)) {
            return true;
        }
    }
    return false;
}

// Check all games
games.forEach(game => {
    const isInstalled = checkIfGameInstalled(game);
    console.log(`${game.name} is ${isInstalled ? 'installed' : 'not installed'}`);
});
