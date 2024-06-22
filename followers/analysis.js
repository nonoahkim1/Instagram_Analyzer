let varianceEnabled = true; // State variable to track if variance is enabled
let highlightEnabled = false; // State variable to track if highlighting is enabled

function renderAnalysis(followers) {
    const followersByYear = getFollowersByYear(followers);
    const followersByMonth = getFollowersByMonth(followers);

    renderAccumulatingGraph(followersByYear);
    renderYearlyGraph(followersByYear);
    renderMonthlyGraph(followersByMonth);
    renderFollowersTable(followersByMonth);

    document.getElementById('toggleVariance').onclick = function() {
        varianceEnabled = !varianceEnabled; // Toggle state
        renderFollowersTable(followersByMonth); // Re-render table
    };

    document.getElementById('highlightBlocks').onclick = function() {
        highlightEnabled = !highlightEnabled; // Toggle state
        renderFollowersTable(followersByMonth); // Re-render table
    };
}

function getFollowersByYear(followers) {
    const flatFollowers = followers.map(fg => fg.string_list_data).flat();
    const followersByYear = {};

    flatFollowers.forEach(follower => {
        const year = new Date((follower.timestamp - 28800) * 1000).getFullYear();
        if (!followersByYear[year]) {
            followersByYear[year] = 0;
        }
        followersByYear[year]++;
    });

    return followersByYear;
}

function getFollowersByMonth(followers) {
    const flatFollowers = followers.map(fg => fg.string_list_data).flat();
    const followersByMonth = {};

    flatFollowers.forEach(follower => {
        const month = new Date((follower.timestamp - 28800) * 1000).toISOString().slice(0, 7);
        if (!followersByMonth[month]) {
            followersByMonth[month] = 0;
        }
        followersByMonth[month]++;
    });

    return followersByMonth;
}

function renderAccumulatingGraph(followersByYear) {
    const ctx = document.getElementById('accumulatingGraph').getContext('2d');
    const labels = Object.keys(followersByYear).sort((a, b) => a - b);
    const data = labels.map((year, index) => {
        return labels.slice(0, index + 1).reduce((sum, label) => sum + followersByYear[label], 0);
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Accumulating Followers',
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

function renderYearlyGraph(followersByYear) {
    const ctx = document.getElementById('yearlyGraph').getContext('2d');
    const labels = Object.keys(followersByYear).sort((a, b) => a - b);
    const data = labels.map(year => followersByYear[year]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Followers Gained Per Year',
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

function renderMonthlyGraph(followersByMonth) {
    const ctx = document.getElementById('monthlyGraph').getContext('2d');
    const labels = Object.keys(followersByMonth).sort();
    const data = labels.map(month => followersByMonth[month]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Followers Gained Per Month',
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
}

function renderFollowersTable(followersByMonth) {
    const table = document.getElementById('followersTable');
    table.innerHTML = '';

    const years = [...new Set(Object.keys(followersByMonth).map(month => month.slice(0, 4)))].sort((a, b) => a - b);
    const headerRow = document.createElement('tr');
    const monthNames = ['Year', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total', 'Accumulating'];
    
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

        // Get min and max followers for the year
        const counts = Array.from({ length: 12 }, (_, month) => {
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            return followersByMonth[monthKey] || 0;
        });
        const minCount = Math.min(...counts);
        const maxCount = Math.max(...counts);

        for (let month = 0; month < 12; month++) {
            const monthCell = document.createElement('td');
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            const count = followersByMonth[monthKey] || 0;
            monthCell.textContent = count;
            if (varianceEnabled && minCount !== maxCount) {  // Avoid division by zero
                const opacity = 0.3 + 0.7 * ((count - minCount) / (maxCount - minCount)); // Scale opacity between 0.3 and 1
                monthCell.style.opacity = opacity;

                const fontSize = 12 + 8 * ((count - minCount) / (maxCount - minCount)); // Adjust this line to set font size
                monthCell.style.fontSize = `${fontSize}px`; // Apply font size based on follower gain
            } else {
                monthCell.style.opacity = 1;
                monthCell.style.fontSize = '16px'; // Default font size
            }
            if (highlightEnabled) {
                if (count === minCount) {
                    monthCell.style.backgroundColor = '#FF8080'; // Highlight least followers gained month
                } else if (count === maxCount) {
                    monthCell.style.backgroundColor = '#C7F6C7'; // Highlight most followers gained month
                } else {
                    monthCell.style.backgroundColor = ''; // Clear background color
                }
            } else {
                monthCell.style.backgroundColor = ''; // Clear background color
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
}
