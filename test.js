const filterButton = document.getElementById('filterButton');
const closeButton = document.getElementById('closeButton');
const menu = document.getElementById('menu');

filterButton.addEventListener('click', function() {
    toggleMenu();
});

closeButton.addEventListener('click', function() {
    toggleMenu();
});

function toggleMenu() {
    menu.classList.toggle('hidden');
    menu.classList.toggle('visible');
}