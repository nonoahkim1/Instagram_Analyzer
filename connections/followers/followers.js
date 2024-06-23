// connections/followers/followers.js
let followersData = [];
let followingData = [];

function convertTimestamp(timestamp) {
    const dtObject = new Date((timestamp - 28800) * 1000); // Convert to milliseconds
    return dtObject.toLocaleString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric', 
        hour: 'numeric', minute: 'numeric', hour12: true 
    });
}

function getYearFromTimestamp(timestamp) {
    const dtObject = new Date((timestamp - 28800) * 1000); // Convert to milliseconds
    return dtObject.getFullYear();
}

function generateYearOptions(followers) {
    const flatFollowers = followers.map(fg => fg.string_list_data).flat();
    const years = flatFollowers.map(follower => getYearFromTimestamp(follower.timestamp));
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a); // Sort in descending order

    const yearOptions = document.getElementById('yearOptions');
    yearOptions.innerHTML = ''; // Clear existing options

    // Add 'All' option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All';
    yearOptions.appendChild(allOption);

    uniqueYears.forEach(year => {
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
        displayFollowersByYear(followers, selectedYear, selectedOption, searchQuery, notFollowingBack);
    };
}

function displayFollowers(followers) {
    followersData = followers; // Store followers data for search functionality
    generateYearOptions(followers);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const sortOptions = document.getElementById('sortOptions');
    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        const yearOptions = document.getElementById('yearOptions');
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        const notFollowingBack = document.getElementById('notFollowingBack').checked;
        displaySortedFollowers(followers, selectedOption, selectedYear, searchQuery, notFollowingBack);
    };

    const searchInput = document.getElementById('searchInput');
    searchInput.oninput = function () {
        const searchQuery = searchInput.value.toLowerCase();
        const sortOptions = document.getElementById('sortOptions');
        const selectedOption = sortOptions.value;
        const yearOptions = document.getElementById('yearOptions');
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const notFollowingBack = document.getElementById('notFollowingBack').checked;
        displaySortedFollowers(followers, selectedOption, selectedYear, searchQuery, notFollowingBack);
    };

    const notFollowingBackCheckbox = document.getElementById('notFollowingBack');
    notFollowingBackCheckbox.onchange = function () {
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        const sortOptions = document.getElementById('sortOptions');
        const selectedOption = sortOptions.value;
        const yearOptions = document.getElementById('yearOptions');
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const notFollowingBack = notFollowingBackCheckbox.checked;
        displaySortedFollowers(followers, selectedOption, selectedYear, searchQuery, notFollowingBack);
    };

    displaySortedFollowers(followers, 'timestamp-desc', null, '', false);
}

function displaySortedFollowers(followers, sortOption, selectedYear, searchQuery, notFollowingBack) {
    const resultsDiv = document.getElementById('results');

    const [key, order] = sortOption.split('-');
    let flatFollowers = followers.map(fg => fg.string_list_data).flat();
    
    // Filter followers by the selected year if applicable
    if (selectedYear !== null) {
        flatFollowers = flatFollowers.filter(follower => getYearFromTimestamp(follower.timestamp) === selectedYear);
    }

    // Filter followers by the search query
    flatFollowers = flatFollowers.filter(follower => follower.value.toLowerCase().includes(searchQuery));

    // Filter followers by not following back if applicable
    if (notFollowingBack) {
        flatFollowers = flatFollowers.filter(follower => !followingData.some(follow => follow.value === follower.value));
    }

    const sortedFollowers = flatFollowers.sort((a, b) => {
        if (order === 'asc') {
            return (a[key] > b[key]) ? 1 : -1;
        } else {
            return (a[key] < b[key]) ? 1 : -1;
        }
    });

    resultsDiv.innerHTML = '';

    const sortOptions = document.getElementById('sortOptions');
    sortOptions.value = sortOption; // Preserve selected option

    sortedFollowers.forEach(follower => {
        const followerDiv = document.createElement('div');
        followerDiv.classList.add('follower');

        const usernameLink = document.createElement('a');
        usernameLink.href = follower.href;
        usernameLink.textContent = follower.value;
        usernameLink.target = '_blank';
        followerDiv.appendChild(usernameLink);

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = convertTimestamp(follower.timestamp);
        followerDiv.appendChild(timestamp);

        // Indicate if the user is not following back
        if (!followingData.some(follow => follow.value === follower.value)) {
            followerDiv.classList.add('not-following-back');
        }

        resultsDiv.appendChild(followerDiv);
    });

    updateFollowerCount(sortedFollowers.length);
}

function displayFollowersByYear(followers, year, sortOption, searchQuery, notFollowingBack) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const filteredFollowers = followers.map(fg => fg.string_list_data).flat().filter(follower => {
        return (year === null || getYearFromTimestamp(follower.timestamp) === year) &&
               follower.value.toLowerCase().includes(searchQuery);
    });

    displaySortedFollowers([{string_list_data: filteredFollowers}], sortOption, year, searchQuery, notFollowingBack);

    const sortOptions = document.getElementById('sortOptions');
    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        displaySortedFollowers(followers, selectedOption, year, searchQuery, notFollowingBack);
    };

    updateFollowerCount(filteredFollowers.length);
}

function updateFollowerCount(count) {
    const followerCountDiv = document.getElementById('follower-count');
    followerCountDiv.innerHTML = `Number of followers: ${count}`;
}

function openAnalysis() {
    const analysisWindow = window.open('analysis.html', 'Analysis', 'width=800,height=600');
    analysisWindow.onload = function () {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.followers) {
            analysisWindow.renderAnalysis(userData.followers);
        }
    };
}

// Retrieve user data from local storage and display followers if present
const userData = JSON.parse(localStorage.getItem('userData'));
if (userData && userData.followers) {
    followersData = userData.followers.map(fg => fg.string_list_data).flat();
    if (userData.following) {
        followingData = userData.following.map(fg => fg.string_list_data).flat();
    }
    displayFollowers(userData.followers);
} else {
    document.getElementById('results').innerHTML = 'No followers data found.';
}
