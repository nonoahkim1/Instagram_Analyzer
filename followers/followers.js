// followers.js
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

    const sortOptions = document.getElementById('sortOptions');
    sortOptions.onchange = function () {
        const selectedOption = sortOptions.value;
        displaySortedFollowers(followers, selectedOption);
    };

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

    const [key, order] = sortOption.split('-');
    const flatFollowers = followers.map(fg => fg.string_list_data).flat();
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

        resultsDiv.appendChild(followerDiv);
    });
}

// Retrieve followers data from local storage and display
const followers = JSON.parse(localStorage.getItem('followersData'));
if (followers) {
    displayFollowers(followers);
} else {
    document.getElementById('results').innerHTML = 'No followers data found.';
}
