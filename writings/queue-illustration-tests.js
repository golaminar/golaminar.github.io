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
    const arrivals = 10;
    const served = 10;

    addQueuers(arrivals, []);
    serveQueuers(served, []);

    console.log("arrivalsObservable.arrivals has as many items there were arrivals", arrivalsObservable.arrivals.length === arrivals);
    console.log("serviceTimesObservable.serviceTimes has as many times as there were served", serviceTimesObservable.serviceTimes.length === served);

    addQueuers(0, []);
    serveQueuers(0, []);

    console.log("arrivalsObservable.arrivals does not grow when there are no arrivals", arrivalsObservable.arrivals.length === arrivals);
    console.log("serviceTimesObservable.serviceTimes does not grow when there are none served", serviceTimesObservable.serviceTimes.length === served);
})();
