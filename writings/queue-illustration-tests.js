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

