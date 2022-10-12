let scalingFactor = 0.01;

function simulate() {
    const queue = document.getElementById("queue");
    const arrivalTimes = [];
    const serviceTimes = [];
    const expectedArrivalInterval = document.querySelector("[name=expected-arrival-time-interval]").value;
    const expectedServiceTime = document.querySelector("[name=expected-service-time]").value;

    const requestService = createServiceRequester(queue, serviceTimes, expectedServiceTime);

    arrive(queue, arrivalTimes, expectedArrivalInterval, requestService);
}

function arrive(queue, arrivalTimes, expectedArrivalInterval, requestService) {
    const timeToArrive = genRandomTime(expectedArrivalInterval);

    //after the arrival interval, the queuer arrives
    //and triggers a service request
    //and triggers a following arrival
    setTimeout(() => {
        const queuer = createQueuer();
        queue.appendChild(queuer);
        arrivalTimes.push(timeToArrive);

        updateArrivalDisplay(arrivalTimes);
        requestService();

        arrive(queue, arrivalTimes, expectedArrivalInterval, requestService);
    }, timeToArrive * 1000 * scalingFactor);
}

function createQueuer() {
    const queuer = document.createElement('li');
    queuer.innerText = "⊛";
    queuer.style.color = randomColor();
    return queuer;
}

function randomColor() {
    const colors = ["red", "yellow", "blue", "orange", "green", "purple", "pink", "black"];
    const i = Math.floor(Math.random() * colors.length);
    return colors[i];
}

function createServiceRequester(queue, serviceTimes, expectedServiceTime) {
    let serving = false;

    function requestService() {
        if (serving === true) {
            return;
        }

        if (!queue.firstChild) {
            return;
        }

        serving = true;
        queue.firstChild.innerText = queue.firstChild.innerText + " being served …"

        const timeToServe = genRandomTime(expectedServiceTime);
        serviceTimes.push(timeToServe);

        setTimeout(() => {
            finishServing(queue, serviceTimes);
            serving = false;
            requestService(queue);
        }, timeToServe * 1000 * scalingFactor);
    }

    return requestService;
}

function finishServing(queue, serviceTimes) {
    queue.removeChild(queue.firstChild);
    updateServiceDisplay(serviceTimes);
}

function updateArrivalDisplay(arrivalTimes) {
    const arrivalTimeItem = document.createElement('li');
    arrivalTimeItem.innerText = arrivalTimes[arrivalTimes.length - 1];
    document.getElementById("arrival-time-intervals").appendChild(arrivalTimeItem);

    const avgArrivalTime = arrivalTimes.reduce((a, b) => a + b, 0) / arrivalTimes.length;
    document.getElementById("avg-arrival-time-interval").innerText = avgArrivalTime;
}

function updateServiceDisplay(serviceTimes) {
    const serviceTimeItem = document.createElement('li');
    serviceTimeItem.innerText = serviceTimes[serviceTimes.length - 1];
    document.getElementById("service-times").appendChild(serviceTimeItem);

    const avgServiceTime = serviceTimes.reduce((a, b) => a + b, 0) / serviceTimes.length;
    document.getElementById("avg-service-time").innerText = avgServiceTime;
}


function genRandomTime(avgTime) {
    // generate a random number of seconds between 0 and infinity,
    // where avgTime is the most likely but erm... could be anything

    // The results will fall into a Poisson distribution.
    // A Poisson distribution is a histogram of the expected number of discrete events
    // that are likely to offer in a given time frame.
    // From that perspective, we could generate the expected # of people
    // to arrive in a given clock tick, but this is not how we can generate
    // a random arrival _interval_
    // https://en.wikipedia.org/wiki/Poisson_distribution
    // http://web.tecnico.ulisboa.pt/mcasquilho/acad/or/queue/SBakerQueuingI.pdf
    // https://gist.github.com/ferreiro/2b5caac126b58bebce82

    // for now, return a random value equally distributed between 0 and twice times the avgTime.
    return Math.round(avgTime * 2 * Math.random());
}

// returns numberOfWindows counts in intervals of duration 5 * avgArrivalInterval
function arrivals(avgArrivalInterval, numberOfWindows) {

    const avgCountsPerInterval = 1 / avgArrivalInterval;
    const observationWindowInIntervals = 5 * avgArrivalInterval;
    const window = observationWindowInIntervals;

    console.log(`average in ${window} intervals:`, avgCountsPerInterval * window);

    let sum = 0.5 // average value after sum -= 5
    let tbl = [];

    for (let i = 0; i < numberOfWindows; i++) {
        let count = 0;
        let m;
        while (sum < window) {
             if (count > 1000) { break; }; // safe guard from typos
            count += 1;
            sum += (-Math.log(Math.random())) / avgCountsPerInterval;
        }
        tbl.push(count);
        sum -= window;
    }

    return tbl;
}

document.getElementById("start-simulation").addEventListener("click", simulate);
