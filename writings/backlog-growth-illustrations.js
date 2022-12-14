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

    let iterationIndex; // leave undefined to start

    const figure = document.querySelector("#figure-backlog-growth");

    const startInterationButton = figure.querySelector("button.start-iteration");
    const endInterationButton = figure.querySelector("button.end-iteration");

    const unboundedBoard = figure.querySelector(".board.no-wip");
    const boundedBoard = figure.querySelector(".board.with-wip");

    function itemElem(type) {
        type = type || "default";

        const colors = {
            "default": "#f72585ff", // pink
            "rejected": "#ddd", // grey
            "aged": "f72585aa", // pink but a bit transparent
        };

        const item = document.createElement("span");
        item.innerText = "Item";
        item.class = "item";
        item.style.backgroundColor = colors[type];

        return item;
    }

    function cueStart() {
        if (iterationIndex) {
            iterationIndex++;
        } else {
            iterationIndex = 0;
        }

        startInterationButton.disabled = false;
        endInterationButton.disabled = true;
    }

    function cueEnd() {
        startInterationButton.disabled = true;
        endInterationButton.disabled = false;
    }

    function startInteration() {
        // push "arrived" items into the "index" row of the "backlog" column
        console.log(unboundedBacklog[iterationIndex]);

        cueEnd();
    }

    function endInteration() {
        // push "done" items into the "index" row of the "done" column
        // remove "done" items from the "index" row of the "done" column
        console.log(unboundedBacklog[iterationIndex]);

        cueStart();
    }

    // each backlog as:
    // * backlog behaviour
    // * a start iteration button (grow into backlog)
    // * an end iteration button (do work)

    startInterationButton.addEventListener("click", startInteration);
    endInterationButton.addEventListener("click", endInteration);

    cueStart();
})();
