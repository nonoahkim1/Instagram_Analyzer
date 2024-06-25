// connections/close_friends/close_friends.js
let closeFriendsData = [];

function convertTimestamp(timestamp) {
    const dtObject = new Date(timestamp * 1000); // Convert to milliseconds
    return dtObject.toLocaleString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: true
    });
}

function getYearFromTimestamp(timestamp) {
    const dtObject = new Date(timestamp * 1000); // Convert to milliseconds
    return dtObject.getFullYear();
}

function generateYearOptions(closeFriends) {
    const years = [...new Set(closeFriends.map(friend => getYearFromTimestamp(friend.timestamp)))].sort((a, b) => b - a);

    const yearOptions = document.getElementById('yearOptions');
    yearOptions.innerHTML = ''; // Clear existing options

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All';
    yearOptions.appendChild(allOption);

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearOptions.appendChild(option);
    });

    yearOptions.onchange = function () {
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const sortOptions = document.getElementById('sortOptions');
        const selectedOption = sortOptions.value;
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        displayCloseFriends(closeFriends, selectedYear, selectedOption, searchQuery);
    };
}

function displayCloseFriends(closeFriends, selectedYear = null, sortOption = 'timestamp-desc', searchQuery = '') {
    closeFriendsData = closeFriends; // Store close friends data for search functionality
    generateYearOptions(closeFriends);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const sortOptions = document.getElementById('sortOptions');
    const yearOptions = document.getElementById('yearOptions');
    const searchInput = document.getElementById('searchInput');

    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const searchQuery = searchInput.value.toLowerCase();
        displaySortedCloseFriends(selectedOption, selectedYear, searchQuery);
    };

    searchInput.oninput = function () {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedOption = sortOptions.value;
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        displaySortedCloseFriends(selectedOption, selectedYear, searchQuery);
    };

    displaySortedCloseFriends(sortOption, selectedYear, searchQuery);
}

function displaySortedCloseFriends(sortOption, selectedYear, searchQuery) {
    const resultsDiv = document.getElementById('results');

    const [key, order] = sortOption.split('-');
    let filteredCloseFriends = closeFriendsData;

    // Filter close friends by the selected year if applicable
    if (selectedYear !== null) {
        filteredCloseFriends = filteredCloseFriends.filter(friend => getYearFromTimestamp(friend.timestamp) === selectedYear);
    }

    // Filter close friends by the search query
    filteredCloseFriends = filteredCloseFriends.filter(friend => friend.username.toLowerCase().includes(searchQuery));

    // Sort close friends based on the selected option
    const sortedCloseFriends = filteredCloseFriends.sort((a, b) => {
        if (key === 'timestamp') {
            return order === 'asc' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
        } else {
            return order === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
        }
    });

    resultsDiv.innerHTML = '';

    sortedCloseFriends.forEach(friend => {
        const friendDiv = document.createElement('div');
        friendDiv.classList.add('users');

        const usernameLink = document.createElement('a');
        usernameLink.href = friend.href;
        usernameLink.textContent = friend.username;
        usernameLink.target = '_blank';
        friendDiv.appendChild(usernameLink);

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = convertTimestamp(friend.timestamp);
        friendDiv.appendChild(timestamp);

        resultsDiv.appendChild(friendDiv);
    });

    updateCloseFriendCount(sortedCloseFriends.length);

    // Update the dropdown to reflect the selected year
    const yearOptions = document.getElementById('yearOptions');
    yearOptions.value = selectedYear === null ? 'all' : selectedYear;
}

function updateCloseFriendCount(count) {
    document.getElementById('friend-count').innerHTML = `Number of close friends: ${count}`;
}

function openAnalysis() {
    const analysisWindow = window.open('analysis.html', 'Analysis', 'width=800,height=600');
    analysisWindow.onload = function () {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.close_friends) {
            analysisWindow.renderAnalysis(userData.close_friends);
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        closeFriendsData = userData.close_friends;
        displayCloseFriends(closeFriendsData);
    } else {
        document.getElementById('results').innerHTML = 'No close friends data found.';
    }
});
