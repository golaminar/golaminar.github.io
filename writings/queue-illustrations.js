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
        .attr("style", `color: ${queueDataset.borderColor}` );

    const queueObservable = {
        observers: [],
        queue: [],
        count: 0,
        addObserver: function (observer) {
            this.observers.push(observer);
        },
        notifyObservers: function (change, queuer) {
            this.observers.forEach(observer => {
                if (change === "newArrival" && observer.newArrival) {
                    observer.newArrival(queuer);
                }
                if (change === "newServiceTime" && observer.newServiceTime) {
                    observer.newServiceTime(queuer);
                }
            });
        },
        addQueuer: function () {
            this.count++;
            const queuer = {
                order: this.count,
                color: indexedColor(this.count, simIndex),
            };
            this.queue.push(queuer);
            this.notifyObservers("newArrival", queuer);
        },
        removeQueuer: function () {
            const queuer = this.queue.shift();
            this.notifyObservers("newServiceTime", queuer);
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

    ///////////////////////

    function updateQueueUI(events) {
        events.forEach(event => {
            if (event.type === "arrival") {
                queueObservable.addQueuer();
            } else {
                queueObservable.removeQueuer();
            }
        });
    }

    function updateChart(events) {
        events.forEach((event) => {
            const point = {
                x: event.timestamp,
                y: event.queueLength,
            };
            queueDataset.data.push(point);
        });

        queueLengthsChart.update();
    }

    function updateQueueLengthDisplay(queueLength) {
        d3.select(parentElem).select(".queue-length")
            .text(() => { return queueLength; });
    }

    function updateWaitTime(tickWindow, queueEvents) {
        const waitTimes = queueEvents.filter((event) => {
            return !(event.waitTime === undefined) && event.tickWindow <= tickWindow;
        }).map(event => {
            return event.waitTime;
        });

        d3.select(parentElem).select(".avg-wait-time")
            .text(waitTimes.length ? Math.round(d3.mean(waitTimes)) : "–");
    }

    function resetChart() {
        queueDataset.data.splice(0, queueDataset.data.length);
        queueDataset.data.push({ x: 0, y: 0 });
        queueLengthsChart.update();
    }

    function resetSimulation() {
        queueObservable.reset();
        resetChart();
        updateQueueLengthDisplay(0, []);
        updateWaitTime(0, []);
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

        // Could optimal illustrative values be computed,
        // such as from the above parameters?
        const tickDuration = expectedArrivalInterval * 3;
        const numberOfTicks = 240;
        const scalingFactor = expectedArrivalInterval / 12;

        const arrivalTimes = generateArrivalTimes(expectedArrivalInterval, tickDuration, numberOfTicks);
        const serviceTimes = generateServiceTimes(expectedServiceTime, arrivalTimes.length);

        const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
        const { serviceBehaviour } = computeServiceEndTimes(serviceTimes, cumulativeArrivalTimes);

        const queueEvents = computeQueueEvents(cumulativeArrivalTimes, serviceBehaviour, tickDuration);

        let tickIndex = 0;
        let animationStart;
        let elapsedTime;

        let queueEventsThisTick = [];

        function animateQueue(timestamp) {
            const tickTime = (tickIndex + 1) * tickDuration;

            if (animationStart === undefined) {
                // anchor the start of the animation in time
                animationStart = timestamp;

                // announce the start of the animation
                console.log("started at:", animationStart);
            }

            // compute how much time has elapsed
            elapsedTime = (timestamp - animationStart) * scalingFactor;

            if (elapsedTime < tickTime) {
                // keep on waiting
                requestAnimationFrame(animateQueue);
            } else {
                queueEventsThisTick = queueEvents.filter((event) => {
                    return event.tickWindow === tickTime;
                });

                if (queueEventsThisTick.length) {
                    // animate what happened
                    updateQueueUI(queueEventsThisTick);

                    // update the chart in batches
                    updateChart(queueEventsThisTick);

                    // update the average wait time display
                    updateWaitTime(tickTime, queueEvents);

                    // update the queue length once per tick
                    updateQueueLengthDisplay(queueEventsThisTick.at(-1).queueLength);
                }


                // advance to the next frame, if it exists
                tickIndex++;

                if (tickIndex < numberOfTicks) {
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
