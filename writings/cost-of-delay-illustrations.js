const generateCostOfDelayChart = function (id, dataSets, options) {
    options = options ? options : {};
    const labels = dataSets[0].map((_, i) => {
        return `Week ${i + 1}`;
    });

    const chartData = {
        labels: labels,
        datasets: dataSets.map ((data, i) => {
            return {
                label: `Item ${i + 1}`,
                backgroundColor: indexedColor(i, 2),
                data: data,
                order: dataSets.length - i,
            };
        })
    };

    const config = {
        type: 'bar',
        data: chartData,
        options: {
            barPercentage: options.barPercentage,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    suggestedMin: 0,
                    suggestedMax: 2500,
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: options.title,
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';

                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    },
                },
            },
        },
    };

    new Chart(document.getElementById(id), config);
};

function cumulativeCosts(data) {
    return data.reduce((ary, val) => {
        //data = [500, 500, 0, 0] => ary = [500, 1000, 1000, 1000]
        ary.push(val + (ary.length ? ary.at(-1) : 0));
        return ary;
    }, []);
}

function computeCostsPerWeek(items, costPerWeek) {
    const costs = [];
    const weeks = items - 1;

    for (let item = 0; item < items; item++) {
        costs.push([]);
        for (let week = 0; week < weeks; week++) {
            let waiting = week < item;
            costs[item].push(waiting ? costPerWeek : 0);
        }
    }

    return costs;
}

(function() {
    [].forEach.call(document.querySelectorAll(".backlog-item"), function (div, i) {
        div.style.backgroundColor = indexedColor(i, 2);
        div.style.color = "white";
        div.style.borderColor = indexedColor(i, 2);
    });

    const costsPerWeek = computeCostsPerWeek(5, 2000);

    generateCostOfDelayChart('cost-of-delay-chart',
        costsPerWeek, {
        barPercentage: 1.3,
        title: "Cost of delay incurred per week",
    });

    generateCostOfDelayChart('cost-of-delay-cumulative-chart',
        costsPerWeek.map(cumulativeCosts), {
         title: "Cumulative cost of delay each week",
        });
})();
