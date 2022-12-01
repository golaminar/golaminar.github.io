function computeBacklogBehaviour(arrivals, capacities, wipLimit) {
    const backlogBehaviour = [];
    const backlogWipLimit = (wipLimit === undefined) ? Infinity : wipLimit;
    let backlogSize = 0;

    arrivals.forEach((arrived, index) => {
        backlogSize = Math.min(backlogSize + arrived, backlogWipLimit);

        const capacity = capacities[index];
        const done = (capacity > backlogSize) ? backlogSize : capacity;

        backlogSize = backlogSize - done;

        const iterationOutcome = {
            arrived,
            capacity,
            done,
            backlogSizeAfter: backlogSize,
        };

        backlogBehaviour.push(iterationOutcome);
    });

    return backlogBehaviour;
};

(function () {
    const iterationArrivals = [5, 5, 6, 6, 5];
    const iterationCapacities = [5, 4, 4, 6, 6];
    const wipLimit = 6;

    const unboundedBacklog = computeBacklogBehaviour(iterationArrivals, iterationCapacities);
    const boundedBacklog = computeBacklogBehaviour(iterationArrivals, iterationCapacities, wipLimit);

    let iterationIndex = 0;

    function startInteration(index, backlogBehaviour) {

    }

    function endInteration(index, backlogBehaviour) {

    }

    // each backlog as:
    // * backlog behaviour
    // * a start iteration button (grow into backlog)
    // * an end iteration button (do work)

    function backlogInterative() {

    }

    backlogInterative(unboundedBacklog);
    backlogInterative(boundedBacklog);
})();
