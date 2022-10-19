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
    notifyObservers: function () {
        this.observers.forEach(observer => {
            observer.queueChanged(this.queue);
        });
    },
    addQueuer: function () {
        this.count++;
        this.queue.push({
            order: this.count,
            color: randomColor(),
        });
        this.notifyObservers();
    },
    removeQueuer: function () {
        this.queue.shift();
        this.beingServed = false;
        this.notifyObservers();
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
            .text(d => { return d; });
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
            .text(d => { return d; });
    }
};

serviceTimesObservable.addObserver(serviceTimesList);

const queueList = {
    queueChanged: function (queue) {
        d3.select("#queue")
            .selectAll("li")
            .remove() // would be better to not repaint the whole thing every time

        d3.select("#queue")
            .selectAll("li")
            .data(queue)
            .enter().append("li")
            .text(d => { return d.order; })
            .style("color", d => { return d.color; });
    }
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

function randomColor() {
    const colors = ["red", "yellow", "blue", "orange", "green", "purple", "pink", "black"];
    const i = Math.floor(Math.random() * colors.length);
    return colors[i];
}

///////////////////////

function addQueuers(arrivals, arrivalTimes) {
    let interval;

    do {
        interval = arrivalTimes[arrivalsObservable.nextArrivalIndex()];
        arrivalsObservable.addArrival(interval);
        arrivals--;
    } while (arrivals > 0);
}

function serveQueuers(served, serviceTimes) {
    let interval;

    do {
        interval = serviceTimes[serviceTimesObservable.nextServedIndex()];
        serviceTimesObservable.addServiceTime(interval);
        queueObservable.removeQueuer();
        served--;
    } while (served > 0);
}

function displayElapsedTime(tickTime) {
    d3.select("#elapsed-time")
        .text(() => { return `${(tickTime / 60).toFixed(2)} minutes`; });
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
    const tickDuration = 600;
    const numberOfTicks = 100;

    const arrivalTimes = generateArrivalTimes(expectedArrivalInterval, tickDuration, numberOfTicks);
    const serviceTimes = generateServiceTimes(expectedServiceTime, arrivalTimes.length);

    const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
    const serviceEndTimes = computeServiceEndTimes(serviceTimes, cumulativeArrivalTimes);

    const queueChangesPerTick = computeQueueChangesPerTick(cumulativeArrivalTimes, serviceEndTimes, 600);

    let tickIndex = 0;
    let animationStart;
    let elapsedTime;
    let scalingFactor = 10;

    function animateQueue(timestamp) {
        if (animationStart === undefined) {
            // anchor the start of the animation in time
            animationStart = timestamp;

            // announce the end of the animation
            console.log("started at:", timestamp);
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
            }
        }
    }

    // kick off the animation
    requestAnimationFrame(animateQueue);
}

if (document.querySelector("#figure-MM1-queue .playback-queue-behaviour")) {
    document.querySelector("#figure-MM1-queue .playback-queue-behaviour").addEventListener("click", playbackQueueBahaviour);
}
