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
        { timestamp: 10, type: 'arrival', queueLength: 1 },
        { timestamp: 21, type: 'arrival', queueLength: 2 },
        { timestamp: 21, type: 'service', waitTime: 0, avgWaitTime: 0, queueLength: 1 },
        { timestamp: 29, type: 'service', waitTime: 0, avgWaitTime: 0, queueLength: 0 },
        { timestamp: 36, type: 'arrival', queueLength: 1 },
        { timestamp: 44, type: 'arrival', queueLength: 2 },
        { timestamp: 50, type: 'arrival', queueLength: 3 },
        { timestamp: 52, type: 'service', waitTime: 0, avgWaitTime: 0, queueLength: 2 },
        { timestamp: 64, type: 'arrival', queueLength: 3 },
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
        { arrived: 5, capacity: 5, done: 5, backlogSizeAfter: 0 }, // iteration 1
        { arrived: 5, capacity: 4, done: 4, backlogSizeAfter: 1 }, // iteration 2
        { arrived: 6, capacity: 4, done: 4, backlogSizeAfter: 3 }, // iteration 3
        { arrived: 6, capacity: 6, done: 6, backlogSizeAfter: 3 }, // iteration 4
        { arrived: 5, capacity: 6, done: 6, backlogSizeAfter: 2 }, // iteration 5
    ];

    const boundedBacklogExpectation = [
        { arrived: 5, capacity: 5, done: 5, backlogSizeAfter: 0 }, // iteration 1
        { arrived: 5, capacity: 4, done: 4, backlogSizeAfter: 1 }, // iteration 2
        { arrived: 6, capacity: 4, done: 4, backlogSizeAfter: 2 }, // iteration 3
        { arrived: 6, capacity: 6, done: 6, backlogSizeAfter: 0 }, // iteration 4
        { arrived: 5, capacity: 6, done: 5, backlogSizeAfter: 0 }, // iteration 5
    ];

    const unboundedBacklog = computeBacklogBehaviour(iterationArrivals, iterationCapacities);
    const boundedBacklog = computeBacklogBehaviour(iterationArrivals, iterationCapacities, 6);

    console.log("correctly computes unbounded backlog behaviour", isDeepEqual(unboundedBacklog, unboundedBacklogExpectation));
    console.log("correctly computes bounded backlog behaviour", isDeepEqual(boundedBacklog, boundedBacklogExpectation));
})();

console.log("These are the cost of delay on poisson processes tests:\n-----------------");

(function () {

    function computeWaitingPerUnitPerItem(serviceBehaviour) {
        return serviceBehaviour.map(behaviour => {
            return [0, 0, 0];
        });
    }

    const serviceBehaviour = [
        { "serviceTime": 0.24607620252688645,  "readyAt": 0,                    "endsAt": 0.48309779271023773, "queueSizeWhenReady": 0,  "waitTime": 0 },
        { "serviceTime": 0.09729724237611598,  "readyAt": 0.48309779271023773,  "endsAt": 0.5803950350863537,  "queueSizeWhenReady": 1,  "waitTime": 0.07392239472855822 },
        { "serviceTime": 0.09903549672248903,  "readyAt": 0.5803950350863537,   "endsAt": 0.6794305318088427,  "queueSizeWhenReady": 1,  "waitTime": 0.04482636318075317 },
        { "serviceTime": 0.13462832730435725,  "readyAt": 0.6794305318088427,   "endsAt": 1.3291107766807637,  "queueSizeWhenReady": 0,  "waitTime": 0 },
        { "serviceTime": 0.3654600374648352,   "readyAt": 1.3291107766807637,   "endsAt": 1.6945708141455988,  "queueSizeWhenReady": 1,  "waitTime": 0.11085118219635359 },
        { "serviceTime": 0.06940683784477619,  "readyAt": 1.6945708141455988,   "endsAt": 1.7639776519903752,  "queueSizeWhenReady": 1,  "waitTime": 0.15058266823644462 },
        { "serviceTime": 1.3667075714019123,   "readyAt": 1.7639776519903752,   "endsAt": 3.1306852233922875,  "queueSizeWhenReady": 1,  "waitTime": 0.05327089155855047 },
        { "serviceTime": 0.26315768549234403,  "readyAt": 3.1306852233922875,   "endsAt": 3.3938429088846314,  "queueSizeWhenReady": 3,  "waitTime": 1.1499127685166712 },
        { "serviceTime": 0.32873420620419963,  "readyAt": 3.3938429088846314,   "endsAt": 3.722577115088831,   "queueSizeWhenReady": 2,  "waitTime": 0.9790095351549328 },
        { "serviceTime": 0.3568078566503239,   "readyAt": 3.722577115088831,    "endsAt": 4.079384971739155,   "queueSizeWhenReady": 1,  "waitTime": 1.2667243100113206 }
    ];

    const queueEvents = [
        { "timestamp": 0.23702159018335128, "type": "arrival",  "queueLength": 1 },
        { "timestamp": 0.4091753979816795,  "type": "arrival",  "queueLength": 2 },
        { "timestamp": 0.48309779271023773, "type": "service",  "waitTime": 0,                    "avgWaitTime": 0,                    "queueLength": 1 },
        { "timestamp": 0.5355686719056005,  "type": "arrival",  "queueLength": 2 },
        { "timestamp": 0.5803950350863537,  "type": "service",  "waitTime": 0.07392239472855822,  "avgWaitTime": 0.03696119736427911,  "queueLength": 1 },
        { "timestamp": 0.6794305318088427,  "type": "service",  "waitTime": 0.04482636318075317,  "avgWaitTime": 0.03958291930310379,  "queueLength": 0 },
        { "timestamp": 1.1944824493764064,  "type": "arrival",  "queueLength": 1 },
        { "timestamp": 1.2182595944844101,  "type": "arrival",  "queueLength": 2 },
        { "timestamp": 1.3291107766807637,  "type": "service",  "waitTime": 0,                    "avgWaitTime": 0.029687189477327847,  "queueLength": 1 },
        { "timestamp": 1.5439881459091542,  "type": "arrival",  "queueLength": 2 },
        { "timestamp": 1.6945708141455988,  "type": "service",  "waitTime": 0.11085118219635359,  "avgWaitTime": 0.04591998802113299,   "queueLength": 1 },
        { "timestamp": 1.7107067604318247,  "type": "arrival",  "queueLength": 2 },
        { "timestamp": 1.7639776519903752,  "type": "service",  "waitTime": 0.15058266823644462,  "avgWaitTime": 0.06336376805701827,   "queueLength": 1 },
        { "timestamp": 1.9807724548756163,  "type": "arrival",  "queueLength": 2 },
        { "timestamp": 2.4148333737296985,  "type": "arrival",  "queueLength": 3 },
        { "timestamp": 2.4558528050775106,  "type": "arrival",  "queueLength": 4 },
        { "timestamp": 3.1306852233922875,  "type": "service",  "waitTime": 0.05327089155855047,  "avgWaitTime": 0.06192192855723715,   "queueLength": 3 },
        { "timestamp": 3.3938429088846314,  "type": "service",  "waitTime": 1.1499127685166712,   "avgWaitTime": 0.1979207835521664,    "queueLength": 2 },
        { "timestamp": 3.722577115088831,   "type": "service",  "waitTime": 0.9790095351549328,   "avgWaitTime": 0.2847084226191405,    "queueLength": 1 },
        { "timestamp": 4.079384971739155,   "type": "service",  "waitTime": 1.2667243100113206,   "avgWaitTime": 0.38291001135835845,   "queueLength": 0 }
    ];


})();
