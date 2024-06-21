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
        // Store followers data in local storage
        localStorage.setItem('followersData', JSON.stringify(userData.followers));
        // Navigate to followers page
        window.location.href = 'followers.html';
    } else {
        alert('No specific files found.');
    }
}

document.getElementById('folderInput').addEventListener('change', analyzeFolder);
