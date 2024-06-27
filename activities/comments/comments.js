// activities/comments/comments.js
let data = [];
let dataType = 'post_comments';

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

function generateYearOptions(data) {
    const years = [...new Set(data.map(item => getYearFromTimestamp(item.timestamp)))].sort((a, b) => b - a);

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
        const searchUsername = document.getElementById('searchUsername').value.toLowerCase();
        const searchComment = document.getElementById('searchComment').value.toLowerCase();
        displayData(data, selectedYear, selectedOption, searchUsername, searchComment);
    };
}

function displayData(data, selectedYear = null, sortOption = 'timestamp-desc', searchUsername = '', searchComment = '') {
    generateYearOptions(data);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const sortOptions = document.getElementById('sortOptions');
    const yearOptions = document.getElementById('yearOptions');
    const searchUsernameInput = document.getElementById('searchUsername');
    const searchCommentInput = document.getElementById('searchComment');

    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        const searchUsername = searchUsernameInput.value.toLowerCase();
        const searchComment = searchCommentInput.value.toLowerCase();
        displaySortedData(selectedOption, selectedYear, searchUsername, searchComment);
    };

    searchUsernameInput.oninput = function () {
        const searchUsername = searchUsernameInput.value.toLowerCase();
        const searchComment = searchCommentInput.value.toLowerCase();
        const selectedOption = sortOptions.value;
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        displaySortedData(selectedOption, selectedYear, searchUsername, searchComment);
    };

    searchCommentInput.oninput = function () {
        const searchUsername = searchUsernameInput.value.toLowerCase();
        const searchComment = searchCommentInput.value.toLowerCase();
        const selectedOption = sortOptions.value;
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        displaySortedData(selectedOption, selectedYear, searchUsername, searchComment);
    };

    displaySortedData(sortOption, selectedYear, searchUsername, searchComment);
}

function displaySortedData(sortOption, selectedYear, searchUsername, searchComment) {
    const resultsDiv = document.getElementById('results');

    const [key, order] = sortOption.split('-');
    let filteredData = data;

    // Filter data by the selected year if applicable
    if (selectedYear !== null) {
        filteredData = filteredData.filter(item => getYearFromTimestamp(item.timestamp) === selectedYear);
    }

    // Filter data by the search queries
    filteredData = filteredData.filter(item => 
        item.username.toLowerCase().includes(searchUsername) && 
        item.comment.toLowerCase().includes(searchComment)
    );

    // Sort data based on the selected option
    const sortedData = filteredData.sort((a, b) => {
        if (key === 'timestamp') {
            return order === 'asc' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
        } else {
            return order === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
        }
    });

    resultsDiv.innerHTML = '';

    sortedData.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('users');

        const ownerDiv = document.createElement('div');
        ownerDiv.classList.add('owner');
        ownerDiv.textContent = item.username;
        itemDiv.appendChild(ownerDiv);

        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = item.comment;
        itemDiv.appendChild(commentDiv);

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = convertTimestamp(item.timestamp);
        itemDiv.appendChild(timestamp);

        resultsDiv.appendChild(itemDiv);
    });

    updateDataCount(sortedData.length);

    // Update the dropdown to reflect the selected year
    const yearOptions = document.getElementById('yearOptions');
    yearOptions.value = selectedYear === null ? 'all' : selectedYear;
}

function updateDataCount(count) {
    document.getElementById('comments-count').innerHTML = `Number of comments: ${count}`;
}

function openAnalysis() {
    const analysisWindow = window.open('analysis.html', 'Analysis', 'width=800,height=600');
    analysisWindow.onload = function () {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData[dataType]) {
            analysisWindow.renderAnalysis(userData[dataType], dataType);
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    dataType = urlParams.get('type');
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData[dataType]) {
        data = userData[dataType];
        document.getElementById('page-title').textContent = dataType.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        displayData(data);
    } else {
        document.getElementById('results').innerHTML = 'No data found.';
    }
});
