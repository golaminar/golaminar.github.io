let scalingFactor = 0.01;

function simulate() {
    const expectedArrivalInterval = parseInt(document.querySelector("[name=expected-arrival-time-interval]").value);

    const arrivalGenerator = new Process(expectedArrivalInterval, function (interval) {
        arrivalsObservable.addArrival(interval);
    }).start();
}

const arrivalsObservable = {
    observers: [],
    arrivals: [],
    addObserver: function(observer) {
        this.observers.push(observer);
    },
    notifyObservers: function() {
        this.observers.forEach(observer => {
            observer.newArrival(this.arrivals);
        });
    },
    addArrival: function(interval) {
        this.arrivals.push(interval);
        this.notifyObservers();
    },
};

const serviceTimesObservable = {
    observers: [],
    serviceTimes: [],
    addObserver: function(observer) {
        this.observers.push(observer);
    },
    notifyObservers: function() {
        this.observers.forEach(observer => {
            observer.newServiceTime(this.serviceTimes);
        });
    },
    addServiceTime: function(interval) {
        this.serviceTimes.push(interval);
        this.notifyObservers();
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

const arrivalTimesLog = {
    newArrival: function(arrivals) {
        console.log("latest arrival", arrivals.at(-1));
    }
};

// arrivalsObservable.addObserver(arrivalTimesLog);

const serviceTimesLog = {
    newServiceTime: function (serviceTimes) {
        console.log("serviceTimes", serviceTimes);
    }
};

//serviceTimesObservable.addObserver(serviceTimesLog);

const queueLog = {
    queueChanged: function (queue) {
        console.table(queue);
    }
};

queueObservable.addObserver(queueLog);

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
            .text(() => { return d3.mean(arrivals); });
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
            .text(() => { return d3.mean(serviceTimes); });
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
            .data(queue)
            .enter().append("li")
            .text(d => { return d.order; })
            .style("color", d => { return d.color; });
    }
}

queueObservable.addObserver(queueList);

const attemptService = {
    queueChanged: function () {
        if (queueObservable.readyToServe()) {
            const expectedServiceTime = parseInt(document.querySelector("[name=expected-service-time]").value);
            const serviceTime = genRandomTime(expectedServiceTime);
            queueObservable.occupyServer();
            setTimeout(() => {
                serviceTimesObservable.addServiceTime(serviceTime);
                queueObservable.removeQueuer();
            }, computeTimeout(serviceTime));
        }
    }
}

queueObservable.addObserver(attemptService);

const displayQueueLength = {
    queueChanged: function (queue) {
        const expectedServiceTime = parseInt(document.querySelector("[name=expected-service-time]").value);
        const waitTime = queue.length * expectedServiceTime;

        d3.select("#queue-length")
            .text(() => { return queue.length; });

        d3.select("#expected-wait-time")
            .text(() => { return `${waitTime} seconds `; });
    }
};

queueObservable.addObserver(displayQueueLength);

function randomColor() {
    const colors = ["red", "yellow", "blue", "orange", "green", "purple", "pink", "black"];
    const i = Math.floor(Math.random() * colors.length);
    return colors[i];
}

function genRandomTime(avgTime) {
    // generate a random number of seconds between 0 and infinity,
    // where avgTime is the most likely value
    // following a Poisson process

    return (-Math.log(1 - Math.random())) * avgTime;
}

function computeTimeout(intervalInSeconds) {
    return intervalInSeconds * 1000 * scalingFactor;
}

const Process = function (interval, fn) {
    // Parameters:
    //   interval
    //     number of milliseconds
    if (typeof interval !== 'number') {
        throw new Error(interval + ' should be a number.');
    }
    if (typeof fn !== 'function') {
        throw new Error('Callee ' + fn + ' should be a function.');
    }
    if (interval < 0) {
        throw new Error(interval + ' should be a non-negative number.');
    }
    this.interval = interval;
    this.fn = fn;
    this.timeout = null;
};

Process.prototype.start = function () {
    const dt = genRandomTime(this.interval);
    const self = this;
    this.timeout = setTimeout(function () {
        self.start();
        self.fn(dt);
    }, computeTimeout(dt));
};

Process.prototype.stop = function () {
    clearTimeout(this.timeout);
};

document.getElementById("start-simulation").addEventListener("click", simulate);
