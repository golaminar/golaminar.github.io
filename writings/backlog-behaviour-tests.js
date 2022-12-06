// this is the tests!!
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
