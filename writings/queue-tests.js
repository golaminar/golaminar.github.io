// Node requires variables to be defined before referencing them
// even if those functions are never called.

let document = {
    querySelector: function () {
        return false;
    },
    getElementById: function () {
        return this;
    },
    appendChild: function () {
        return this;
    },
    content: {
        cloneNode: function () {
            return this;
        },
        firstElementChild: {
            cloneNode: function() {
                return this;
            },
        },
    },
};

let d3 = {
    select: function () {
        return this;
    },
    selectAll: function () {
        return this;
    },
    data: function () {
        return this;
    },
    enter: function () {
        return this;
    },
    append: function () {
        return this;
    },
    text: function () {
        return this;
    },
    attr: function () {
        return this;
    },
    style: function () {
        return this;
    },
    remove: function () {
        return this;
    },
};

let Chart = function () {
    return {
        update: function () {
            return this;
        },
    };
}
function genRandomTime(avgTime) {
    // generate a random number of seconds between 0 and infinity,
    // where avgTime is the most likely value
    // following a Poisson process

    return (-Math.log(1 - Math.random())) * avgTime;
}

function generateArrivalTimes(expectedArrivalInterval, totalTime) {
    let arrivalTimes = [];
    let nextArrivalInterval = genRandomTime(expectedArrivalInterval);
    let accumulatedTime = nextArrivalInterval;

    while (accumulatedTime <= totalTime) {
        arrivalTimes.push(nextArrivalInterval);
        nextArrivalInterval = genRandomTime(expectedArrivalInterval);
        accumulatedTime += nextArrivalInterval;
    }

    return arrivalTimes;
}

function generateServiceTimes(expectedServiceTime, numberOfArrivals) {
    let serviceTimes = [];

    while (serviceTimes.length < numberOfArrivals) {
        serviceTimes.push(genRandomTime(expectedServiceTime));
    }

    return serviceTimes;
}

function computeCumulativeArrivalTimes(arrivalTimes) {
    return arrivalTimes.reduce((accumulator, arrivalTime) => {
        accumulator.push((accumulator.length ? accumulator.at(-1) : 0) + arrivalTime);
        return accumulator;
    }, []);
}

function computeServiceBehaviour(serviceTimes, cumulativeArrivalTimes) {
    const serviceBehaviour = serviceTimes.reduce((accumulator, serviceTime, index) => {

        // endsAt of the previous entry
        const readyAt = accumulator.length ? accumulator.at(-1).endsAt : 0;

        // always zero at the start –> server is ready before anyone arrives
        // for the rest:
        // =vlookup(max(filter(D:D, D:D < K3)), D:E, 2)-I2
        // ==> (people who have arrived until now) minus (people served until now)
        // D:D => cumulativeArrivalTimes
        // I2 => the amount of people served previously
        //       which is always exactly equal to the value of this `index`
        // K3 => this readyAt value
        // max(filter(D:D, D:D < K3))
        //    => arrival time of the last person who arrived when the server became ready
        // vlookup(max(filter(D:D, D:D < K3)), D:E, 2)
        //    => arrival order of the last person who arrived before the server became ready
        //       i.e. how many people have arrived up until this moment

        // Alterative formula that works
        // =count(filter(D:D, D:D < K3))-I2
        // count(filter(D:D, D:D < K3))
        //    => count of the arrivals before this readyAt value

        // TO DO:
        // Consider whether this should this be changed to “ByReadyAt”
        // i.e. cumulativeArrivalTime <= readyAt?
        // Write a test and then adjust.
        const arrivalsBeforeReadyAt = cumulativeArrivalTimes.filter((cumulativeArrivalTime) => {
            return cumulativeArrivalTime < readyAt;
        }).length;

        const peopleServedBeforeReadyAt = index;

        const queueSizeWhenReady = index ? (arrivalsBeforeReadyAt - peopleServedBeforeReadyAt) : 0;

        // =if (N3 > 0, K3 + J3, D3 + J3)
        // N3 => this queueSizeWhenReady value
        // K3 => this readyAt value
        // J3 => this serviceTime value
        // D3 => the cumulativeArrivalTime at the same index value
        //       i.e. the arrival time of the person who will be serviced
        const endsAt = queueSizeWhenReady > 0 ?
            readyAt + serviceTime :
            cumulativeArrivalTimes[index] + serviceTime;

        // The time that this queuer waited before being served
        // i.e. how long after they arrived before the server was ready.
        // The cumulativeArrivalTime at the same index value
        // is when the person who was served arrived.
        // Wait time can’t be negative, but the server can be ready
        // immediately, such that there is no wait.
        const waitTime = Math.max(readyAt - cumulativeArrivalTimes[index], 0);

        accumulator.push({
            "serviceTime": serviceTime,
            "readyAt": readyAt, // Redundant?
            "endsAt": endsAt,
            "queueSizeWhenReady": queueSizeWhenReady,
            "waitTime": waitTime,
        });

        return accumulator;
    }, []);

    return serviceBehaviour;
}

function computeQueueEvents(cumulativeArrivalTimes, serviceBehaviour) {
    const events = [];

    cumulativeArrivalTimes.forEach(time => {
        const event = {
            timestamp: time,
            type: "arrival",
        }
        events.push(event);
    });

    serviceBehaviour.reduce((avgWaitTime, behaviour, index) => {

        avgWaitTime = (behaviour.waitTime + avgWaitTime * index) / (index + 1);

        const event = {
            timestamp: behaviour.endsAt,
            type: "service",
            waitTime: behaviour.waitTime,
            avgWaitTime: avgWaitTime,
        }
        events.push(event);

        return avgWaitTime;
    }, 0);

    events.sort((a, b) => {
        if (a.timestamp === b.timestamp) {
            // order service times after arrival times
            return a.type === "service" ? 1 : -1;
        } else {
            // put the events in chronological order
            return a.timestamp > b.timestamp ? 1 : -1;
        }
    });

    let queueLength = 0;

    return events.map((event) => {
        event.queueLength = event.type === "arrival" ? ++queueLength : --queueLength;
        return event;
    });
}
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

function indexedColor(index, schemeIndex) {
    let scheme;

    const pinkToBlue = [
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

    const colors = [
        [
            // https://coolors.co/palette/310055-3c0663-4a0a77-5a108f-6818a5-8b2fc9-ab51e3-bd68ee-d283ff-dc97ff
            /*--russian-violet*/ "#310055ff",
            /*--persian-indigo*/ "#3c0663ff",
            /*--indigo*/ "#4a0a77ff",
            /*--blue-violet-color-wheel*/ "#5a108fff",
            /*--purple*/ "#6818a5ff",
            /*--dark-orchid*/ "#8b2fc9ff",
            /*--medium-orchid*/ "#ab51e3ff",
            /*--medium-orchid-2*/ "#bd68eeff",
            /*--heliotrope*/ "#d283ffff",
            /*--bright-lilac*/ "#dc97ffff",

        ], [
            // https://coolors.co/palette/641220-6e1423-85182a-a11d33-a71e34-b21e35-bd1f36-c71f37-da1e37-e01e37
            /*--persian-plum*/ "#641220ff",
            /*--burgundy*/ "#6e1423ff",
            /*--antique-ruby*/ "#85182aff",
            /*--crimson-ua*/ "#a11d33ff",
            /*--crimson-ua-2*/ "#a71e34ff",
            /*--red-ncs*/ "#b21e35ff",
            /*--cardinal*/ "#bd1f36ff",
            /*--cardinal-2*/ "#c71f37ff",
            /*--crimson*/ "#da1e37ff",
            /*--rose-madder*/ "#e01e37ff",
        ], [
            //https://coolors.co/palette/03045e-023e8a-0077b6-0096c7-00b4d8-48cae4-90e0ef-a6e6f2-b8ebf5-c6eff7
            /*--midnight-blue*/ "#03045eff",
            /*--dark-cornflower-blue*/ "#023e8aff",
            /*--star-command-blue*/ "#0077b6ff",
            /*--blue-green*/ "#0096c7ff",
            /*--pacific-blue*/ "#00b4d8ff",
            /*--sky-blue-crayola*/ "#48cae4ff",
            /*--middle-blue*/ "#90e0efff",
            /*--blizzard-blue*/ "#a6e6f2ff",
            /*--blizzard-blue-2*/ "#b8ebf5ff",
            /*--powder-blue*/ "#c6eff7ff",
        ], [
            // https://coolors.co/palette/ffedd8-f3d5b5-e7bc91-d4a276-bc8a5f-a47148-8b5e34-6f4518-603808-583101
            /*--antique-white*/ "#ffedd8ff",
            /*--peach-puff*/ "#f3d5b5ff",
            /*--gold-crayola*/ "#e7bc91ff",
            /*--tan-crayola*/ "#d4a276ff",
            /*--camel*/ "#bc8a5fff",
            /*--cafe-au-lait*/ "#a47148ff",
            /*--coyote-brown*/ "#8b5e34ff",
            /*--sepia*/ "#6f4518ff",
            /*--pullman-brown-ups-brown*/ "#603808ff",
            /*--pullman-brown-ups-brown-2*/ "#583101ff",
        ], [
            // https://coolors.co/palette/ff7b00-ff8800-ff9500-ffa200-ffaa00-ffb700-ffc300-ffd000-ffdd00-ffea00
            /*--heat-wave*/ "#ff7b00ff",
            /*--dark-orange*/ "#ff8800ff",
            /*--yellow-orange-color-wheel*/ "#ff9500ff",
            /*--orange-peel*/ "#ffa200ff",
            /*--chrome-yellow*/ "#ffaa00ff",
            /*--selective-yellow*/ "#ffb700ff",
            /*--mikado-yellow*/ "#ffc300ff",
            /*--cyber-yellow*/ "#ffd000ff",
            /*--golden-yellow*/ "#ffdd00ff",
            /*--middle-yellow*/ "#ffea00ff",
        ],
    ];

    if (schemeIndex === undefined) {
        scheme = pinkToBlue;
    } else {
        scheme = colors[schemeIndex % colors.length];
    }

    return scheme[index % scheme.length];
}

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
        backgroundColor: indexedColor(5, index),
        borderColor: indexedColor(5, index),
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
const { isDeepEqual } = require("./test-helpers");

// this is the tests!!
console.log("These are the tests:\n-----------------");

(function () {

    const { arrivalTimes, serviceTimes, expectedServiceBehaviour } = require("./pre-calculated-intervals");

    const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
    const serviceBehaviour = computeServiceBehaviour(serviceTimes, cumulativeArrivalTimes);

    console.log("correctly computes service behaviour", isDeepEqual(serviceBehaviour, expectedServiceBehaviour));
})();

(function () {
    const arrivalTimes = [10, 11, 15, 8, 6, 14];
    const serviceTimes = [11, 8, 16, 20, 12, 5];

    const expectedQueueEvents = [
        { timestamp: 10, type: 'arrival', queueLength: 1 },
        { timestamp: 21, type: 'arrival', queueLength: 2 },
        { timestamp: 21, type: 'service', waitTime: 0, avgWaitTime: 0, queueLength: 1 },
        { timestamp: 29, type: 'service', waitTime: 0, avgWaitTime: 0, queueLength: 0 },
        { timestamp: 36, type: 'arrival', queueLength: 1 },
        { timestamp: 44, type: 'arrival', queueLength: 2 },
        { timestamp: 50, type: 'arrival', queueLength: 3 },
        { timestamp: 52, type: 'service', waitTime: 0, avgWaitTime: 0, queueLength: 2 },
        { timestamp: 64, type: 'arrival', queueLength: 3 },
        { timestamp: 72, type: 'service', waitTime: 8, avgWaitTime: 2, queueLength: 2 },
        { timestamp: 84, type: 'service', waitTime: 22, avgWaitTime: 6, queueLength: 1 },
        { timestamp: 89, type: 'service', waitTime: 20, avgWaitTime: 8.333333333333334, queueLength: 0 }
    ]

    const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
    const serviceBehaviour = computeServiceBehaviour(serviceTimes, cumulativeArrivalTimes);

    const queueEvents = computeQueueEvents(cumulativeArrivalTimes, serviceBehaviour);

    console.log("ordered queue events are properly computed", isDeepEqual(queueEvents, expectedQueueEvents));
})();
