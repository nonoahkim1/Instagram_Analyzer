// script.js
async function analyzeFolder() {
    const folderInput = document.getElementById('folderInput');
    const files = folderInput.files;

    if (files.length === 0) {
        alert('Please select a folder.');
        return;
    }

    const userData = {
        followers: [],
        following: [],
        blocked: []
    };

    for (let file of files) {
        

        if (file.name === 'followers_1.json') {
            const followers_JSON = JSON.parse(await file.text());
            userData.followers = followers_JSON.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: fg.string_list_data[0].timestamp
            }));
            // console.log(userData.followers) //
        } else if (file.name === 'following.json') {
            const following_JSON = JSON.parse(await file.text());
            userData.following = following_JSON.relationships_following.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: fg.string_list_data[0].timestamp
            }));
            // console.log(userData.following) //
        } else if (file.name === 'blocked_accounts.json') {
            const blocked_accounts_JSON = JSON.parse(await file.text());
            userData.blocked_accounts = blocked_accounts_JSON.relationships_blocked_users.map(fg => ({
                username: fg.title,
                href: fg.string_list_data[0].href,
                timestamp: fg.string_list_data[0].timestamp
            }));
            // console.log(userData.blocked_accounts)
        }
    }

    if (userData.followers.length > 0 || userData.following.length > 0 || userData.blocked.length > 0) {
        // Store the entire userData object in local storage
        localStorage.setItem('userData', JSON.stringify(userData));

        // Display the links if data is present
        if (userData.followers.length > 0) {
            document.getElementById('followersLink').style.display = 'block';
        }
        if (userData.following.length > 0) {
            document.getElementById('followingLink').style.display = 'block';
        }
        if (userData.blocked_accounts.length > 0) {
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
        if (userData.followers.length > 0) {
            document.getElementById('followersLink').style.display = 'block';
        }
        if (userData.following.length > 0) {
            document.getElementById('followingLink').style.display = 'block';
        }
        if (userData.blocked_accounts.length > 0) {
            document.getElementById('blockedAccountsLink').style.display = 'block';
        }
    }
});
