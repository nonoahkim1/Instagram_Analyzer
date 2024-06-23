// connections/blocked_accounts/blocked_accounts.js
let blockedData = [];

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

function generateYearOptions(blocked) {
    const flatBlocked = blocked.map(bu => bu.string_list_data).flat();
    const years = flatBlocked.map(user => getYearFromTimestamp(user.timestamp));
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
        displayBlockedByYear(blocked, selectedYear, selectedOption, searchQuery);
    };
}

function displayBlocked(blocked) {
    blockedData = blocked; // Store blocked data for search functionality
    generateYearOptions(blocked);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const sortOptions = document.getElementById('sortOptions');
    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        const yearOptions = document.getElementById('yearOptions');
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        displaySortedBlocked(blocked, selectedOption, selectedYear, searchQuery);
    };

    const searchInput = document.getElementById('searchInput');
    searchInput.oninput = function () {
        const searchQuery = searchInput.value.toLowerCase();
        const sortOptions = document.getElementById('sortOptions');
        const selectedOption = sortOptions.value;
        const yearOptions = document.getElementById('yearOptions');
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        displaySortedBlocked(blocked, selectedOption, selectedYear, searchQuery);
    };

    displaySortedBlocked(blocked, 'timestamp-desc', null, '');
}

function displaySortedBlocked(blocked, sortOption, selectedYear, searchQuery) {
    const resultsDiv = document.getElementById('results');

    const [key, order] = sortOption.split('-');
    let flatBlocked = blocked.map(bu => bu.string_list_data.map(user => ({
        href: user.href,
        timestamp: user.timestamp,
        value: bu.title // Map the username to `value` field for consistency
    }))).flat();
    
    // Filter blocked users by the selected year if applicable
    if (selectedYear !== null) {
        flatBlocked = flatBlocked.filter(user => getYearFromTimestamp(user.timestamp) === selectedYear);
    }

    // Filter blocked users by the search query
    flatBlocked = flatBlocked.filter(user => user.value.toLowerCase().includes(searchQuery));

    const sortedBlocked = flatBlocked.sort((a, b) => {
        if (order === 'asc') {
            return (a[key] > b[key]) ? 1 : -1;
        } else {
            return (a[key] < b[key]) ? 1 : -1;
        }
    });

    resultsDiv.innerHTML = '';

    const sortOptions = document.getElementById('sortOptions');
    sortOptions.value = sortOption; // Preserve selected option

    sortedBlocked.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('blocked-user');

        const usernameLink = document.createElement('a');
        usernameLink.href = user.href;
        usernameLink.textContent = user.value;
        usernameLink.target = '_blank';
        userDiv.appendChild(usernameLink);

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = convertTimestamp(user.timestamp);
        userDiv.appendChild(timestamp);

        resultsDiv.appendChild(userDiv);
    });

    updateBlockedCount(sortedBlocked.length);
}

function displayBlockedByYear(blocked, year, sortOption, searchQuery) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const filteredBlocked = blocked.map(bu => bu.string_list_data.map(user => ({
        href: user.href,
        timestamp: user.timestamp,
        value: bu.title // Map the username to `value` field for consistency
    }))).flat().filter(user => {
        return (year === null || getYearFromTimestamp(user.timestamp) === year) &&
               user.value.toLowerCase().includes(searchQuery);
    });

    displaySortedBlocked([{string_list_data: filteredBlocked}], sortOption, year, searchQuery);

    const sortOptions = document.getElementById('sortOptions');
    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        displaySortedBlocked(blocked, selectedOption, year, searchQuery);
    };

    updateBlockedCount(filteredBlocked.length);
}

function updateBlockedCount(count) {
    const blockedCountDiv = document.getElementById('blocked-count');
    blockedCountDiv.innerHTML = `Number of blocked accounts: ${count}`;
}

function openAnalysis() {
    const analysisWindow = window.open('analysis.html', 'Analysis', 'width=800,height=600');
    analysisWindow.onload = function () {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.blocked) {
            analysisWindow.renderAnalysis(userData.blocked);
        }
    };
}

// Retrieve user data from local storage and display blocked users if present
const userData = JSON.parse(localStorage.getItem('userData'));
if (userData && userData.blocked) {
    displayBlocked(userData.blocked);
} else {
    document.getElementById('results').innerHTML = 'No blocked accounts data found.';
}
