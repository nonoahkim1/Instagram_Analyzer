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
        blocked_accounts: [],
        close_friends: [],
        follow_requests_received: [],
        following_hashtags: [],
        hide_story_from: [] // Make sure to define this array
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
        } else if (file.name === 'close_friends.json') {
            const close_friends_JSON = JSON.parse(await file.text());
            userData.close_friends = close_friends_JSON.relationships_close_friends.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        } else if (file.name === "follow_requests_you've_received.json") {
            const follow_requests_received_JSON = JSON.parse(await file.text());
            userData.follow_requests_received = follow_requests_received_JSON.relationships_follow_requests_received.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        } else if (file.name === "following_hashtags.json") {
            const following_hashtags_JSON = JSON.parse(await file.text());
            userData.following_hashtags = following_hashtags_JSON.relationships_following_hashtags.map(fg => {
                const href = convertHashtagHref(fg.string_list_data[0].href);
                const username = isEnglish(fg.string_list_data[0].value) ? fg.string_list_data[0].value : decodeUsernameFromHref(fg.string_list_data[0].href);
                return {
                    username: username,
                    href: href,
                    timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
                };
            });
        } else if (file.name === "hide_story_from.json") {
            const hide_story_from_JSON = JSON.parse(await file.text());
            userData.hide_story_from = hide_story_from_JSON.relationships_hide_stories_from.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        } else if (file.name === "pending_follow_requests.json") {
            const pending_follow_requests_JSON = JSON.parse(await file.text());
            userData.pending_follow_requests = pending_follow_requests_JSON.relationships_follow_requests_sent.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        }
    }

    if (userData.followers.length > 0 || userData.following.length > 0 || userData.blocked_accounts.length > 0 || userData.close_friends.length > 0 || userData.follow_requests_received.length > 0 || userData.following_hashtags.length > 0) {
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
        if (userData.close_friends.length > 0) {
            document.getElementById('closeFriendsLink').style.display = 'block';
        }
        if (userData.follow_requests_received.length > 0) {
            document.getElementById('followRequestReceivedLink').style.display = 'block';
        }
        if (userData.following_hashtags.length > 0) {
            document.getElementById('followingHashtagsLink').style.display = 'block';
        }
        if (userData.hide_story_from.length > 0) {
            document.getElementById('hideStoryFromLink').style.display = 'block';
        }
        if (userData.pending_follow_requests.length > 0) {
            document.getElementById('pendingFollowRequestsdLink').style.display = 'block';
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

function isEnglish(text) {
    return /^[\x00-\x7F]*$/.test(text);
}

function convertHashtagHref(href) {
    const tag = href.split('/').pop();
    return `https://www.instagram.com/explore/tags/${tag}/`;
}

function decodeUsernameFromHref(href) {
    const encodedUsername = href.split('/').pop();
    return decodeURIComponent(encodedUsername);
}

document.getElementById('folderInput').addEventListener('change', analyzeFolder);

// Check local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        if (userData.followers && userData.followers.length > 0) {
            document.getElementById('followersLink').style.display = 'block';
        }
        if (userData.following && userData.following.length > 0) {
            document.getElementById('followingLink').style.display = 'block';
        }
        if (userData.blocked_accounts && userData.blocked_accounts.length > 0) {
            document.getElementById('blockedAccountsLink').style.display = 'block';
        }
        if (userData.close_friends && userData.close_friends.length > 0) {
            document.getElementById('closeFriendsLink').style.display = 'block';
        }
        if (userData.follow_requests_received && userData.follow_requests_received.length > 0) {
            document.getElementById('followRequestReceivedLink').style.display = 'block';
        }
        if (userData.following_hashtags && userData.following_hashtags.length > 0) {
            document.getElementById('followingHashtagsLink').style.display = 'block';
        }
        if (userData.hide_story_from && userData.hide_story_from.length > 0) {
            document.getElementById('hideStoryFromLink').style.display = 'block';
        }
        if (userData.pending_follow_requests && userData.pending_follow_requests.length > 0) {
            document.getElementById('pendingFollowRequestsdLink').style.display = 'block';
        }
    }
});
