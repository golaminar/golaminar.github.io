const generateCostOfDelayChart = function (id, dataSets) {
    const labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const chartData = {
        labels: labels,
        datasets: dataSets.map ((data, i) => {
            return {
                label: `Item ${i + 1}`,
                backgroundColor: indexedColor(i, 2),
                data: cumulativeCosts(data),
            };
        })
    };

    const config = {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    suggestedMin: 0,
                    suggestedMax: 5000,
                }
            },
            plugins: {
                legend: {
                    display: false,
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
    const item1Costs = [0, 0, 0, 0];
    const item2Costs = [500, 0, 0, 0];
    const item3Costs = [500, 500, 0, 0];
    const item4Costs = [500, 500, 500, 0];
    const item5Costs = [500, 500, 500, 500];

    generateCostOfDelayChart('item-1-cost-of-delay-chart', [item1Costs, [], [], [], []]);
    generateCostOfDelayChart('item-2-cost-of-delay-chart', [[], item2Costs, [], [], []]);
    generateCostOfDelayChart('item-3-cost-of-delay-chart', [[], [], item3Costs, [], []]);
    generateCostOfDelayChart('item-4-cost-of-delay-chart', [[], [], [], item4Costs, []]);
    generateCostOfDelayChart('item-5-cost-of-delay-chart', [[], [], [], [], item5Costs]);

    generateCostOfDelayChart('cost-of-delay-cumulative-chart', [item1Costs, item2Costs, item3Costs, item4Costs, item5Costs]);
})();
