(function() {
    const queueSizeData = [];
    const labels = [];
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Expected queue size',
            data: queueSizeData,
        }],
    };
    for (var x = 0.1; x < 99; x += 0.1) {
        queueSizeData.push(x**2 / (100 - x));
        labels.push(x);
    }
    console.log(chartData);
    const config = {
        type: 'line',
        data: chartData,

    };

    new Chart(
        document.getElementById('capacity-utilization-graph-canvas'),
        config
    );
})();
