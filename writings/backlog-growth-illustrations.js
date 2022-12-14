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

    function itemColor(type) {
        type = type || "default";

        const colors = {
            "default": "#f72585ff", // pink
            "rejected": "#333", // grey
            "excess": "#bbb", // grey
            "aged": "#c51465ff", // pink but a bit transparent
        };

        return colors[type];
    }

    function itemElem(type) {
        const item = document.createElement("span");
        item.innerText = "Item";
        item.className = "item";
        item.style.backgroundColor = itemColor(type);

        return item;
    }

    function rejectItem(item) {
        item.style.backgroundColor = itemColor("rejected");
        item.className = item.className + " rejected";
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

    function startListener() {
        startIteration(unboundedBacklog, ".board.no-wip");
        startIteration(boundedBacklog, ".board.with-wip", wipLimit);
        cueEnd();
    }

    function endListener() {
        endIteration(unboundedBacklog, ".board.no-wip");
        endIteration(boundedBacklog, ".board.with-wip");
        cueStart();
    }

    function startIteration(backlog, boardSelector, wipLimit) {
        // push "arrived" items into the "index" row of the "backlog" column
        const iteration = backlog[iterationIndex];

        console.log(iteration)

        const board = figure.querySelector(boardSelector);
        const backlogColumn = board.querySelector(".backlog-column");

        // add newly arrived items
        for (let i = 0; i < iteration.arrived; i++) {
            backlogColumn.appendChild(itemElem());
        }

        if (wipLimit !== undefined) {
            for (let i = wipLimit; i < backlogColumn.childNodes.length; i++) {
                rejectItem(backlogColumn.childNodes[i]);
            }
        }
    }

    function endIteration(backlog, boardSelector) {
        // push "done" items into the "index" row of the "done" column
        // remove "done" items from the "index" row of the "done" column
        const iteration = backlog[iterationIndex];

        const board = figure.querySelector(boardSelector);
        const backlogColumn = board.querySelector(".backlog-column");
        const doneRow = board.querySelectorAll(".done-column tr")[iterationIndex];
        const doneColumn = doneRow.querySelector("td");

        [].forEach.call(backlogColumn.querySelectorAll(".rejected"), (item) => {
            console.log(item)
            backlogColumn.removeChild(item)
        })

        for (let i = 0; i < iteration.done; i++) {
            doneColumn.appendChild(itemElem());
        }

        for (let i = 0; i < iteration.done; i++) {
            backlogColumn.removeChild(backlogColumn.childNodes[0]);
        }

        // "age" all the existing items
//        [].forEach.call(backlogColumn.childNodes, (item) => {
//            item.style.backgroundColor = itemColor("aged");
//        })

        const idleCapacity = iteration.capacity - iteration.done;

        for (let i = 0; i < idleCapacity; i++) {
            doneColumn.appendChild(itemElem("excess"));
        }
    }

    // each backlog as:
    // * backlog behaviour
    // * a start iteration button (grow into backlog)
    // * an end iteration button (do work)

    startIterationButton.addEventListener("click", startListener);
    endIterationButton.addEventListener("click", endListener);

    cueStart();
})();
