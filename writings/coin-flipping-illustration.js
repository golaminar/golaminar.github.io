(function () {
    const cumulativeTotals = [];
    const labels = [];
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Cumulative Total',
            data: cumulativeTotals,
        }]
    };
    const config = {
        type: 'line',
        data: chartData,
        options: {
            borderColor: '#480ca8ff',
            plugins: {
                legend: {
                    display: false,
                },
            },
            animation: false,
            elements: {
                line: {
                    stepped: true,
                },
            },
            scales: {
                y: {
                    suggestedMin: -10,
                    suggestedMax: 10,
                    grid: {
                        color: function (context) {
                            if (context.tick.value === 0) {
                                return '#f72585ff';
                            } else {
                                return 'rgb(201, 203, 207)';
                            }
                        },
                        borderDash: function (context) {
                            if (context.tick.value === 0) {
                                return [5, 5];
                            } else {
                                return [0];
                            }
                        },
                    }
                },
                x: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    }
                }
            },
        }
    };
    const flipsChart = new Chart(
        document.getElementById('coin-flip-graph-canvas'),
        config
    );

    const totalPlayTime = 10 * 1000; // 10 seconds;

    const timeouts = [];

    document.getElementById('coin-flip-start').addEventListener('click', (event) => {
        const button = event.currentTarget;

        button.disabled = true;
        button.innerText = 'Flipping …';

        while (timeouts.length) {
            clearTimeout(timeouts.pop());
        }

        cumulativeTotals.splice(0, cumulativeTotals.length);
        labels.splice(0, labels.length);

        cumulativeTotals.push(0);
        labels.push(0);

        const numFlips = parseInt(document.querySelector("[name=number-of-flips]").value);
        const delay = Math.round(totalPlayTime / numFlips);

        let cumulativeTotal = 0;
        let i = 1;
        let maxTotal = 4;

        const flip = () => {
            //flip a coin, and either add or subtract 1
            const coinFlip = Math.round(Math.random()) === 1 ? 1 : -1;
            cumulativeTotal += coinFlip
            cumulativeTotals.push(cumulativeTotal);
            labels.push(i);
            maxTotal = Math.max(maxTotal, Math.abs(cumulativeTotal));
            flipsChart.options.scales.y.suggestedMax = maxTotal;
            flipsChart.options.scales.y.suggestedMin = -maxTotal;
            flipsChart.update();
            i++;
            if (i <= numFlips) {
                timeouts.push(setTimeout(() => { requestAnimationFrame(flip) }, delay));
            } else {
                button.disabled = false;
                button.innerText = 'Start';
            }
        };
        requestAnimationFrame(flip);
    });
})();
