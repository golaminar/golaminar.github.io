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
    const expectedArrivalTime = 121;
    const expectedServiceTime = 120;
    const tickDuration = 600;
    const numberOfTicks = 100;
    const totalTime = tickDuration * numberOfTicks;

    const arrivalTimes = generateArrivalTimes(expectedArrivalTime, tickDuration, numberOfTicks);
    const serviceTimes = generateServiceTimes(expectedServiceTime, arrivalTimes.length);

    console.log("all arrivals happen by the end of the last tick", computeCumulativeArrivalTimes(arrivalTimes).at(-1) <= totalTime);
    console.log("a service time is generated for each arrival time", arrivalTimes.length === serviceTimes.length);

    const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
    const serviceEndTimes = computeServiceEndTimes(serviceTimes, cumulativeArrivalTimes);
    const queueChangesPerTick = computeQueueChangesPerTick(cumulativeArrivalTimes, serviceEndTimes, tickDuration);

    console.log("data for the desired number of ticks is generated", queueChangesPerTick.length === numberOfTicks);
    console.log("last tick happens at the desired total time", queueChangesPerTick.at(-1).tickTime === totalTime);
})();
