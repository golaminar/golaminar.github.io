function queueSimulation(simIndex, queueDataset) {

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
                    return event === undefined ? "–" : Math.round(event.avgWaitTime);
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

    function advanceChartElapsedTime(elapsedTime) {
        queueLengthsChart.options.scales.x.max = elapsedTime;
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

        const expectedArrivalInterval = parseInt(document.querySelector("[name=expected-arrival-time-interval]").value);
        const expectedServiceTime = parseInt(document.querySelector("[name=expected-service-time]").value);

        const slowdownFactor = 1;
        const tickDuration = expectedArrivalInterval * 3 * 2 / slowdownFactor;
        const numberOfTicks = 240 / 2 * slowdownFactor;
        const scalingFactor = expectedArrivalInterval / 12 / slowdownFactor;
        const totalTime = tickDuration * numberOfTicks / slowdownFactor;

        const arrivalTimes = generateArrivalTimes(expectedArrivalInterval, totalTime);
        const serviceTimes = generateServiceTimes(expectedServiceTime, arrivalTimes.length);

        const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
        const serviceBehaviour = computeServiceBehaviour(serviceTimes, cumulativeArrivalTimes);

        const queueEvents = computeQueueEvents(cumulativeArrivalTimes, serviceBehaviour);

        let tickStart = 0;
        let tickEnd;

        let animationStart;
        let elapsedTime;

        let queueEventsThisTick = [];

        pushEventsToChart(queueEvents);
        advanceChartElapsedTime(1);

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

                // advance the elapsed time shown on the chart
                advanceChartElapsedTime(elapsedTime);

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

    if (document.querySelector("#figure-MM1-queue .playback-queue-behaviour")) {
        document.querySelector("#figure-MM1-queue .playback-queue-behaviour").addEventListener("click", playbackQueueBahaviour);
    }
}

function createQueueDataset(index) {
    return {
        label: `Queue ${index + 1}`,
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
        aspectRatio: 1,
        scales: {
            x: {
                type: 'linear',
                suggestedMin: 0,
                suggestedMax: 1,
                title: {
                    display: true,
                    text: "Elapsed time",
                },
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                suggestedMin: -5,
                suggestedMax: 15,
                title: {
                    display: true,
                    text: "Queue length",
                },
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
                },
            },
        },
        animation: false,
        plugins: {
            legend: {
                display: false,
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

const queueLengthsChart = new Chart(
    document.getElementById('queue-lengths-graph-canvas'),
    queueLengthsChartConfig
);

const numSimulations = 5;

for (let simIndex = 0; simIndex < numSimulations; simIndex++) {
    const queueDataset = createQueueDataset(simIndex);
    queueLengthsDatasets.push(queueDataset);
    queueLengthsChart.update();
    queueSimulation(simIndex, queueDataset);
}
