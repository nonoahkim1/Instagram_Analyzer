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
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        } else if (file.name === 'following.json') {
            const following_JSON = JSON.parse(await file.text());
            userData.following = following_JSON.relationships_following.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        } else if (file.name === 'blocked_accounts.json') {
            const blocked_accounts_JSON = JSON.parse(await file.text());
            userData.blocked_accounts = blocked_accounts_JSON.relationships_blocked_users.map(fg => ({
                username: fg.title,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
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

function adjustTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();

    const secondSundayMarch = getSecondSundayMarch(year);
    const firstSundayNovember = getFirstSundayNovember(year);

    if (date >= secondSundayMarch && date < firstSundayNovember) {
        return timestamp - 14400; // Subtract 4 hours
    } else {
        return timestamp - 10800; // Subtract 3 hours
    }
}

function getSecondSundayMarch(year) {
    const date = new Date(year, 2, 1); // March 1st
    const day = date.getDay();
    const offset = (day === 0 ? 0 : 7) - day + 7; // Find second Sunday
    date.setDate(1 + offset);
    return date;
}

function getFirstSundayNovember(year) {
    const date = new Date(year, 10, 1); // November 1st
    const day = date.getDay();
    const offset = (day === 0 ? 0 : 7) - day; // Find first Sunday
    date.setDate(1 + offset);
    return date;
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
