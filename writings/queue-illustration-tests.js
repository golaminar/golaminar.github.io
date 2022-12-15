const { isDeepEqual } = require("./test-helpers");

console.log("These are the queue simulation tests:\n-----------------");

(function () {

    const { arrivalTimes, serviceTimes, expectedServiceBehaviour } = require("./pre-calculated-intervals");

    const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
    const serviceBehaviour = computeServiceBehaviour(serviceTimes, cumulativeArrivalTimes);

    console.log("correctly computes service behaviour", isDeepEqual(serviceBehaviour, expectedServiceBehaviour));
})();

(function () {
    const arrivalTimes = [10, 11, 15, 8, 6, 14];
    const serviceTimes = [11, 8, 16, 20, 12, 5];

    const expectedQueueEvents = [
        { timestamp: 10, type: 'arrival', waitTime: 0, queueLength: 1 },
        { timestamp: 21, type: 'arrival', waitTime: 0, queueLength: 2 },
        { timestamp: 21, type: 'service', waitTime: 0, avgWaitTime: 0, queueLength: 1 },
        { timestamp: 29, type: 'service', waitTime: 0, avgWaitTime: 0, queueLength: 0 },
        { timestamp: 36, type: 'arrival', waitTime: 0, queueLength: 1 },
        { timestamp: 44, type: 'arrival', waitTime: 8, queueLength: 2 },
        { timestamp: 50, type: 'arrival', waitTime: 22, queueLength: 3 },
        { timestamp: 52, type: 'service', waitTime: 0, avgWaitTime: 0, queueLength: 2 },
        { timestamp: 64, type: 'arrival', waitTime: 20, queueLength: 3 },
        { timestamp: 72, type: 'service', waitTime: 8, avgWaitTime: 2, queueLength: 2 },
        { timestamp: 84, type: 'service', waitTime: 22, avgWaitTime: 6, queueLength: 1 },
        { timestamp: 89, type: 'service', waitTime: 20, avgWaitTime: 8.333333333333334, queueLength: 0 }
    ]

    const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
    const serviceBehaviour = computeServiceBehaviour(serviceTimes, cumulativeArrivalTimes);

    const queueEvents = computeQueueEvents(cumulativeArrivalTimes, serviceBehaviour);

    console.log("ordered queue events are properly computed", isDeepEqual(queueEvents, expectedQueueEvents));
})();

console.log("These are the backlog behaviour tests:\n-----------------");

(function () {

    const iterationArrivals = [5, 5, 6, 6, 5];
    const iterationCapacities = [5, 4, 4, 6, 6];

    const unboundedBacklogExpectation = [
        { arrived: 5, capacity: 5, done: 5, rejected: 0, backlogSizeAfter: 0 }, // iteration 1
        { arrived: 5, capacity: 4, done: 4, rejected: 0, backlogSizeAfter: 1 }, // iteration 2
        { arrived: 6, capacity: 4, done: 4, rejected: 0, backlogSizeAfter: 3 }, // iteration 3
        { arrived: 6, capacity: 6, done: 6, rejected: 0, backlogSizeAfter: 3 }, // iteration 4
        { arrived: 5, capacity: 6, done: 6, rejected: 0, backlogSizeAfter: 2 }, // iteration 5
    ];

    const boundedBacklogExpectation = [
        { arrived: 5, capacity: 5, done: 5, rejected: 0, backlogSizeAfter: 0 }, // iteration 1
        { arrived: 5, capacity: 4, done: 4, rejected: 0, backlogSizeAfter: 1 }, // iteration 2
        { arrived: 6, capacity: 4, done: 4, rejected: 1, backlogSizeAfter: 2 }, // iteration 3
        { arrived: 6, capacity: 6, done: 6, rejected: 2, backlogSizeAfter: 0 }, // iteration 4
        { arrived: 5, capacity: 6, done: 5, rejected: 0, backlogSizeAfter: 0 }, // iteration 5
    ];

    const unboundedBacklog = computeBacklogBehaviour(iterationArrivals, iterationCapacities, Infinity);
    const boundedBacklog = computeBacklogBehaviour(iterationArrivals, iterationCapacities, 6);

    console.log("correctly computes unbounded backlog behaviour", isDeepEqual(unboundedBacklog, unboundedBacklogExpectation));
    console.log("correctly computes bounded backlog behaviour", isDeepEqual(boundedBacklog, boundedBacklogExpectation));
})();
