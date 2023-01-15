(function() {
    function formatNumber(num, digits) {
        return new Intl.NumberFormat("en-GB",
            {
                maximumSignificantDigits: digits,
            }).format(num);
    }

    const queueSizeData = [];
    const labels = [];
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Expected queue size',
            data: queueSizeData,
        }],
    };

    let x = 0;
    while (x < 99.5) {
        queueSizeData.push((x/100)**2 / (1 - x/100));
        labels.push(x);

        if (x < 99) {
            x += 1
        } else {
            x += 0.1
        }
    }
    const maxValue = queueSizeData.at(-1);

    const config = {
        type: 'line',
        data: chartData,
        options: {
            elements: {
                point: {
                    pointRadius: 10,
                    pointBorderColor: 'rgba(0,0,0,0)',
                    pointBackgroundColor: 'rgba(0,0,0,0)',
                },
                line: {
                    borderWidth: 3,
                    cubicInterpolationMode: 'monotone',
                    borderColor: '#480ca8ff',
                },
            },
            scales: {
                x: {
                    type: 'linear',
                    suggestedMin: 0,
                    suggestedMax: 100,
                    title: {
                        display: true,
                        text: "Capacity utilization",
                    },
                },
                y: {
                    max: maxValue,
                    ticks: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "Expected queue size",
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';

                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatNumber(context.parsed.y, 3);
                            }
                            return label;
                        }
                    },
                },
            },
        }
    };

    new Chart(
        document.getElementById('capacity-utilization-graph-canvas'),
        config
    );
})();
