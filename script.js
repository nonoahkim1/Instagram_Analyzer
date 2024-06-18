async function analyzeFolder() {
    const folderInput = document.getElementById('folderInput');
    const files = folderInput.files;
    const userData = {};

    if (files.length === 0) {
        alert('Please select a folder.');
        return;
    }

    for (let file of files) {
        if (file.name === "blocked_accounts.json") {
            userData.blocked_accounts = JSON.parse(await file.text());
        }
        else if (file.name === "close_friends.json") {
            userData.close_friends = JSON.parse(await file.text());
        }
        else if (file.name === "follow_requests_you've_received.json") {
            userData.received_follow_requests = JSON.parse(await file.text());
        }
        else if (file.name === "followers_1.json") {
            userData.followers = JSON.parse(await file.text());
        }
        else if (file.name === "following_hashtags.json") {
            userData.following_hashtags = JSON.parse(await file.text());
        }
        else if (file.name === "following.json") {
            userData.following = JSON.parse(await file.text());
        }
        else if (file.name === "hide_story_from.json") {
            userData.hide_story_from = JSON.parse(await file.text());
        }
        else if (file.name === "pending_follow_requests.json") {
            userData.pending_follow_requests = JSON.parse(await file.text());
        }
        else if (file.name === "recent_follow_requests.json") {
            userData.recent_follow_requests = JSON.parse(await file.text());
        }
        else if (file.name === "recently_unfollowed_accounts.json") {
            userData.recently_unfollowed_accounts = JSON.parse(await file.text());
        }
        // else if (file.name === ".json") {
        //     userData. = JSON.parse(await file.text());
        // }
        // else if (file.name === ".json") {
        //     userData. = JSON.parse(await file.text());
        // }
        // else if (file.name === ".json") {
        //     userData. = JSON.parse(await file.text());
        // }
    }

    if (Object.keys(userData).length > 0) {
        displaySpecificFilesResult(userData);
    } else {
        alert('No specific files found.');
    }
}


