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
        // Add other conditions for different files if needed
        // Example:
        // else if (file.name === 'blocked_accounts.json') {
        //     userData.blockedAccounts = JSON.parse(await file.text());
        // }
    }

    if (Object.keys(userData).length > 0) {
        // Store the entire userData object in local storage
        localStorage.setItem('userData', JSON.stringify(userData));

        // Display the followers link if followers data is present
        if (userData.followers) {
            document.getElementById('followersLink').style.display = 'block';
        }
    } else {
        alert('No specific files found.');
    }
}

document.getElementById('folderInput').addEventListener('change', analyzeFolder);

// Check local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.followers) {
        document.getElementById('followersLink').style.display = 'block';
    }
});
