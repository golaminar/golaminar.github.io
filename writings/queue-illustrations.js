function randomColor() {
    const colors = [
        /*--flickr-pink */ "#f72585ff",
        /*--byzantine */ "#b5179eff",
        /*--purple */ "#7209b7ff",
        /*--purple-2 */ "#560badff",
        /*--trypan-blue */ "#480ca8ff",
        /*--trypan-blue-2 */ "#3a0ca3ff",
        /*--persian-blue */ "#3f37c9ff",
        /*--ultramarine-blue */ "#4361eeff",
        /*--dodger-blue */ "#4895efff",
        /*--vivid-sky-blue */ "#4cc9f0ff",
    ];

    const i = Math.floor(Math.random() * colors.length);
    return colors[i];
}

function indexedColor(index) {
    const colors = [
        /*--flickr-pink */ "#f72585ff",
        /*--byzantine */ "#b5179eff",
        /*--purple */ "#7209b7ff",
        /*--purple-2 */ "#560badff",
        /*--trypan-blue */ "#480ca8ff",
        /*--trypan-blue-2 */ "#3a0ca3ff",
        /*--persian-blue */ "#3f37c9ff",
        /*--ultramarine-blue */ "#4361eeff",
        /*--dodger-blue */ "#4895efff",
        /*--vivid-sky-blue */ "#4cc9f0ff",
    ];

    return colors[index % colors.length];
}

function queueSimulation(index, queueDataset) {

    const primarySimulation = index === 0;

    const template = document.getElementById("queue-simulation-template");
    const parentElem = document.getElementById("queue-simulations")
        .appendChild(template.content.firstElementChild.cloneNode(true));

    d3.select(parentElem).select(".queue-status th")
        .attr("style", `color: ${queueDataset.borderColor}` );

    const queueObservable = {
        observers: [],
        queue: [],
        count: 0,
        beingServed: false,
        addObserver: function (observer) {
            this.observers.push(observer);
        },
        notifyObservers: function (change, queuer) {
            this.observers.forEach(observer => {
                if (observer.queueChanged) {
                    observer.queueChanged(this.queue);
                } else {
                    if (change === "newArrival" && observer.newArrival) {
                        observer.newArrival(queuer);
                    }
                    if (change === "newServiceTime" && observer.newServiceTime) {
                        observer.newServiceTime(queuer);
                    }
                }
            });
        },
        addQueuer: function () {
            this.count++;
            const queuer = {
                order: this.count,
                color: indexedColor(this.count),
            };
            this.queue.push(queuer);
            this.notifyObservers("newArrival", queuer);
        },
        removeQueuer: function () {
            const queuer = this.queue.shift();
            this.beingServed = false;
            this.notifyObservers("newServiceTime", queuer);
        },
        occupyServer: function () {
            this.beingServed = true;
        },
        readyToServe: function () {
            return !!this.queue.length && this.beingServed === false;
        },
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

    const displayQueueLength = {
        queueChanged: function (queue) {
            d3.select(parentElem).select(".queue-length")
                .text(() => { return queue.length; });
        }
    };

    queueObservable.addObserver(displayQueueLength);

    ///////////////////////

    function addQueuers(arrivals) {
        while (arrivals > 0) {
            queueObservable.addQueuer();
            arrivals--;
        }
    }

    function serveQueuers(served) {
        while (served > 0) {
            queueObservable.removeQueuer();
            served--;
        }
    }

    function displayElapsedTime(tickTime) {
        d3.select("#elapsed-time")
            .text(() => { return (tickTime / 60 / 60).toFixed(2); /*hours*/ });
    }

    function updateQueueUI(queueChanges) {
        addQueuers(queueChanges.arrivals);
        serveQueuers(queueChanges.served);
        if (primarySimulation) {
            displayElapsedTime(queueChanges.tickTime);
        }
    }

    function updateChart(tickWindow, queueEvents) {
        const events = queueEvents.filter((event) => {
            return event.tickWindow === tickWindow;
        });

        events.forEach((event) => {
            const point = {
                x: event.timestamp,
                y: event.queueLength,
            };
            queueDataset.data.push(point);
        });

        queueLengthsChart.update();
    }

    // function resetSimulation() {
    //     drainArrivals();
    //     drainServiceTimes();
    //     drainQueue();
    // }

    function playbackQueueBahaviour() {
        document.querySelector("#figure-MM1-queue .playback-queue-behaviour").removeEventListener("click", playbackQueueBahaviour);
        document.querySelector("#figure-MM1-queue .playback-queue-behaviour").disabled = true;

        const expectedArrivalInterval = parseInt(document.querySelector("[name=expected-arrival-time-interval]").value);
        const expectedServiceTime = parseInt(document.querySelector("[name=expected-service-time]").value);

        // Could optimal illustrative values be computed,
        // such as from the above parameters?
        const tickDuration = 360;
        const numberOfTicks = 240;

        const scalingFactor = parseInt(document.querySelector("[name=play-speed-factor]").value);

        const arrivalTimes = generateArrivalTimes(expectedArrivalInterval, tickDuration, numberOfTicks);
        const serviceTimes = generateServiceTimes(expectedServiceTime, arrivalTimes.length);

        const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
        const serviceEndTimes = computeServiceEndTimes(serviceTimes, cumulativeArrivalTimes);

        const queueChangesPerTick = computeQueueChangesPerTick(cumulativeArrivalTimes, serviceEndTimes, tickDuration);

        const queueEvents = computeQueueEvents(cumulativeArrivalTimes, serviceEndTimes, tickDuration);

        let tickIndex = 0;
        let animationStart;
        let elapsedTime;

        function animateQueue(timestamp) {
            if (animationStart === undefined) {
                // anchor the start of the animation in time
                animationStart = timestamp;

                // announce the start of the animation
                console.log("started at:", animationStart);
            }

            // compute how much time has elapsed
            elapsedTime = (timestamp - animationStart) * scalingFactor;

            if (elapsedTime < queueChangesPerTick[tickIndex].tickTime) {
                // keep on waiting
                requestAnimationFrame(animateQueue);
            } else {
                // animate what happened
                updateQueueUI(queueChangesPerTick[tickIndex]);

                // update the chart in batches
                updateChart(queueChangesPerTick[tickIndex].tickTime, queueEvents);

                // advance to the next frame, if it exists
                tickIndex++;

                if (tickIndex < queueChangesPerTick.length) {
                    requestAnimationFrame(animateQueue);
                } else {
                    // announce the end of the animation
                    console.log("ended at:", timestamp);
                    console.log("unscaled elapsed time", timestamp - animationStart);
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
        backgroundColor: indexedColor(index * 2),
        borderColor: indexedColor(index * 2),
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
        scales: {
            x: {
                type: 'linear',
                suggestedMin: 0,
                suggestedMax: 500,
                title: {
                    display: true,
                    text: "Elapsed seconds",
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
