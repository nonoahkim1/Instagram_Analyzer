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
        hide_story_from: [],
        recent_follow_requests: [],
        recently_unfollowed_accounts: [],
        removed_suggestions: [],
        pending_follow_requests: []
    };

    const fileProcessors = {
        'followers_1.json': async (file) => {
            const followers_JSON = JSON.parse(await file.text());
            userData.followers = followers_JSON.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        },
        'following.json': async (file) => {
            const following_JSON = JSON.parse(await file.text());
            userData.following = following_JSON.relationships_following.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        },
        'blocked_accounts.json': async (file) => {
            const blocked_accounts_JSON = JSON.parse(await file.text());
            userData.blocked_accounts = blocked_accounts_JSON.relationships_blocked_users.map(fg => ({
                username: fg.title,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        },
        'close_friends.json': async (file) => {
            const close_friends_JSON = JSON.parse(await file.text());
            userData.close_friends = close_friends_JSON.relationships_close_friends.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        },
        "follow_requests_you've_received.json": async (file) => {
            const follow_requests_received_JSON = JSON.parse(await file.text());
            userData.follow_requests_received = follow_requests_received_JSON.relationships_follow_requests_received.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        },
        'following_hashtags.json': async (file) => {
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
        },
        'hide_story_from.json': async (file) => {
            const hide_story_from_JSON = JSON.parse(await file.text());
            userData.hide_story_from = hide_story_from_JSON.relationships_hide_stories_from.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        },
        'recent_follow_requests.json': async (file) => {
            const recent_follow_requests_JSON = JSON.parse(await file.text());
            userData.recent_follow_requests = recent_follow_requests_JSON.relationships_permanent_follow_requests.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        },
        'recently_unfollowed_accounts.json': async (file) => {
            const recently_unfollowed_accounts_JSON = JSON.parse(await file.text());
            userData.recently_unfollowed_accounts = recently_unfollowed_accounts_JSON.relationships_unfollowed_users.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        },
        'removed_suggestions.json': async (file) => {
            const removed_suggestions_JSON = JSON.parse(await file.text());
            userData.removed_suggestions = removed_suggestions_JSON.relationships_dismissed_suggested_users.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        },
        'pending_follow_requests.json': async (file) => {
            const pending_follow_requests_JSON = JSON.parse(await file.text());
            userData.pending_follow_requests = pending_follow_requests_JSON.relationships_follow_requests_sent.map(fg => ({
                username: fg.string_list_data[0].value,
                href: fg.string_list_data[0].href,
                timestamp: adjustTimestamp(fg.string_list_data[0].timestamp)
            }));
        }
    };

    for (let file of files) {
        if (fileProcessors[file.name]) {
            await fileProcessors[file.name](file);
        }
    }

    if (Object.values(userData).some(arr => arr.length > 0)) {
        localStorage.setItem('userData', JSON.stringify(userData));

        const linkMappings = {
            followers: 'followersLink',
            following: 'followingLink',
            blocked_accounts: 'blockedAccountsLink',
            close_friends: 'closeFriendsLink',
            follow_requests_received: 'followRequestReceivedLink',
            following_hashtags: 'followingHashtagsLink',
            hide_story_from: 'hideStoryFromLink',
            recent_follow_requests: 'recentFollowRequestsLink',
            recently_unfollowed_accounts: 'recentlyUnfollowedAccountsLink',
            removed_suggestions: 'removedSuggestionsLink',
            pending_follow_requests: 'pendingFollowRequestsdLink'
        };

        for (let key in linkMappings) {
            if (userData[key].length > 0) {
                document.getElementById(linkMappings[key]).style.display = 'block';
            }
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

document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        const linkMappings = {
            followers: 'followersLink',
            following: 'followingLink',
            blocked_accounts: 'blockedAccountsLink',
            close_friends: 'closeFriendsLink',
            follow_requests_received: 'followRequestReceivedLink',
            following_hashtags: 'followingHashtagsLink',
            hide_story_from: 'hideStoryFromLink',
            recent_follow_requests: 'recentFollowRequestsLink',
            recently_unfollowed_accounts: 'recentlyUnfollowedAccountsLink',
            removed_suggestions: 'removedSuggestionsLink',
            pending_follow_requests: 'pendingFollowRequestsdLink'
        };

        for (let key in linkMappings) {
            if (userData[key] && userData[key].length > 0) {
                document.getElementById(linkMappings[key]).style.display = 'block';
            }
        }
    }
});
