function computeCostofDelayChartData(dataPerWeek) {
    const firstWeekData = dataPerWeek[0] || [];

    const labels = firstWeekData.map((_, i) => {
        return `Week ${i + 1}`;
    });

    const datasets = dataPerWeek.map((data, i) => {
        return {
            label: `Item ${i + 1}`,
            backgroundColor: indexedColor(i, Math.floor(i / 10)),
            data: data,
            order: dataPerWeek.length - i,
        };
    });

    const chartData = {
        labels: labels,
        datasets: datasets,
    };

    return chartData;
}

const generateCostOfDelayChart = function (id, chartData, options) {
    options = options ? options : {};

    const config = {
        type: 'bar',
        data: chartData,
        options: {
            animation: false,
            aspectRatio: 1.5,
            barPercentage: options.barPercentage,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    suggestedMin: 0,
                    suggestedMax: 1000,
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
                                label += formatCost(context.parsed.y);
                            }
                            return label;
                        }
                    },
                },
            },
        },
    };

    return new Chart(document.getElementById(id), config);
};

function formatCost(cost) {
    return new Intl.NumberFormat( "en-GB",
        {
            style: "currency",
            currency: "EUR",
            maximumSignificantDigits: 6,
        }).format(cost);
}

function computeCumulativeCosts(data) {
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

function populateBacklog(figure, items, weeklyCost) {
    const backlogElem = figure.querySelector(".backlog-items");
    backlogElem.innerHTML = "";

    for (let i = 0; i < items; i++) {
        makeBacklogItem(backlogElem, i, weeklyCost);
    }

    if (items === 0) {
        const template = document.getElementById("backlog-item-template");
        const elem = template.content.firstElementChild.cloneNode(true);
        elem.innerHTML = "<span><i>The backlog is empty</i></span>";
        backlogElem.appendChild(elem);
    }
}

function makeBacklogItem(parent, position, weeklyCost) {
    // position => index starting at zero

    const template = document.getElementById("backlog-item-template");
    const itemElem = template.content.firstElementChild.cloneNode(true);

    const title = `Item ${position + 1}`;
    const waitTime = `Waits: <nobr>${position} week${position === 1 ? "" : "s"}</nobr>`;
    const costOfDelay = `Cost of delay: ${formatCost(position * weeklyCost)}`;

    itemElem.style.backgroundColor = indexedColor(position, Math.floor(position / 10));
    itemElem.style.borderColor = indexedColor(position, Math.floor(position / 10));

    if ((position % 10) < 5) {
        itemElem.style.color = "white";
    }

    itemElem.querySelector(".title").textContent = title;
    itemElem.querySelector(".wait-time").innerHTML = waitTime;
    itemElem.querySelector(".cost-of-delay").textContent = costOfDelay;

    parent.appendChild(itemElem);
}

function displayBacklogSummary(figure, cumulativeCosts, weeklyCost) {
    const finalWeekCosts = cumulativeCosts.at(-1) || [];

    const totalCost = finalWeekCosts.reduce((total, next) => {
        return total + next;
    }, 0);

    const nextItemCost = cumulativeCosts.length === 0
                ? 0 // i.e. next item is the first item
                : (finalWeekCosts.at(-1) || 0) + weeklyCost;

    const elem = figure.querySelector(".backlog-summary");
    const summaryLine = `Total cost of delay: ${formatCost(totalCost)}`;
    const nextItemNote = `Another item would add ${formatCost(nextItemCost)} to the total cost of delay.`

    elem.querySelector(".summary-line").textContent = summaryLine;
    elem.querySelector(".next-item-note").textContent = nextItemNote;
}

function computeWeeklyDevCosts(items, weeklyDevCost) {
    const costs = [];
    for (let i = 0; i < items; i++) {
        costs.push(weeklyDevCost);
    }
    return costs;
}

function generateDevCostsDataset(data) {
    return {
        label: "Development Costs",
        data: data,
        type: 'line',
        backgroundColor: "#999",
    };
}

(function() {

    const figure = document.querySelector("#figure-cost-of-delay");

    const itemsInput = figure.querySelector("[name=items-in-backlog]");
    const weeklyCostInput = figure.querySelector("[name=weekly-value-of-items]");
    const devCostInput = figure.querySelector("[name=weekly-dev-cost]");

    const perWeekChart = generateCostOfDelayChart('cost-of-delay-chart',
        [[]], {
        barPercentage: 1.3,
        title: "Cost of delay incurred per week",
    });

    const cumulativeChart = generateCostOfDelayChart('cost-of-delay-cumulative-chart',
        [[]], {
        title: "Cumulative cost of delay each week",
    });

    function showDevCosts() {
        const items = parseInt(itemsInput.value);
        const weeklyCost = parseInt(devCostInput.value);
        const weeklyCosts = computeWeeklyDevCosts(items, weeklyCost)
        cumulativeChart.data.datasets.push(generateDevCostsDataset(computeCumulativeCosts(weeklyCosts)));
        cumulativeChart.update();
    }

    function renderBacklog() {
        const items = parseInt(itemsInput.value);
        const weeklyCost = parseInt(weeklyCostInput.value);

        const weeklyCosts = computeCostsPerWeek(items, weeklyCost);
        const cumulativeWeeklyCosts = weeklyCosts.map(computeCumulativeCosts);

        populateBacklog(figure, items, weeklyCost);
        displayBacklogSummary(figure, cumulativeWeeklyCosts, weeklyCost);

        perWeekChart.data = computeCostofDelayChartData(weeklyCosts);
        perWeekChart.update();

        cumulativeChart.data = computeCostofDelayChartData(cumulativeWeeklyCosts);
        cumulativeChart.update();

        showDevCosts();
    }

    renderBacklog();

    [itemsInput, weeklyCostInput, devCostInput].forEach(elem => {
        function updateDisplay(event) {
            const display = figure.querySelector(`.${event.target.name}-value`);
            const value = parseInt(event.target.value);
            const innerHTML = event.target.name === "items-in-backlog" ? value : formatCost(value);
            display.innerHTML = innerHTML;
        }

        elem.addEventListener("change", renderBacklog);
        elem.addEventListener("input", renderBacklog);

        elem.addEventListener("change", updateDisplay);
        elem.addEventListener("input", updateDisplay);
    });

})();
