function computeChartData(dataSets) {
    const labels = dataSets[0].map((_, i) => {
        return `Week ${i + 1}`;
    });

    const chartData = {
        labels: labels,
        datasets: dataSets.map((data, i) => {
            return {
                label: `Item ${i + 1}`,
                backgroundColor: indexedColor(i, Math.floor(i / 10)),
                data: data,
                order: dataSets.length - i,
            };
        })
    };

    return chartData;
}

const generateCostOfDelayChart = function (id, chartData, options) {
    options = options ? options : {};

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

function makeBacklogItem(parent, position, weeklyCost) {
    // position => index starting at zero

    const template = document.getElementById("backlog-item-template");
    const itemElem = template.content.firstElementChild.cloneNode(true);

    const title = `Item ${position + 1}`;
    const waitTime = `Waits: <nobr>${position} wk${position === 1 ? "" : "s"}</nobr>`;
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

function displayBacklogSummary(cumulativeCosts, weeklyCost) {
    const totalCost = cumulativeCosts.at(-1).reduce((total, next) => {
        return total + next;
    }, 0);
    const nextItemCost = cumulativeCosts.at(-1).at(-1) + weeklyCost;

    const elem = document.querySelector(".backlog-summary");
    const summaryLine = `Total cost of delay: ${formatCost(totalCost)}`;
    const nextItemNote = `Another item would add ${formatCost(nextItemCost)} to the total cost of delay.`

    elem.querySelector(".summary-line").textContent = summaryLine;
    elem.querySelector(".next-item-note").textContent = nextItemNote;
}

(function() {

    const itemsInput = document.querySelector("[name=items-in-backlog]");
    const weeklyCostInput = document.querySelector("[name=weekly-value-of-items]");

    const perWeekChart = generateCostOfDelayChart('cost-of-delay-chart',
        [[]], {
        barPercentage: 1.3,
        title: "Cost of delay incurred per week",
    });

    const cumulativeChart = generateCostOfDelayChart('cost-of-delay-cumulative-chart',
        [[]], {
        title: "Cumulative cost of delay each week",
    });

    function renderBacklog() {
        const items = parseInt(itemsInput.value);
        const weeklyCost = parseInt(weeklyCostInput.value);

        const costsPerWeek = computeCostsPerWeek(items, weeklyCost);
        const cumulativeCosts = costsPerWeek.map(computeCumulativeCosts);

        const backlogElem = document.querySelector(".backlog-items");
        backlogElem.innerHTML = "";

        for (let i = 0; i < items; i++) {
            makeBacklogItem(backlogElem, i, weeklyCost);
        }

        displayBacklogSummary(cumulativeCosts, weeklyCost);

        perWeekChart.data = computeChartData(costsPerWeek);
        perWeekChart.update();

        cumulativeChart.data = computeChartData(cumulativeCosts);
        cumulativeChart.update();
    }

    renderBacklog();

    [itemsInput, weeklyCostInput].forEach(elem => {
        elem.addEventListener("change", renderBacklog);
    });

})();
