function computeBacklogBehaviour(arrivals, capacities, wipLimit) {
    const backlogBehaviour = [];
    const backlogWipLimit = (wipLimit === undefined) ? Infinity : wipLimit;
    let backlogSize = 0;

    arrivals.forEach((arrived, index) => {
        //backlogSize = Math.min(backlogSize + arrived, backlogWipLimit);

        backlogSize = backlogSize + arrived;

        const capacity = capacities[index];
        const done = (capacity > backlogSize) ? capacity : backlogSize;

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

    const iterationArrivals = [
        5,
        5,
        6,
        6,
        4,
        4,
    ];

    const iterationCapacities = [
        5,
        4,
        5,
        6,
        5,
        7,
    ];

    const unboundedBacklog = [
        {
            // iteration 1
            arrived: 5,
            capacity: 5,
            done: 5,
            backlogSizeAfter: 0,
        },
        {
            // iteration 2
            arrived: 5,
            capacity: 4,
            done: 4,
            backlogSizeAfter: 1,
        },
        {
            // iteration 3
            arrived: 6,
            capacity: 6,
            done: 6,
            backlogSizeAfter: 3, // 2,
        },
        {
            // iteration 4
            arrived: 6,
            capacity: 6,
            done: 6,
            backlogSizeAfter: 3,
        },
        {
            // iteration 5
            arrived: 4,
            capacity: 5,
            done: 5,
            backlogSizeAfter: 2, // 1,
        },
        {
            // iteration 6
            arrived: 4,
            capacity: 7,
            done: 6, // 5,
            backlogSizeAfter: 0, // 0,
        },
    ];

})();
