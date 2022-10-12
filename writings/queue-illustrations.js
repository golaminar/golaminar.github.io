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
        this.queue.push(this.count);
        this.notifyObservers();
    },
    removeQueuer: function () {
        this.queue.shift();
        this.notifyObservers();
    },
};

const arrivalTimesLog = {
    newArrival: function(arrivals) {
        console.log("latest arrival", arrivals.at(-1));
    }
};

arrivalsObservable.addObserver(arrivalTimesLog);

const serviceTimesLog = {
    newServiceTime: function (serviceTimes) {
        console.log("serviceTimes", serviceTimes);
    }
};

serviceTimesObservable.addObserver(serviceTimesLog);

const queueLog = {
    queueChanged: function (queue) {
        console.log(queue);
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

function randomColor() {
    const colors = ["red", "yellow", "blue", "orange", "green", "purple", "pink", "black"];
    const i = Math.floor(Math.random() * colors.length);
    return colors[i];
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

    function genRandomTime(avgTime) {
        // generate a random number of seconds between 0 and infinity,
        // where avgTime is the most likely value
        // following a Poisson process

        return (-Math.log(1 - Math.random())) * avgTime;
    }

    const dt = genRandomTime(this.interval);
    const self = this;
    this.timeout = setTimeout(function () {
        self.start();
        self.fn(dt);
    }, dt);
};

Process.prototype.stop = function () {
    clearTimeout(this.timeout);
};

document.getElementById("start-simulation").addEventListener("click", simulate);
