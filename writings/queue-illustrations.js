let scalingFactor;

function simulate (arrival, service) {
  //generate random arrival
  //generate random service
  //update the DOM with results
  //call callback functions with results
  arrive(queue, arrivalTimes, avgArrivalTime);
  //animateTimeLapse(avgServiceTime);
}

function arrive(queue, arrivalTimes, avgArrivalTime) {
  const timeToArrive = genRandomTime(avgArrivalTime);
  arrivalTimes.push(timeToArrive);
  updateArrivalDisplay(arrivalTimes);
}

function serve(queue, serviceTimes, avgServiceTime) {
  const timeToServe = genRandomTime(avgServiceTime);
  serviceTimes.push(timeToServe);
  updateServiceDisplay(serviceTimes);
  setTimeout(() => {
    serve(serviceTimes, avgServiceTime)
  }, timeToServe * 1000 * scalingFactor);
}

function genRandomTime(avgTime) {
    // generate a random number of seconds between 0 and infinity,
    // where avgTime is the most likely but erm... could be anything
}

