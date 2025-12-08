 document.addEventListener('DOMContentLoaded', function() {

    const searchButton = document.getElementById('search-btn');
    const usernameInput = document.getElementById('user-input')
    const statsContainer = document.getElementById('.stats-container');
    const easyProgressCircle = document.getElementById('.easy-progress');
    const mediumProgressCircle = document.getElementById('.medium-progress');
    const hardProgressCircle = document.getElementById('.hard-progress');

    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');
    const cardStatsContainer = document.getElementById('.stats-cards');

    searchButton.addEventListener('click', function() {
        const username = usernameInput.value;
        console.log("login username: ", username);
        


    })
 });