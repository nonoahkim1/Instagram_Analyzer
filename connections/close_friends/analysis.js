// connections/close_friends/analysis.js
let opacityEnabled = false; // State variable to track if opacity variance is enabled
let fontSizeEnabled = false; // State variable to track if font size variance is enabled
let highlightEnabled = false; // State variable to track if highlighting is enabled

let accumulatingChart, yearlyChart, monthlyCharts = [];

// Function to convert timestamp to a readable format
function convertTimestamp(timestamp) {
    const dtObject = new Date(timestamp * 1000); // Convert to milliseconds
    return dtObject.toLocaleString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric', 
        hour: 'numeric', minute: 'numeric', hour12: true 
    });
}

// Function to get the year from a timestamp
function getYearFromTimestamp(timestamp) {
    const dtObject = new Date(timestamp * 1000); // Convert to milliseconds
    return dtObject.getFullYear();
}

function renderAnalysis(closeFriends) {
    const closeFriendsByYear = getCloseFriendsByYear(closeFriends);
    const closeFriendsByMonth = getCloseFriendsByMonth(closeFriends);

    renderAccumulatingGraph(closeFriendsByYear);
    renderYearlyGraph(closeFriendsByYear);
    renderMonthlyGraphs(closeFriendsByMonth);
    renderCloseFriendsTable(closeFriendsByMonth);

    document.getElementById('toggleOpacity').onclick = function() {
        opacityEnabled = !opacityEnabled; // Toggle state
        renderCloseFriendsTable(closeFriendsByMonth); // Re-render table
    };

    document.getElementById('toggleFontSize').onclick = function() {
        fontSizeEnabled = !fontSizeEnabled; // Toggle state
        renderCloseFriendsTable(closeFriendsByMonth); // Re-render table
    };

    document.getElementById('highlightBlocks').onclick = function() {
        highlightEnabled = !highlightEnabled; // Toggle state
        renderCloseFriendsTable(closeFriendsByMonth); // Re-render table
    };

    // Display friend stats
    const closeFriendUsernames = JSON.parse(localStorage.getItem('userData')).close_friends.map(friend => friend.username);
    const notFollowingBackCount = closeFriends.filter(friend => !closeFriendUsernames.includes(friend.username)).length;
    const totalCloseFriendsCount = closeFriends.length;

    document.getElementById('friend-stats').innerHTML = `Total Close Friends: ${totalCloseFriendsCount}, Not followed Back: ${notFollowingBackCount}`;
}

function getCloseFriendsByYear(closeFriends) {
    const closeFriendsByYear = {};

    closeFriends.forEach(friend => {
        const year = getYearFromTimestamp(friend.timestamp);
        if (!closeFriendsByYear[year]) {
            closeFriendsByYear[year] = 0;
        }
        closeFriendsByYear[year]++;
    });

    return closeFriendsByYear;
}

function getCloseFriendsByMonth(closeFriends) {
    const closeFriendsByMonth = {};

    closeFriends.forEach(friend => {
        const month = new Date(friend.timestamp * 1000).toISOString().slice(0, 7);
        if (!closeFriendsByMonth[month]) {
            closeFriendsByMonth[month] = 0;
        }
        closeFriendsByMonth[month]++;
    });

    return closeFriendsByMonth;
}

function renderAccumulatingGraph(closeFriendsByYear) {
    if (accumulatingChart) {
        accumulatingChart.destroy();
    }
    
    const ctx = document.getElementById('accumulatingGraph').getContext('2d');
    const labels = Object.keys(closeFriendsByYear).sort((a, b) => a - b);
    const data = labels.map((year, index) => {
        return labels.slice(0, index + 1).reduce((sum, label) => sum + closeFriendsByYear[label], 0);
    });

    accumulatingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Accumulating Close Friends',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderYearlyGraph(closeFriendsByYear) {
    if (yearlyChart) {
        yearlyChart.destroy();
    }

    const ctx = document.getElementById('yearlyGraph').getContext('2d');
    const labels = Object.keys(closeFriendsByYear).sort((a, b) => a - b);
    const data = labels.map(year => closeFriendsByYear[year]);

    yearlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Close Friends Gained Per Year',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function generateMonthLabels() {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

function renderMonthlyGraphs(closeFriendsByMonth) {
    monthlyCharts.forEach(chart => chart.destroy());
    monthlyCharts = [];

    const container = document.getElementById('monthlyGraphs');
    container.innerHTML = ''; // Clear any existing graphs

    const years = [...new Set(Object.keys(closeFriendsByMonth).map(month => month.slice(0, 4)))];

    years.forEach(year => {
        const ctx = document.createElement('canvas');
        container.appendChild(ctx);

        const labels = generateMonthLabels();
        const data = labels.map((_, monthIndex) => {
            const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
            return closeFriendsByMonth[monthKey] || 0;
        });

        const monthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Close Friends Gained in ${year}`,
                    data: data,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        monthlyCharts.push(monthlyChart);
    });
}

function renderCloseFriendsTable(closeFriendsByMonth) {
    const table = document.getElementById('friendsTable');
    table.innerHTML = '';

    const years = [...new Set(Object.keys(closeFriendsByMonth).map(month => month.slice(0, 4)))].sort((a, b) => a - b);
    const headerRow = document.createElement('tr');
    const monthNames = ['Year', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total', 'Acc.'];
    
    monthNames.forEach(month => {
        const th = document.createElement('th');
        th.textContent = month;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    let accumulatingCount = 0;

    years.forEach(year => {
        const row = document.createElement('tr');
        let total = 0;
        const yearCell = document.createElement('td');
        yearCell.textContent = year;
        row.appendChild(yearCell);

        // Get min and max friends for the year
        const counts = Array.from({ length: 12 }, (_, month) => {
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            return closeFriendsByMonth[monthKey] || 0;
        });
        const minCount = Math.min(...counts);
        const maxCount = Math.max(...counts);

        for (let month = 0; month < 12; month++) {
            const monthCell = document.createElement('td');
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            const count = closeFriendsByMonth[monthKey] || 0;
            monthCell.textContent = count;

            if (opacityEnabled && minCount !== maxCount) {  // Avoid division by zero
                const opacity = 0.3 + 0.7 * ((count - minCount) / (maxCount - minCount)); // Scale opacity between 0.3 and 1
                monthCell.style.opacity = opacity;
            } else {
                monthCell.style.opacity = 1; // Default opacity
            }

            if (fontSizeEnabled && minCount !== maxCount) {  // Avoid division by zero
                const fontSize = 12 + 8 * ((count - minCount) / (maxCount - minCount)); // Adjust this line to set font size
                monthCell.style.fontSize = `${fontSize}px`; // Apply font size based on friend gain
            } else {
                monthCell.style.fontSize = '16px'; // Default font size
            }

            if (highlightEnabled) {
                if (count === minCount) {
                    monthCell.classList.add('highlight-least'); // Highlight least friends gained month
                } else if (count === maxCount) {
                    monthCell.classList.add('highlight-most'); // Highlight most friends gained month
                } else {
                    monthCell.classList.remove('highlight-least', 'highlight-most'); // Clear background color
                }
            } else {
                monthCell.classList.remove('highlight-least', 'highlight-most'); // Clear background color
            }
            
            total += count;
            row.appendChild(monthCell);
        }

        const totalCell = document.createElement('td');
        totalCell.textContent = total;
        totalCell.classList.add('total');
        row.appendChild(totalCell);

        accumulatingCount += total;
        const accumulatingCell = document.createElement('td');
        accumulatingCell.textContent = accumulatingCount;
        accumulatingCell.classList.add('accumulating');
        row.appendChild(accumulatingCell);

        table.appendChild(row);
    });

    // Apply table styles
    table.classList.add('styled-table');
}

document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.close_friends) {
        renderAnalysis(userData.close_friends);
    }
});
