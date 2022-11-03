function genRandomTime(avgTime) {
    // generate a random number of seconds between 0 and infinity,
    // where avgTime is the most likely value
    // following a Poisson process

    return (-Math.log(1 - Math.random())) * avgTime;
}

function generateArrivalTimes(expectedArrivalInterval, tickDuration, numberOfTicks) {
    const totalTime = tickDuration * numberOfTicks;

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

    do {
        serviceTimes.push(genRandomTime(expectedServiceTime));
    } while (serviceTimes.length < numberOfArrivals)

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

function computeQueueEvents(cumulativeArrivalTimes, serviceBehaviour, tickDuration) {
    const events = [];

    cumulativeArrivalTimes.forEach(time => {
        const event = {
            timestamp: time,
            type: "arrival",
            tickWindow: Math.ceil(time / tickDuration) * tickDuration,
        }
        events.push(event);
    });

    serviceBehaviour.forEach((behaviour) => {
        const event = {
            timestamp: behaviour.endsAt,
            type: "service",
            tickWindow: Math.ceil(behaviour.endsAt / tickDuration) * tickDuration,
            waitTime: behaviour.waitTime,
        }
        events.push(event);
    });

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
