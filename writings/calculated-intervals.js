function computeCumulativeArrivalTimes(arrivalTimes) {
    return arrivalTimes.reduce((accumulator, arrivalTime) => {
        accumulator.push((accumulator.length ? accumulator.at(-1) : 0) + arrivalTime);
        return accumulator;
    }, []);
}

function computeServiceEndTimes(serviceTimes, cumulativeArrivalTimes) {
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

        const arrivalsBeforeReadyAt = cumulativeArrivalTimes.filter((cumulativeArrivalTime) => {
            return cumulativeArrivalTime < readyAt;
        }).length;

        const peopleServedBeforeReadyAt = index;

        const queueSizeWhenReady = index ? (arrivalsBeforeReadyAt - peopleServedBeforeReadyAt): 0;

        // =if (N3 > 0, K3 + J3, D3 + J3)
        // N3 => this queueSizeWhenReady value
        // K3 => this readyAt value
        // J3 => this serviceTime value
        // D3 => the cumulativeArrivalTime at the same index value
        //       i.e. the arrival time of the person who will be serviced
        const endsAt = queueSizeWhenReady > 0 ?
                        readyAt + serviceTime :
                        cumulativeArrivalTimes[index] + serviceTime;

        accumulator.push({
            "serviceTime": serviceTime,
            "readyAt": readyAt, // Redundant?
            "endsAt": endsAt,
            "queueSizeWhenReady": queueSizeWhenReady,
        });

        return accumulator;
    }, []);

    // Note: instead of doing this in two steps, the `reduce` could push endsAt
    // since the other values are not used in subsequent steps.
    // It was useful to do this in two steps to be able to compare the
    // `serviceBehaviour` result to the Google Sheets data
    return serviceBehaviour.map(behaviour => { return behaviour.endsAt; });
}

function computeQueueChangesPerTick(cumulativeArrivalTimes, serviceEndTimes, tickDuration) {
    const maxTickTime = cumulativeArrivalTimes.at(-1);

    const queueChangesPerTick = [];

    for (let tickTime = tickDuration; tickTime <= maxTickTime; tickTime += tickDuration) {
        queueChangesPerTick.push({
            "tickTime": tickTime,
            "arrivals": cumulativeArrivalTimes.filter((time) => { return time <= tickTime && time > (tickTime - tickDuration) }).length,
            "served": serviceEndTimes.filter((time) => { return time <= tickTime && time > (tickTime - tickDuration) }).length,
        });
    }

    return queueChangesPerTick;
}
