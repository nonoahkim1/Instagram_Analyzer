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
