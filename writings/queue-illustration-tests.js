const { isDeepEqual } = require("./test-helpers");
const { arrivalTimes, serviceTimes, outputFixture } = require("./pre-calculated-intervals");

// this is the tests!!
console.log("this is the tests!!");

const cumulativeArrivalTimes = computeCumulativeArrivalTimes(arrivalTimes);
const serviceEndTimes = computeServiceEndTimes(serviceTimes, cumulativeArrivalTimes);
const queueChangesPerTick = computeQueueChangesPerTick(cumulativeArrivalTimes, serviceEndTimes, 600);

console.log(isDeepEqual(queueChangesPerTick, outputFixture));
