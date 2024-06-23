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

function generateYearOptions(following) {
    const flatFollowing = following.map(fg => fg.string_list_data).flat();
    const years = flatFollowing.map(follower => getYearFromTimestamp(follower.timestamp));
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
        displayFollowingByYear(following, selectedYear, selectedOption, searchQuery);
    };
}

function displayFollowing(following) {
    followingData = following; // Store following data for search functionality
    generateYearOptions(following);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const sortOptions = document.getElementById('sortOptions');
    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        const yearOptions = document.getElementById('yearOptions');
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        displaySortedFollowing(following, selectedOption, selectedYear, searchQuery);
    };

    const searchInput = document.getElementById('searchInput');
    searchInput.oninput = function () {
        const searchQuery = searchInput.value.toLowerCase();
        const sortOptions = document.getElementById('sortOptions');
        const selectedOption = sortOptions.value;
        const yearOptions = document.getElementById('yearOptions');
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        displaySortedFollowing(following, selectedOption, selectedYear, searchQuery);
    };

    displaySortedFollowing(following, 'timestamp-desc', null, '');
}

function displaySortedFollowing(following, sortOption, selectedYear, searchQuery) {
    const resultsDiv = document.getElementById('results');

    const [key, order] = sortOption.split('-');
    let flatFollowing = following.map(fg => fg.string_list_data).flat();
    
    // Filter following by the selected year if applicable
    if (selectedYear !== null) {
        flatFollowing = flatFollowing.filter(follower => getYearFromTimestamp(follower.timestamp) === selectedYear);
    }

    // Filter following by the search query
    flatFollowing = flatFollowing.filter(follower => follower.value.toLowerCase().includes(searchQuery));

    const sortedFollowing = flatFollowing.sort((a, b) => {
        if (order === 'asc') {
            return (a[key] > b[key]) ? 1 : -1;
        } else {
            return (a[key] < b[key]) ? 1 : -1;
        }
    });

    resultsDiv.innerHTML = '';

    const sortOptions = document.getElementById('sortOptions');
    sortOptions.value = sortOption; // Preserve selected option

    sortedFollowing.forEach(follower => {
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

        resultsDiv.appendChild(followerDiv);
    });

    updateFollowerCount(sortedFollowing.length);
}

function displayFollowingByYear(following, year, sortOption, searchQuery) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const filteredFollowing = following.map(fg => fg.string_list_data).flat().filter(follower => {
        return (year === null || getYearFromTimestamp(follower.timestamp) === year) &&
               follower.value.toLowerCase().includes(searchQuery);
    });

    displaySortedFollowing([{string_list_data: filteredFollowing}], sortOption, year, searchQuery);

    const sortOptions = document.getElementById('sortOptions');
    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        displaySortedFollowing(following, selectedOption, year, searchQuery);
    };

    updateFollowerCount(filteredFollowing.length);
}

function updateFollowerCount(count) {
    const followerCountDiv = document.getElementById('follower-count');
    followerCountDiv.innerHTML = `Number of following: ${count}`;
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

// Retrieve user data from local storage and display following if present
const userData = JSON.parse(localStorage.getItem('userData'));
if (userData && userData.following) {
    displayFollowing(userData.following);
} else {
    document.getElementById('results').innerHTML = 'No following data found.';
}
