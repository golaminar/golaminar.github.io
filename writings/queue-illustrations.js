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

    // for now, return a random value equally distributed between 0 and twice times the avgTime.
    return Math.round(avgTime * 2 * Math.random());
}

document.getElementById("start-simulation").addEventListener("click", simulate);
