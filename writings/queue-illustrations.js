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

const arrivalsObservable = {
    observers: [],
    arrivals: [],
    addObserver: function (observer) {
        this.observers.push(observer);
    },
    notifyObservers: function () {
        this.observers.forEach(observer => {
            observer.newArrival(this.arrivals);
        });
    },
    addArrival: function (interval) {
        this.arrivals.push(interval);
        this.notifyObservers();
    },
    nextArrivalIndex() {
        return this.arrivals.length;
    },
};

const serviceTimesObservable = {
    observers: [],
    serviceTimes: [],
    addObserver: function (observer) {
        this.observers.push(observer);
    },
    notifyObservers: function () {
        this.observers.forEach(observer => {
            observer.newServiceTime(this.serviceTimes);
        });
    },
    addServiceTime: function (interval) {
        this.serviceTimes.push(interval);
        this.notifyObservers();
    },
    nextServedIndex() {
        return this.serviceTimes.length;
    },
};

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

const arrivalTimesList = {
    newArrival: function (arrivals) {
        d3.select("#arrival-time-intervals")
            .selectAll("li")
            .data(arrivals)
            .enter().append("li")
            .text(d => { return Math.round(d); });
    }
};

arrivalsObservable.addObserver(arrivalTimesList);

const arrivalAverageDisplay = {
    newArrival: function (arrivals) {
        d3.select("#avg-arrival-time-interval")
            .text(() => { return d3.mean(arrivals).toFixed(2); });
    }
};

arrivalsObservable.addObserver(arrivalAverageDisplay);

const enqueueArrival = {
    newArrival: function (arrivals) {
        queueObservable.addQueuer();
    }
}

arrivalsObservable.addObserver(enqueueArrival);

const serviceTimeAverageDisplay = {
    newServiceTime: function (serviceTimes) {
        d3.select("#avg-service-time")
            .text(() => { return d3.mean(serviceTimes).toFixed(2); });
    }
};

serviceTimesObservable.addObserver(serviceTimeAverageDisplay);

const serviceTimesList = {
    newServiceTime: function (serviceTimes) {
        d3.select("#service-times")
            .selectAll("li")
            .data(serviceTimes)
            .enter().append("li")
            .text(d => { return Math.round(d); });
    }
};

serviceTimesObservable.addObserver(serviceTimesList);

const queueList = {
    newArrival: function (queuer) {
        d3.select(".queue")
            .append("li")
            .attr("id", `queuer_${ queuer.order }`)
            .text(queuer.order)
            .style("background-color", queuer.color);
    },
    newServiceTime: function (queuer) {
        d3.select(`#queuer_${queuer.order}`)
            .remove();
    },
}

queueObservable.addObserver(queueList);

const displayQueueLength = {
    queueChanged: function (queue) {
        const expectedServiceTime = parseInt(document.querySelector("[name=expected-service-time]").value);
        const waitTime = queue.length * expectedServiceTime;

        d3.select("#queue-length")
            .text(() => { return queue.length; });

        d3.select("#expected-wait-time")
            .text(() => { return `${(waitTime / 60).toFixed(2)} minutes`; });
    }
};

queueObservable.addObserver(displayQueueLength);

///////////////////////

function addQueuers(arrivals, arrivalTimes) {
    let interval;

    while (arrivals > 0) {
        interval = arrivalTimes[arrivalsObservable.nextArrivalIndex()];
        arrivalsObservable.addArrival(interval);
        arrivals--;
    }
}

function serveQueuers(served, serviceTimes) {
    let interval;

    while (served > 0) {
        interval = serviceTimes[serviceTimesObservable.nextServedIndex()];
        serviceTimesObservable.addServiceTime(interval);
        queueObservable.removeQueuer();
        served--;
    }
}

function displayElapsedTime(tickTime) {
    d3.select("#elapsed-time")
        .text(() => { return `${(tickTime / 60 / 60).toFixed(2)} hours`; });
}

function updateQueueUI(queueChanges, arrivalTimes, serviceTimes) {
    addQueuers(queueChanges.arrivals, arrivalTimes);
    serveQueuers(queueChanges.served, serviceTimes);
    displayElapsedTime(queueChanges.tickTime);
}

function playbackQueueBahaviour() {
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

    const queueChangesPerTick = computeQueueChangesPerTick(cumulativeArrivalTimes, serviceEndTimes, 600);

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
            updateQueueUI(queueChangesPerTick[tickIndex], arrivalTimes, serviceTimes);

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
