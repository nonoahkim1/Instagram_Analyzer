let data = [];

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
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        displayData(data, selectedYear, searchQuery);
    };
}

function displayData(data, selectedYear = null, searchQuery = '') {
    generateYearOptions(data);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const yearOptions = document.getElementById('yearOptions');
    const searchInput = document.getElementById('searchInput');

    searchInput.oninput = function () {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedYear = yearOptions.value === 'all' ? null : parseInt(yearOptions.value);
        displayFilteredData(selectedYear, searchQuery);
    };

    displayFilteredData(selectedYear, searchQuery);
}

function displayFilteredData(selectedYear, searchQuery) {
    const resultsDiv = document.getElementById('results');
    let filteredData = data;

    // Filter data by the selected year if applicable
    if (selectedYear !== null) {
        filteredData = filteredData.filter(item => getYearFromTimestamp(item.timestamp) === selectedYear);
    }

    // Filter data by the search query
    filteredData = filteredData.filter(item => 
        item.comment.toLowerCase().includes(searchQuery) || item.username.toLowerCase().includes(searchQuery)
    );

    resultsDiv.innerHTML = '';

    filteredData.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('comments');

        const ownerDiv = document.createElement('div');
        ownerDiv.textContent = `Media Owner: ${item.username}`;
        itemDiv.appendChild(ownerDiv);

        const commentDiv = document.createElement('div');
        if (item.comment.startsWith('<img')) {
            commentDiv.innerHTML = item.comment;
        } else {
            commentDiv.textContent = `Comment: ${item.comment}`;
        }
        itemDiv.appendChild(commentDiv);

        const timestampDiv = document.createElement('div');
        timestampDiv.classList.add('timestamp');
        timestampDiv.textContent = convertTimestamp(item.timestamp);
        itemDiv.appendChild(timestampDiv);

        resultsDiv.appendChild(itemDiv);
    });

    updateDataCount(filteredData.length);
}

function updateDataCount(count) {
    document.getElementById('comments-count').innerHTML = `Number of comments: ${count}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.post_comments) {
        data = userData.post_comments;
        displayData(data);
    } else {
        document.getElementById('results').innerHTML = 'No data found.';
    }
});
