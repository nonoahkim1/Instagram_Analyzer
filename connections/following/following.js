// connections/following/following.js

let followersData = [];
let followingData = [];

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

function generateYearOptions(following) {
    const years = [...new Set(following.map(follower => getYearFromTimestamp(follower.timestamp)))].sort((a, b) => b - a);

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
        const notFollowingBack = document.getElementById('notFollowingBack').checked;
        displayFollowing(following, selectedYear, selectedOption, searchQuery, notFollowingBack);
    };
}

function displayFollowing(following, selectedYear = null, sortOption = 'timestamp-desc', searchQuery = '', notFollowingBack = false) {
    followingData = following; // Store following data for search functionality
    generateYearOptions(following);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const sortOptions = document.getElementById('sortOptions');
    const yearOptions = document.getElementById('yearOptions');
    const searchInput = document.getElementById('searchInput');
    const notFollowingBackCheckbox = document.getElementById('notFollowingBack');

    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const searchQuery = searchInput.value.toLowerCase();
        const notFollowingBack = notFollowingBackCheckbox.checked;
        displaySortedFollowing(selectedOption, selectedYear, searchQuery, notFollowingBack);
    };

    searchInput.oninput = function () {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedOption = sortOptions.value;
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const notFollowingBack = notFollowingBackCheckbox.checked;
        displaySortedFollowing(selectedOption, selectedYear, searchQuery, notFollowingBack);
    };

    notFollowingBackCheckbox.onchange = function () {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedOption = sortOptions.value;
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const notFollowingBack = notFollowingBackCheckbox.checked;
        displaySortedFollowing(selectedOption, selectedYear, searchQuery, notFollowingBack);
    };

    displaySortedFollowing(sortOption, selectedYear, searchQuery, notFollowingBack);
}

function displaySortedFollowing(sortOption, selectedYear, searchQuery, notFollowingBack) {
    const resultsDiv = document.getElementById('results');

    const [key, order] = sortOption.split('-');
    let filteredFollowing = followingData;

    // Filter following by the selected year if applicable
    if (selectedYear !== null) {
        filteredFollowing = filteredFollowing.filter(follower => getYearFromTimestamp(follower.timestamp) === selectedYear);
    }

    // Filter following by the search query
    filteredFollowing = filteredFollowing.filter(follower => follower.username.toLowerCase().includes(searchQuery));

    // Filter following by not following back if applicable
    if (notFollowingBack) {
        filteredFollowing = filteredFollowing.filter(follower => !followersData.some(follow => follow.username === follower.username));
    }

    // Sort following based on the selected option
    const sortedFollowing = filteredFollowing.sort((a, b) => {
        if (key === 'timestamp') {
            return order === 'asc' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
        } else {
            return order === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
        }
    });

    resultsDiv.innerHTML = '';

    sortedFollowing.forEach(follower => {
        const followerDiv = document.createElement('div');
        followerDiv.classList.add('follower');

        const usernameLink = document.createElement('a');
        usernameLink.href = follower.href;
        usernameLink.textContent = follower.username;
        usernameLink.target = '_blank';
        followerDiv.appendChild(usernameLink);

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = convertTimestamp(follower.timestamp);
        followerDiv.appendChild(timestamp);

        // Indicate if the user is not following back
        if (!followersData.some(follow => follow.username === follower.username)) {
            followerDiv.classList.add('not-following-back');
        }

        resultsDiv.appendChild(followerDiv);
    });

    updateFollowingCount(sortedFollowing.length);

    // Update the dropdown to reflect the selected year
    const yearOptions = document.getElementById('yearOptions');
    yearOptions.value = selectedYear === null ? 'all' : selectedYear;
}

function updateFollowingCount(count) {
    document.getElementById('follower-count').innerHTML = `Number of following: ${count}`;
}

function openAnalysis() {
    const analysisWindow = window.open('analysis.html', 'Analysis', 'width=800,height=600');
    analysisWindow.onload = function () {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.following) {
            analysisWindow.renderAnalysis(userData.following);
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        followingData = userData.following;
        if (userData.followers) {
            followersData = userData.followers;
        }
        displayFollowing(followingData);
    } else {
        document.getElementById('results').innerHTML = 'No following data found.';
    }
});
