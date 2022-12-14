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

    const startIterationButton = figure.querySelector("button.start-iteration");
    const endIterationButton = figure.querySelector("button.end-iteration");

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
        item.className = "item";
        item.style.backgroundColor = colors[type];

        return item;
    }

    function cueStart() {
        if (iterationIndex === undefined) {
            iterationIndex = 0;
        } else {
            iterationIndex++;
        }

        startIterationButton.disabled = false;
        endIterationButton.disabled = true;
    }

    function cueEnd() {
        startIterationButton.disabled = true;
        endIterationButton.disabled = false;
    }

    function startIteration() {
        // push "arrived" items into the "index" row of the "backlog" column
        const iteration = unboundedBacklog[iterationIndex];

        const board = figure.querySelector(".board.no-wip");
        const backlogColumn = board.querySelector(".backlog-column");

        for (let i = 0; i < iteration.arrived; i++) {
            backlogColumn.appendChild(itemElem());
        }

        cueEnd();
    }

    function endIteration() {
        // push "done" items into the "index" row of the "done" column
        // remove "done" items from the "index" row of the "done" column
        console.log(unboundedBacklog[iterationIndex]);

        const iteration = unboundedBacklog[iterationIndex];

        const board = figure.querySelector(".board.no-wip");
        const backlogColumn = board.querySelector(".backlog-column");
        const doneRow = board.querySelectorAll(".done-column tr")[iterationIndex];
        const doneColumn = doneRow.querySelector("td");

        for (let i = 0; i < iteration.done; i++) {
            doneColumn.appendChild(itemElem());
        }

        for (let i = 0; i < iteration.done; i++) {
            backlogColumn.removeChild(backlogColumn.childNodes[0]);
        }

        cueStart();
    }

    // each backlog as:
    // * backlog behaviour
    // * a start iteration button (grow into backlog)
    // * an end iteration button (do work)

    startIterationButton.addEventListener("click", startIteration);
    endIterationButton.addEventListener("click", endIteration);

    cueStart();
})();
