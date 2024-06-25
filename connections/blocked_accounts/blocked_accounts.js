// connections/blocked_accounts/blocked_accounts.js

let blockedData = [];

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

function generateYearOptions(blocked) {
    const years = [...new Set(blocked.map(blockedAccount => getYearFromTimestamp(blockedAccount.timestamp)))].sort((a, b) => b - a);

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
        displayBlockedAccounts(blocked, selectedYear, selectedOption, searchQuery);
    };
}

function displayBlockedAccounts(blocked, selectedYear = null, sortOption = 'timestamp-desc', searchQuery = '') {
    blockedData = blocked; // Store blocked accounts data for search functionality
    generateYearOptions(blocked);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const sortOptions = document.getElementById('sortOptions');
    const yearOptions = document.getElementById('yearOptions');
    const searchInput = document.getElementById('searchInput');

    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const searchQuery = searchInput.value.toLowerCase();
        displaySortedBlockedAccounts(selectedOption, selectedYear, searchQuery);
    };

    searchInput.oninput = function () {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedOption = sortOptions.value;
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        displaySortedBlockedAccounts(selectedOption, selectedYear, searchQuery);
    };

    displaySortedBlockedAccounts(sortOption, selectedYear, searchQuery);
}

function displaySortedBlockedAccounts(sortOption, selectedYear, searchQuery) {
    const resultsDiv = document.getElementById('results');

    const [key, order] = sortOption.split('-');
    let filteredBlocked = blockedData;

    // Filter blocked accounts by the selected year if applicable
    if (selectedYear !== null) {
        filteredBlocked = filteredBlocked.filter(blockedAccount => getYearFromTimestamp(blockedAccount.timestamp) === selectedYear);
    }

    // Filter blocked accounts by the search query
    filteredBlocked = filteredBlocked.filter(blockedAccount => blockedAccount.username.toLowerCase().includes(searchQuery));

    // Sort blocked accounts based on the selected option
    const sortedBlocked = filteredBlocked.sort((a, b) => {
        if (key === 'timestamp') {
            return order === 'asc' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
        } else {
            return order === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
        }
    });

    resultsDiv.innerHTML = '';

    sortedBlocked.forEach(blockedAccount => {
        const blockedAccountDiv = document.createElement('div');
        blockedAccountDiv.classList.add('users');

        const usernameLink = document.createElement('a');
        usernameLink.href = blockedAccount.href;
        usernameLink.textContent = blockedAccount.username;
        usernameLink.target = '_blank';
        blockedAccountDiv.appendChild(usernameLink);

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = convertTimestamp(blockedAccount.timestamp);
        blockedAccountDiv.appendChild(timestamp);

        resultsDiv.appendChild(blockedAccountDiv);
    });

    updateBlockedCount(sortedBlocked.length);

    // Update the dropdown to reflect the selected year
    const yearOptions = document.getElementById('yearOptions');
    yearOptions.value = selectedYear === null ? 'all' : selectedYear;
}

function updateBlockedCount(count) {
    document.getElementById('blocked-count').innerHTML = `Number of blocked accounts: ${count}`;
}

function openAnalysis() {
    const analysisWindow = window.open('analysis.html', 'Analysis', 'width=800,height=600');
    analysisWindow.onload = function () {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.blocked_accounts) {
            analysisWindow.renderAnalysis(userData.blocked_accounts);
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        blockedData = userData.blocked_accounts;
        displayBlockedAccounts(blockedData);
    } else {
        document.getElementById('results').innerHTML = 'No blocked accounts data found.';
    }
});
