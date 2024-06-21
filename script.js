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

    // Heading
    const heading = document.createElement('h2');
    heading.textContent = 'Followers';
    resultsDiv.appendChild(heading);

    // Sort options
    const sortOptions = document.createElement('select');
    sortOptions.classList.add('sort-options');
    
    // Append the text node to the selected element
    let textNode = document.createTextNode('Sort');
    sortOptions.appendChild(textNode);

    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        displaySortedFollowers(followers, selectedOption);
    };

    sortOptions.innerHTML = `
        <option value="timestamp-desc">Newest</option>
        <option value="timestamp-asc">Oldest</option>
        <option value="value-asc">A-Z</option>
        <option value="value-desc">Z-A</option>
    `;

    resultsDiv.appendChild(sortOptions);

    // Display followers
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


function displaySortedFollowers(followers, sortOption) {
    const resultsDiv = document.getElementById('results');

    // Split the sort option into key and order
    const [key, order] = sortOption.split('-');

    const sortedFollowers = flatFollowers.sort((a, b) => {
        if (order === 'asc') {
            if (a[key] > b[key]) {
                return 1;
            } else {
                return -1;
            }
        } else {
            if (a[key] < b[key]) {
                return 1;
            } else {
                return -1;
            }
        }
    });
    
    resultsDiv.innerHTML = '';

    const heading = document.createElement('h2');
    heading.textContent = 'Followers';
    resultsDiv.appendChild(heading);

    const sortOptions = document.createElement('select');
    sortOptions.classList.add('sort-options');
    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        displaySortedFollowers(followers, selectedOption);
    };

    sortOptions.innerHTML = `
        <option value="timestamp-desc">Newest</option>
        <option value="timestamp-asc">Oldest</option>
        <option value="value-asc">A-Z</option>
        <option value="value-desc">Z-A</option>
    `;

    sortOptions.value = sortOption; // Preserve selected option
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
