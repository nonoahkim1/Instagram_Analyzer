async function analyzeFolder() {
    const folderInput = document.getElementById('folderInput');
    const files = folderInput.files;

    if (files.length === 0) {
        alert('Please select a folder.');
        return;
    }

    const userData = {};

    for (let file of files) {
        if (file.name === 'followers_1.json') {
            userData.followers = JSON.parse(await file.text());
        }
    }

    if (userData.followers) {
        generateLinks(userData.followers);
    } else {
        alert('No specific files found.');
    }
}

function generateLinks(followers) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const heading = document.createElement('h2');
    heading.textContent = 'Followers and following';
    resultsDiv.appendChild(heading);

    const followersLink = document.createElement('a');
    followersLink.href = '#';
    followersLink.textContent = 'Followers';
    followersLink.onclick = function () {
        displayFollowers(followers);
    };
    resultsDiv.appendChild(followersLink);
}

function convertTimestamp(timestamp) {
    const dtObject = new Date((timestamp - 28800) * 1000); // Convert to milliseconds
    return dtObject.toLocaleString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric', 
        hour: 'numeric', minute: 'numeric', hour12: true 
    });
}

function displayFollowers(followers) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const heading = document.createElement('h2');
    heading.textContent = 'Followers';
    resultsDiv.appendChild(heading);

    const sortOptions = document.createElement('div');
    sortOptions.classList.add('sort-options');

    const sortSelect = document.createElement('select');
    const options = [
        { value: 'timestamp-desc', text: 'Date (Newest)' },
        { value: 'timestamp-asc', text: 'Date (Oldest)' },
        { value: 'value-asc', text: 'Username (A-Z)' },
        { value: 'value-desc', text: 'Username (Z-A)' }
    ];

    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.text;
        sortSelect.appendChild(opt);
    });

    sortSelect.onchange = function () {
        const [key, order] = sortSelect.value.split('-');
        displaySortedFollowers(followers, key, order);
    };

    sortOptions.appendChild(sortSelect);
    resultsDiv.appendChild(sortOptions);

    displaySortedFollowers(followers, 'timestamp', 'asc');
}

function displaySortedFollowers(followers, key, order) {
    const resultsDiv = document.getElementById('results');
    const sortOptionsHTML = resultsDiv.querySelector('.sort-options').outerHTML;
    
    const sortedFollowers = followers.map(fg => fg.string_list_data).flat().sort((a, b) => {
        if (order === 'asc') {
            return (a[key] > b[key]) ? 1 : -1;
        } else {
            return (a[key] < b[key]) ? 1 : -1;
        }
    });

    resultsDiv.innerHTML = ''; // Clear the previous results

    const heading = document.createElement('h2');
    heading.textContent = 'Followers';
    resultsDiv.appendChild(heading);

    resultsDiv.innerHTML += sortOptionsHTML; // Append the sort options

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

        resultsDiv.appendChild(followerDiv);
    });
}

document.getElementById('folderInput').addEventListener('change', analyzeFolder);
