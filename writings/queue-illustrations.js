let scalingFactor = 0.01;

function simulate() {
    const expectedArrivalInterval = parseInt(document.querySelector("[name=expected-arrival-time-interval]").value);
    const expectedServiceTime = parseInt(document.querySelector("[name=expected-service-time]").value);

    const arrivalGenerator = new Process(expectedArrivalInterval, function (interval) {
        arrivalsObservable.addArrival(interval);
    }).start();

    const serverGenerator = new Process(expectedServiceTime, function (interval) {
        serviceTimesObservable.addServiceTime(interval);
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

const arrivalTimesLog = {
    newArrival: function(arrivals) {
        console.log("arrivals", arrivals);
    }
};

arrivalsObservable.addObserver(arrivalTimesLog);

const serviceTimesLog = {
    newServiceTime: function (serviceTimes) {
        console.log("serviceTimes", serviceTimes);
    }
};

serviceTimesObservable.addObserver(serviceTimesLog);

function randomColor() {
    const colors = ["red", "yellow", "blue", "orange", "green", "purple", "pink", "black"];
    const i = Math.floor(Math.random() * colors.length);
    return colors[i];
}

var Process = function (interval, fn) {
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

    var dt = genRandomTime(this.interval);
    var self = this;
    this.timeout = setTimeout(function () {
        self.start();
        self.fn(dt);
    }, dt);
};

Process.prototype.stop = function () {
    clearTimeout(this.timeout);
};

document.getElementById("start-simulation").addEventListener("click", simulate);
