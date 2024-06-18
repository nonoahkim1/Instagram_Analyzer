async function analyzeFolder() {
    const folderInput = document.getElementById('folderInput');
    const files = folderInput.files;

    if (files.length === 0) {
        alert('Please select a folder.');
        return;
    }

    const jsonFiles = [];
    const htmlFiles = [];

    for (let file of files) {
        if (file.name.endsWith('.json')) {
            jsonFiles.push(file);
        } else if (file.name.endsWith('.html')) {
            htmlFiles.push(file);
        }
    }

    const jsonResults = await analyzeJsonFiles(jsonFiles);
    const htmlResults = await analyzeHtmlFiles(htmlFiles);

    displayResults(jsonResults, htmlResults);
}

async function analyzeJsonFiles(files) {
    const results = [];

    for (let file of files) {
        const text = await file.text();
        const jsonData = JSON.parse(text);
        results.push(jsonData);
    }

    return results;
}

async function analyzeHtmlFiles(files) {
    const results = [];

    for (let file of files) {
        const text = await file.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        results.push(doc);
    }

    return results;
}

function displayResults(jsonResults, htmlResults) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // Display JSON results
    const jsonHeading = document.createElement('h2');
    jsonHeading.textContent = 'JSON File Analysis';
    resultsDiv.appendChild(jsonHeading);

    jsonResults.forEach((result, index) => {
        const pre = document.createElement('pre');
        pre.textContent = `File ${index + 1}:\n${JSON.stringify(result, null, 2)}`;
        resultsDiv.appendChild(pre);
    });

    // Display HTML results
    const htmlHeading = document.createElement('h2');
    htmlHeading.textContent = 'HTML File Analysis';
    resultsDiv.appendChild(htmlHeading);

    htmlResults.forEach((doc, index) => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>File ${index + 1}:</h3>${doc.body.innerHTML}`;
        resultsDiv.appendChild(div);
    });
}
