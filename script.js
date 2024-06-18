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

    const sortAscBtn = document.createElement('button');
    sortAscBtn.textContent = 'Sort by Time Ascending';
    sortAscBtn.onclick = () => displaySortedFollowers(followers, 'timestamp', 'asc');
    sortOptions.appendChild(sortAscBtn);

    const sortDescBtn = document.createElement('button');
    sortDescBtn.textContent = 'Sort by Time Descending';
    sortDescBtn.onclick = () => displaySortedFollowers(followers, 'timestamp', 'desc');
    sortOptions.appendChild(sortDescBtn);

    const sortAZBtn = document.createElement('button');
    sortAZBtn.textContent = 'Sort by Username A-Z';
    sortAZBtn.onclick = () => displaySortedFollowers(followers, 'value', 'asc');
    sortOptions.appendChild(sortAZBtn);

    const sortZABtn = document.createElement('button');
    sortZABtn.textContent = 'Sort by Username Z-A';
    sortZABtn.onclick = () => displaySortedFollowers(followers, 'value', 'desc');
    sortOptions.appendChild(sortZABtn);

    resultsDiv.appendChild(sortOptions);

    followers.forEach(followerGroup => {
        followerGroup.string_list_data.forEach(follower => {
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
    });
}

function displaySortedFollowers(followers, key, order) {
    const resultsDiv = document.getElementById('results');
    const sortedFollowers = followers.map(fg => fg.string_list_data).flat().sort((a, b) => {
        if (order === 'asc') {
            return (a[key] > b[key]) ? 1 : -1;
        } else {
            return (a[key] < b[key]) ? 1 : -1;
        }
    });

    resultsDiv.innerHTML = '';

    const heading = document.createElement('h2');
    heading.textContent = 'Followers';
    resultsDiv.appendChild(heading);

    const sortOptions = document.createElement('div');
    sortOptions.classList.add('sort-options');

    const sortAscBtn = document.createElement('button');
    sortAscBtn.textContent = 'Sort by Time Ascending';
    sortAscBtn.onclick = () => displaySortedFollowers(followers, 'timestamp', 'asc');
    sortOptions.appendChild(sortAscBtn);

    const sortDescBtn = document.createElement('button');
    sortDescBtn.textContent = 'Sort by Time Descending';
    sortDescBtn.onclick = () => displaySortedFollowers(followers, 'timestamp', 'desc');
    sortOptions.appendChild(sortDescBtn);

    const sortAZBtn = document.createElement('button');
    sortAZBtn.textContent = 'Sort by Username A-Z';
    sortAZBtn.onclick = () => displaySortedFollowers(followers, 'value', 'asc');
    sortOptions.appendChild(sortAZBtn);

    const sortZABtn = document.createElement('button');
    sortZABtn.textContent = 'Sort by Username Z-A';
    sortZABtn.onclick = () => displaySortedFollowers(followers, 'value', 'desc');
    sortOptions.appendChild(sortZABtn);

    resultsDiv.appendChild(sortOptions);

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
