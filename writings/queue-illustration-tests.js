const { isDeepEqual } = require("./test-helpers");

// this is the tests!!
console.log("These are the tests:\n-----------------");

(function () {

    const { arrivalTimes, serviceTimes, expectedServiceBehaviour } = require("./pre-calculated-intervals");

    const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
    const serviceBehaviour = computeServiceBehaviour(serviceTimes, cumulativeArrivalTimes);

    console.log("correctly computes service behaviour", isDeepEqual(serviceBehaviour, expectedServiceBehaviour));

})();

(function () {
    const tickDuration = 10;

    const arrivalTimes = [10, 11, 15, 8, 6, 14];
    const serviceTimes = [11, 8, 16, 20, 12, 5];

    const expectedQueueEvents = [
        { timestamp: 10, type: 'arrival', tickWindow: 10, queueLength: 1 },
        { timestamp: 21, type: 'arrival', tickWindow: 30, queueLength: 2 },
        { timestamp: 21, type: 'service', tickWindow: 30, queueLength: 1, waitTime: 0 },
        { timestamp: 29, type: 'service', tickWindow: 30, queueLength: 0, waitTime: 0 },
        { timestamp: 36, type: 'arrival', tickWindow: 40, queueLength: 1 },
        { timestamp: 44, type: 'arrival', tickWindow: 50, queueLength: 2 },
        { timestamp: 50, type: 'arrival', tickWindow: 50, queueLength: 3 },
        { timestamp: 52, type: 'service', tickWindow: 60, queueLength: 2, waitTime: 0 },
        { timestamp: 64, type: 'arrival', tickWindow: 70, queueLength: 3 },
        { timestamp: 72, type: 'service', tickWindow: 80, queueLength: 2, waitTime: 8 },
        { timestamp: 84, type: 'service', tickWindow: 90, queueLength: 1, waitTime: 22 },
        { timestamp: 89, type: 'service', tickWindow: 90, queueLength: 0, waitTime: 20 },
    ];

    const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
    const serviceBehaviour = computeServiceBehaviour(serviceTimes, cumulativeArrivalTimes);

    const queueEvents = computeQueueEvents(cumulativeArrivalTimes, serviceBehaviour, tickDuration);

    console.log("ordered queue events are properly computed", isDeepEqual(queueEvents, expectedQueueEvents));
})();
