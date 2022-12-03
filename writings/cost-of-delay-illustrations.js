const generateCostOfDelayChart = function (id, dataSets, options) {
    options = options ? options : {};
    const labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
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
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
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

(function() {
    [].forEach.call(document.querySelectorAll(".backlog-item"), function (div, i) {
        div.style.backgroundColor = indexedColor(i, 2);
        div.style.color = "white";
        div.style.borderColor = indexedColor(i, 2);
    });

    const item1Costs = [0, 0, 0, 0];
    const item2Costs = [500, 0, 0, 0];
    const item3Costs = [500, 500, 0, 0];
    const item4Costs = [500, 500, 500, 0];
    const item5Costs = [500, 500, 500, 500];

    generateCostOfDelayChart('cost-of-delay-chart', [
        item1Costs,
        item2Costs,
        item3Costs,
        item4Costs,
        item5Costs,
    ], {
        barPercentage: 1.3,
        title: "Cost of delay incurred per week",
    });

    generateCostOfDelayChart('cost-of-delay-cumulative-chart', [
        cumulativeCosts(item1Costs),
        cumulativeCosts(item2Costs),
        cumulativeCosts(item3Costs),
        cumulativeCosts(item4Costs),
        cumulativeCosts(item5Costs),
    ], {
        title: "Cumulative cost of delay each week",
    });
})();
