// connections/blocked_accounts/analysis.js
let opacityEnabled = false; // State variable to track if opacity variance is enabled
let fontSizeEnabled = false; // State variable to track if font size variance is enabled
let highlightEnabled = false; // State variable to track if highlighting is enabled

let accumulatingChart, yearlyChart, monthlyCharts = [];

function renderAnalysis(blocked) {
    const blockedByYear = getBlockedByYear(blocked);
    const blockedByMonth = getBlockedByMonth(blocked);

    renderAccumulatingGraph(blockedByYear);
    renderYearlyGraph(blockedByYear);
    renderMonthlyGraphs(blockedByMonth);
    renderBlockedTable(blockedByMonth);

    document.getElementById('toggleOpacity').onclick = function() {
        opacityEnabled = !opacityEnabled; // Toggle state
        renderBlockedTable(blockedByMonth); // Re-render table
    };

    document.getElementById('toggleFontSize').onclick = function() {
        fontSizeEnabled = !fontSizeEnabled; // Toggle state
        renderBlockedTable(blockedByMonth); // Re-render table
    };

    document.getElementById('highlightBlocks').onclick = function() {
        highlightEnabled = !highlightEnabled; // Toggle state
        renderBlockedTable(blockedByMonth); // Re-render table
    };

    // Display blocked stats
    const totalBlockedCount = blocked.flatMap(bu => bu.string_list_data).length;
    document.getElementById('blocked-stats').innerHTML = `Total Blocked Accounts: ${totalBlockedCount}`;
}

function getBlockedByYear(blocked) {
    const flatBlocked = blocked.flatMap(bu => bu.string_list_data);
    const blockedByYear = {};

    flatBlocked.forEach(user => {
        const year = new Date((user.timestamp - 28800) * 1000).getFullYear();
        if (!blockedByYear[year]) {
            blockedByYear[year] = 0;
        }
        blockedByYear[year]++;
    });

    return blockedByYear;
}

function getBlockedByMonth(blocked) {
    const flatBlocked = blocked.flatMap(bu => bu.string_list_data);
    const blockedByMonth = {};

    flatBlocked.forEach(user => {
        const month = new Date((user.timestamp - 28800) * 1000).toISOString().slice(0, 7);
        if (!blockedByMonth[month]) {
            blockedByMonth[month] = 0;
        }
        blockedByMonth[month]++;
    });

    return blockedByMonth;
}

function renderAccumulatingGraph(blockedByYear) {
    if (accumulatingChart) {
        accumulatingChart.destroy();
    }
    
    const ctx = document.getElementById('accumulatingGraph').getContext('2d');
    const labels = Object.keys(blockedByYear).sort((a, b) => a - b);
    const data = labels.map((year, index) => {
        return labels.slice(0, index + 1).reduce((sum, label) => sum + blockedByYear[label], 0);
    });

    accumulatingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Accumulating Blocked Accounts',
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

function renderYearlyGraph(blockedByYear) {
    if (yearlyChart) {
        yearlyChart.destroy();
    }

    const ctx = document.getElementById('yearlyGraph').getContext('2d');
    const labels = Object.keys(blockedByYear).sort((a, b) => a - b);
    const data = labels.map(year => blockedByYear[year]);

    yearlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Blocked Accounts Gained Per Year',
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

function renderMonthlyGraphs(blockedByMonth) {
    monthlyCharts.forEach(chart => chart.destroy());
    monthlyCharts = [];

    const container = document.getElementById('monthlyGraphs');
    container.innerHTML = ''; // Clear any existing graphs

    const years = [...new Set(Object.keys(blockedByMonth).map(month => month.slice(0, 4)))];

    years.forEach(year => {
        const ctx = document.createElement('canvas');
        container.appendChild(ctx);

        const labels = generateMonthLabels();
        const data = labels.map((_, monthIndex) => {
            const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
            return blockedByMonth[monthKey] || 0;
        });

        const monthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Blocked Accounts Gained in ${year}`,
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

function renderBlockedTable(blockedByMonth) {
    const table = document.getElementById('blockedTable');
    table.innerHTML = '';

    const years = [...new Set(Object.keys(blockedByMonth).map(month => month.slice(0, 4)))].sort((a, b) => a - b);
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

        // Get min and max blocked for the year
        const counts = Array.from({ length: 12 }, (_, month) => {
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            return blockedByMonth[monthKey] || 0;
        });
        const minCount = Math.min(...counts);
        const maxCount = Math.max(...counts);

        for (let month = 0; month < 12; month++) {
            const monthCell = document.createElement('td');
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            const count = blockedByMonth[monthKey] || 0;
            monthCell.textContent = count;

            if (opacityEnabled && minCount !== maxCount) {  // Avoid division by zero
                const opacity = 0.3 + 0.7 * ((count - minCount) / (maxCount - minCount)); // Scale opacity between 0.3 and 1
                monthCell.style.opacity = opacity;
            } else {
                monthCell.style.opacity = 1; // Default opacity
            }

            if (fontSizeEnabled && minCount !== maxCount) {  // Avoid division by zero
                const fontSize = 12 + 8 * ((count - minCount) / (maxCount - minCount)); // Adjust this line to set font size
                monthCell.style.fontSize = `${fontSize}px`; // Apply font size based on blocked gain
            } else {
                monthCell.style.fontSize = '16px'; // Default font size
            }

            if (highlightEnabled) {
                if (count === minCount) {
                    monthCell.classList.add('highlight-least'); // Highlight least blocked gained month
                } else if (count === maxCount) {
                    monthCell.classList.add('highlight-most'); // Highlight most blocked gained month
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