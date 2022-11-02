const { isDeepEqual } = require("./test-helpers");

// this is the tests!!
console.log("These are the tests:\n-----------------");

(function () {

    const { arrivalTimes, serviceTimes, outputFixture } = require("./pre-calculated-intervals");

    const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
    const serviceEndTimes = computeServiceEndTimes(serviceTimes, cumulativeArrivalTimes);
    const queueChangesPerTick = computeQueueChangesPerTick(cumulativeArrivalTimes, serviceEndTimes, 600);

    console.log("correctly computes queue changes per tick", isDeepEqual(queueChangesPerTick, outputFixture));

})();


(function () {
    const expectedArrivalInterval = 121;
    const expectedServiceTime = 120;
    const tickDuration = 600;
    const numberOfTicks = 100;
    const totalTime = tickDuration * numberOfTicks;

    const arrivalTimes = generateArrivalTimes(expectedArrivalInterval, tickDuration, numberOfTicks);
    const serviceTimes = generateServiceTimes(expectedServiceTime, arrivalTimes.length);

    console.log("all arrivals happen by the end of the last tick", computeCumulativeArrivalTimes(arrivalTimes).at(-1) <= totalTime);
    console.log("a service time is generated for each arrival time", arrivalTimes.length === serviceTimes.length);

    const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
    const serviceEndTimes = computeServiceEndTimes(serviceTimes, cumulativeArrivalTimes);
    const queueChangesPerTick = computeQueueChangesPerTick(cumulativeArrivalTimes, serviceEndTimes, tickDuration);

    console.log("data for the desired number of ticks is generated", queueChangesPerTick.length === numberOfTicks);
    console.log("last tick happens at the desired total time", queueChangesPerTick.at(-1).tickTime === totalTime);
})();

(function () {
    const tickDuration = 600;
    const expectedNumOfTicks = 100;

    console.log("number of ticks is computed correctly for max arrival of less than half way through the last tick", numOfTicks(tickDuration, 59690) === expectedNumOfTicks);
    console.log("number of ticks is computed correctly for max arrival of just under the last tick", numOfTicks(tickDuration, 59990) === expectedNumOfTicks);
    console.log("number of ticks is computed when max arrival is one unit into the last tick", numOfTicks(tickDuration, 59401) === expectedNumOfTicks);
    console.log("number of ticks is computed correctly for max arrival at the moment of a tick", numOfTicks(tickDuration, 60000) === expectedNumOfTicks);
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
    const serviceEndTimes = computeServiceEndTimes(serviceTimes, cumulativeArrivalTimes);

    const queueEvents = computeQueueEvents(cumulativeArrivalTimes, serviceEndTimes, serviceTimes, tickDuration);
    console.log("ordered queue events are properly computed", isDeepEqual(queueEvents, expectedQueueEvents));
})();
