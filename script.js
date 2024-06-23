// script.js
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
        } else if (file.name === 'following.json') {
            const followingData = JSON.parse(await file.text());
            userData.following = followingData.relationships_following;
        } else if (file.name === 'blocked_accounts.json') {
            const blockedData = JSON.parse(await file.text());
            userData.blocked = blockedData.relationships_blocked_users;
        }
    }

    if (Object.keys(userData).length > 0) {
        // Store the entire userData object in local storage
        localStorage.setItem('userData', JSON.stringify(userData));

        // Display the links if data is present
        if (userData.followers) {
            document.getElementById('followersLink').style.display = 'block';
        }
        if (userData.following) {
            document.getElementById('followingLink').style.display = 'block';
        }
        if (userData.blocked) {
            document.getElementById('blockedAccountsLink').style.display = 'block';
        }
    } else {
        alert('No specific files found.');
    }
}

document.getElementById('folderInput').addEventListener('change', analyzeFolder);

// Check local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        if (userData.followers) {
            document.getElementById('followersLink').style.display = 'block';
        }
        if (userData.following) {
            document.getElementById('followingLink').style.display = 'block';
        }
        if (userData.blocked) {
            document.getElementById('blockedAccountsLink').style.display = 'block';
        }
    }
});
