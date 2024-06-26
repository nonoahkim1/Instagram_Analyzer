// connections/analysis.js
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

function renderAnalysis(data, dataType) {
    document.getElementById('page-title').textContent = formatTitle(dataType) + ' Analysis';

    const dataByYear = getDataByYear(data);
    const dataByMonth = getDataByMonth(data);

    renderAccumulatingGraph(dataByYear);
    renderYearlyGraph(dataByYear);
    renderMonthlyGraphs(dataByMonth);
    renderDataTable(dataByMonth);

    document.getElementById('toggleOpacity').onclick = function() {
        opacityEnabled = !opacityEnabled; // Toggle state
        renderDataTable(dataByMonth); // Re-render table
    };

    document.getElementById('toggleFontSize').onclick = function() {
        fontSizeEnabled = !fontSizeEnabled; // Toggle state
        renderDataTable(dataByMonth); // Re-render table
    };

    document.getElementById('highlightBlocks').onclick = function() {
        highlightEnabled = !highlightEnabled; // Toggle state
        renderDataTable(dataByMonth); // Re-render table
    };
}

function formatTitle(dataType) {
    return dataType.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function getDataByYear(data) {
    const dataByYear = {};
    const currentYear = new Date().getFullYear();
    let earliestYear = currentYear;

    data.forEach(item => {
        const year = getYearFromTimestamp(item.timestamp);
        if (year < earliestYear) earliestYear = year;
        if (!dataByYear[year]) {
            dataByYear[year] = 0;
        }
        dataByYear[year]++;
    });

    // Ensure all years from the earliest year to the current year are present
    for (let year = earliestYear; year <= currentYear; year++) {
        if (!dataByYear[year]) {
            dataByYear[year] = 0;
        }
    }

    return dataByYear;
}

function getDataByMonth(data) {
    const dataByMonth = {};

    data.forEach(item => {
        const month = new Date(item.timestamp * 1000).toISOString().slice(0, 7);
        if (!dataByMonth[month]) {
            dataByMonth[month] = 0;
        }
        dataByMonth[month]++;
    });

    return dataByMonth;
}

function renderAccumulatingGraph(dataByYear) {
    if (accumulatingChart) {
        accumulatingChart.destroy();
    }
    
    const ctx = document.getElementById('accumulatingGraph').getContext('2d');
    const labels = Object.keys(dataByYear).sort((a, b) => a - b);
    const data = labels.map((year, index) => {
        return labels.slice(0, index + 1).reduce((sum, label) => sum + dataByYear[label], 0);
    });

    const maxData = Math.max(...data);
    const yMax = Math.ceil(maxData * 1.1); // Set y-axis maximum to 10% higher than max data

    accumulatingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Accumulating Data',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: yMax,
                    ticks: {
                        stepSize: 1 // Ensure integer increments
                    }
                }
            }
        }
    });
}

function renderYearlyGraph(dataByYear) {
    if (yearlyChart) {
        yearlyChart.destroy();
    }

    const ctx = document.getElementById('yearlyGraph').getContext('2d');
    const labels = Object.keys(dataByYear).sort((a, b) => a - b);
    const data = labels.map(year => dataByYear[year]);

    const maxData = Math.max(...data);
    const yMax = Math.ceil(maxData * 1.1); // Set y-axis maximum to 10% higher than max data

    yearlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Data Gained Per Year',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: yMax,
                    ticks: {
                        stepSize: 1 // Ensure integer increments
                    }
                }
            }
        }
    });
}

function generateMonthLabels() {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

function renderMonthlyGraphs(dataByMonth) {
    monthlyCharts.forEach(chart => chart.destroy());
    monthlyCharts = [];

    const container = document.getElementById('monthlyGraphs');
    container.innerHTML = ''; // Clear any existing graphs

    const years = [...new Set(Object.keys(dataByMonth).map(month => month.slice(0, 4)))];

    years.forEach(year => {
        const ctx = document.createElement('canvas');
        container.appendChild(ctx);

        const labels = generateMonthLabels();
        const data = labels.map((_, monthIndex) => {
            const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
            return dataByMonth[monthKey] || 0;
        });

        const maxData = Math.max(...data);
        const yMax = Math.ceil(maxData * 1.1); // Set y-axis maximum to 10% higher than max data

        const monthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Data Gained in ${year}`,
                    data: data,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: yMax,
                        ticks: {
                            stepSize: 1 // Ensure integer increments
                        }
                    }
                }
            }
        });

        monthlyCharts.push(monthlyChart);
    });
}

function renderDataTable(dataByMonth) {
    const table = document.getElementById('dataTable');
    table.innerHTML = '';

    const years = [...new Set(Object.keys(dataByMonth).map(month => month.slice(0, 4)))].sort((a, b) => a - b);
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

        // Get min and max data for the year
        const counts = Array.from({ length: 12 }, (_, month) => {
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            return dataByMonth[monthKey] || 0;
        });
        const minCount = Math.min(...counts);
        const maxCount = Math.max(...counts);

        for (let month = 0; month < 12; month++) {
            const monthCell = document.createElement('td');
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            const count = dataByMonth[monthKey] || 0;
            monthCell.textContent = count;

            if (opacityEnabled && minCount !== maxCount) {  // Avoid division by zero
                const opacity = 0.3 + 0.7 * ((count - minCount) / (maxCount - minCount)); // Scale opacity between 0.3 and 1
                monthCell.style.opacity = opacity;
            } else {
                monthCell.style.opacity = 1; // Default opacity
            }

            if (fontSizeEnabled && minCount !== maxCount) {  // Avoid division by zero
                const fontSize = 12 + 8 * ((count - minCount) / (maxCount - minCount)); // Adjust this line to set font size
                monthCell.style.fontSize = `${fontSize}px`; // Apply font size based on data gain
            } else {
                monthCell.style.fontSize = '16px'; // Default font size
            }

            if (highlightEnabled) {
                if (count === minCount) {
                    monthCell.classList.add('highlight-least'); // Highlight least data gained month
                } else if (count === maxCount) {
                    monthCell.classList.add('highlight-most'); // Highlight most data gained month
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
    const urlParams = new URLSearchParams(window.location.search);
    const dataType = urlParams.get('type');
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData[dataType]) {
        renderAnalysis(userData[dataType], dataType);
    }
});
