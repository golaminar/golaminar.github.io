const { isDeepEqual } = require("./test-helpers");

// this is the tests!!
console.log("this is the tests!!");

(function () {

    const { arrivalTimes, serviceTimes, outputFixture } = require("./pre-calculated-intervals");

    const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
    const serviceEndTimes = computeServiceEndTimes(serviceTimes, cumulativeArrivalTimes);
    const queueChangesPerTick = computeQueueChangesPerTick(cumulativeArrivalTimes, serviceEndTimes, 600);

    console.log(isDeepEqual(queueChangesPerTick, outputFixture));

})();


(function () {
    const expectedArrivalTime = 121;
    const expectedServiceTime = 120;
    const tickDuration = 600;
    const numberOfTicks = 100;
    const totalTime = tickDuration * numberOfTicks;

    const arrivalTimes = generateArrivalTimes(expectedArrivalTime, tickDuration, numberOfTicks);
    const serviceTimes = generateServiceTimes(expectedServiceTime, arrivalTimes.length);

    console.log(computeCumulativeArrivalTimes(arrivalTimes).at(-1) < totalTime);
    console.log(arrivalTimes.length === serviceTimes.length);
})();
