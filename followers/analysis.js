function renderAnalysis(followers) {
    const followersByYear = getFollowersByYear(followers);
    const followersByMonth = getFollowersByMonth(followers);

    renderAccumulatingChart(followersByYear);
    renderYearlyChart(followersByYear);
    renderMonthlyChart(followersByMonth);
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

function renderAccumulatingChart(followersByYear) {
    const ctx = document.getElementById('accumulatingChart').getContext('2d');
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

function renderYearlyChart(followersByYear) {
    const ctx = document.getElementById('yearlyChart').getContext('2d');
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

function renderMonthlyChart(followersByMonth) {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
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
