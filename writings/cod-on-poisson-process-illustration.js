function queueSimulation(simIndex, queueDataset, figure) {

    const template = document.getElementById("queue-simulation-template");
    const parentElem = document.getElementById("queue-simulations")
        .appendChild(template.content.firstElementChild.cloneNode(true));

    d3.select(parentElem).select(".queue-status th")
        .attr("style", `color: ${queueDataset.borderColor}`);

    const queueObservable = {
        observers: [],
        queue: [],
        count: 0,
        addObserver: function (observer) {
            this.observers.push(observer);
        },
        notifyObservers: function (change, queuer, event) {
            this.observers.forEach(observer => {
                if (change === "newArrival" && observer.newArrival) {
                    observer.newArrival(queuer, event);
                }
                if (change === "newServiceTime" && observer.newServiceTime) {
                    observer.newServiceTime(queuer, event);
                }
            });
        },
        addQueuer: function (event) {
            this.count++;
            const queuer = {
                order: this.count,
                color: indexedColor(this.count, simIndex),
            };
            this.queue.push(queuer);
            this.notifyObservers("newArrival", queuer, event);
        },
        removeQueuer: function (event) {
            const queuer = this.queue.shift();
            this.notifyObservers("newServiceTime", queuer, event);
        },
        reset: function () {
            this.count = 0;
            while (this.queue.length) {
                this.removeQueuer();
            }
        }
    };

    const queueList = {
        newArrival: function (queuer) {
            d3.select(parentElem).select(".queue")
                .append("li")
                .attr("class", `queuer_${queuer.order}`)
                .text(queuer.order)
                .style("background-color", queuer.color);
        },
        newServiceTime: function (queuer) {
            d3.select(parentElem).select(`.queuer_${queuer.order}`)
                .remove();
        },
    }

    queueObservable.addObserver(queueList);

    const queueLengthDisplay = {
        updateDisplay: function (event) {
            d3.select(parentElem).select(".queue-length")
                .text(() => {
                    return event === undefined ? 0 : event.queueLength;
                });
        },
        newArrival: function (_, event) {
            this.updateDisplay(event);
        },
        newServiceTime: function (_, event) {
            this.updateDisplay(event);
        },
    }

    queueObservable.addObserver(queueLengthDisplay);

    const avgWaitTimeDisplay = {
        newServiceTime: function (_, event) {
            d3.select(parentElem).select(".avg-wait-time")
                .text(() => {
                    // show is days, rounded to one digit
                    return event === undefined ? "–" : Math.round(event.avgWaitTime * 7 * 10)/10;
                });
        },
    }

    queueObservable.addObserver(avgWaitTimeDisplay);

    function updateQueueUI(events) {
        events.forEach(event => {
            if (event.type === "arrival") {
                queueObservable.addQueuer(event);
            } else {
                queueObservable.removeQueuer(event);
            }
        });
    }

    function pushEventsToChart(events) {
        events.forEach((event) => {
            const point = {
                x: event.timestamp,
                y: event.queueLength,
            };
            queueDataset.data.push(point);
        });
    }

    function initCostOfDelayChart() {
        poissonCostsChartData.labels = [];
        poissonCostsChartData.datasets = [
            {
                label: "Development Costs",
                data: [],
                type: 'line',
                backgroundColor: "#999",
                order: 0,
                elements: {
                    point: {
                        radius: 2,
                    },
                },
            }
        ];
        costOfDelayChart.update();
    }

    function shiftFillArray(arr) {
        arr.push(arr.at(-1));
    }

    function updateCumulativeCostOfDelayDataset(dataset, serviceTime) {
        const weekyCost = parseInt(figure.querySelector("[name=weekly-dev-cost]").value);
        const cumulativeCost = dataset.data.at(-1) || 0;
        dataset.data.push(cumulativeCost + weekyCost * serviceTime);
    }

    function updateCumulativeCostOfDelayChart(events) {
        const cost = parseInt(figure.querySelector("[name=weekly-value-of-items]").value);
        const devCostsDataset = poissonCostsChartData.datasets.pop();

        events.forEach((event) => {
            const index = poissonCostsChartData.datasets.length;

            if (event.type === "arrival") {
                const costOfDelay = event.waitTime * cost;

                poissonCostsChartData.labels.push(`Release: ${index}`);
                const dataset = {
                    label: `Item ${index + 1}`,
                    backgroundColor: (indexedColor(index, 4)),
                    data: [],
                    order: index + 1,
                };

                for (let i = 0; i < index; i++) {
                    shiftFillArray(poissonCostsChartData.datasets[i].data)
                    dataset.data.push(0);
                }

                dataset.data.push(costOfDelay);
                poissonCostsChartData.datasets.push(dataset);

                updateCumulativeCostOfDelayDataset(devCostsDataset, event.serviceTime);
            }

        });

        poissonCostsChartData.datasets.push(devCostsDataset);
        costOfDelayChart.update();
    }

    function advanceChartElapsedTime(elapsedTime) {
        queueLengthsChart.options.scales.x.max = Math.floor(elapsedTime);
        queueLengthsChart.update();
    }

    function resetChart() {
        queueDataset.data.splice(0, queueDataset.data.length);
        queueDataset.data.push({ x: 0, y: 0 });
        queueLengthsChart.update();
    }

    function resetSimulation() {
        queueObservable.reset();
        resetChart();
    }

    function diableStartButton(startButton) {
        startButton.innerText = "Running …";
        startButton.disabled = true;
    }

    function reengageStartButton(startButton) {
        startButton.innerText = "Run again";
        startButton.disabled = false;
    }

    function playbackQueueBahaviour(event) {
        const startButton = event.srcElement;
        diableStartButton(startButton);
        resetSimulation();

        const expectedArrivals = parseInt(document.querySelector("[name=arrivals-per-cycle]").value);
        const expectedArrivalInterval = 1 / expectedArrivals;

        const expectedCompleted = parseInt(document.querySelector("[name=completed-per-cycle]").value);
        const expectedServiceTime = 1 / expectedCompleted;

        const tickDuration = 1 / 6;
        const scalingFactor = 0.005;
        const totalTime = 12;

        const arrivalTimes = generateArrivalTimes(expectedArrivalInterval, totalTime);
        const serviceTimes = generateServiceTimes(expectedServiceTime, arrivalTimes.length);

        const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
        const serviceBehaviour = computeServiceBehaviour(serviceTimes, cumulativeArrivalTimes);

        const queueEvents = computeQueueEvents(cumulativeArrivalTimes, serviceBehaviour);

        pushEventsToChart(queueEvents);
        advanceChartElapsedTime(0);
        initCostOfDelayChart();

        let tickStart = 0;
        let tickEnd;

        let animationStart;
        let elapsedTime;

        let queueEventsThisTick = [];

        function animateQueue(timestamp) {
            tickEnd = tickStart + tickDuration;

            if (animationStart === undefined) {
                // anchor the start of the animation in time
                animationStart = timestamp;

                // announce the start of the animation
                console.log("started at:", animationStart);
            }

            // compute how much time has elapsed
            elapsedTime = (timestamp - animationStart) * scalingFactor;

            if (elapsedTime < tickEnd) {
                // keep on waiting
                requestAnimationFrame(animateQueue);
            } else {
                queueEventsThisTick = queueEvents.filter((event) => {
                    return event.timestamp > tickStart && event.timestamp <= tickEnd;
                });

                // animate what happened
                updateQueueUI(queueEventsThisTick);

                // advance the elapsed time shown on the chart to tickEnd
                advanceChartElapsedTime(tickEnd);

                // show the next batch of items on the cost of delay chart
                updateCumulativeCostOfDelayChart(queueEventsThisTick)

                if (tickEnd < totalTime) {
                    // advance to the next frame in time
                    tickStart = tickEnd;
                    requestAnimationFrame(animateQueue);
                } else {
                    // announce the end of the animation
                    console.log("ended at:", timestamp);
                    console.log("unscaled elapsed time", timestamp - animationStart);
                    reengageStartButton(startButton);
                }
            }
        }

        // kick off the animation
        requestAnimationFrame(animateQueue);
    }

    if (figure && figure.querySelector(".playback-queue-behaviour")) {
        figure.querySelector(".playback-queue-behaviour").addEventListener("click", playbackQueueBahaviour);
    }
}

function createQueueDataset(index) {
    return {
        label: `Queue length`,
        data: [{ x: 0, y: 0 }],
        backgroundColor: indexedColor(4, index),
        borderColor: indexedColor(4, index),
        showLine: true,
    };
}

const queueLengthsDatasets = [];

const queueLengthsChartConfig = {
    type: 'scatter',
    data: {
        datasets: queueLengthsDatasets,
    },
    options: {
        aspectRatio: 1.5,
        scales: {
            x: {
                type: 'linear',
                suggestedMin: 0,
                suggestedMax: 12,
                title: {
                    display: true,
                    text: "Elapsed Weeks",
                },
                ticks: {
                    display: true,
                    stepSize: 1,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                suggestedMin: 0,
                suggestedMax: 20,
            },
        },
        animation: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Items in backlog",
            },
        },
        elements: {
            point: {
                pointRadius: 0,
            },
            line: {
                stepped: true,
                borderWidth: 2,
            },
        }
    }
};

const poissonCostsChartData = {
    labels: [],
    datasets: [],
};

const poissonCostOfDelayChartConfig = {
    type: 'bar',
    data: poissonCostsChartData,
    options: {
        animation: false,
        aspectRatio: 1.5,
        barPercentage: 1.3,
        scales: {
            x: {
                stacked: true,
                suggestedMin: 0,
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
                title: {
                    display: true,
                    text: "Time",
                },
            },
            y: {
                stacked: true,
                suggestedMin: 0,
                suggestedMax: 500,
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Cumulative cost of delay",
            },
            tooltip: {
                enabled: false,
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
        elements: {
            line: {
                borderWidth: 2,
            },
        },
    },
};

const queueLengthsChart = new Chart(
    document.getElementById('queue-lengths-graph-canvas'),
    queueLengthsChartConfig
);

const costOfDelayChart = new Chart(
    document.getElementById("poisson-cost-of-delay-chart"),
    poissonCostOfDelayChartConfig
);

(function () {
    const figure = document.querySelector("#figure-cod-on-poisson-process");
    const queueDataset = createQueueDataset(4);
    queueLengthsDatasets.push(queueDataset);
    queueLengthsChart.update();
    queueSimulation(4, queueDataset, figure);
})();
