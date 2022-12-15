function computeBacklogBehaviour(arrivals, capacities, wipLimit) {
    const backlogBehaviour = [];
    let backlogSize = 0;

    arrivals.forEach((arrived, index) => {
        backlogSize = backlogSize + arrived;

        const capacity = capacities[index];
        const done = (capacity > backlogSize) ? backlogSize : capacity;
        const rejected = (backlogSize > wipLimit) ? backlogSize - wipLimit : 0;

        backlogSize = backlogSize - done - rejected;

        const iterationOutcome = {
            arrived,
            capacity,
            done,
            rejected,
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

    const unboundedBacklog = computeBacklogBehaviour(iterationArrivals, iterationCapacities, Infinity);
    const boundedBacklog = computeBacklogBehaviour(iterationArrivals, iterationCapacities, wipLimit);

    let iterationIndex; // leave undefined to start

    const figure = document.querySelector("#figure-backlog-growth");

    const startIterationButton = figure.querySelector("button.start-iteration");
    const endIterationButton = figure.querySelector("button.end-iteration");

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

    function markAsRejected(item) {
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
        startIteration(unboundedBacklog, ".no-wip", Infinity);
        startIteration(boundedBacklog, ".with-wip", wipLimit);
        cueEnd();
    }

    function endListener() {
        endIteration(unboundedBacklog, ".no-wip");
        endIteration(boundedBacklog, ".with-wip");
        cueStart();
    }

    function explainIterationStart(iteration, board) {
        const backlogExplanation = board.querySelector(".backlog-column .frame-explanation");
        const doneExplanation = board.querySelector(".done-column .frame-explanation");
        const explanations = [`Incoming: ${iteration.arrived}`];

        if (iteration.rejected) {
            explanations.push(`Rejected: ${iteration.rejected}`);
        }

        backlogExplanation.innerHTML = explanations.join("<br>");
        doneExplanation.innerHTML = "";
    }

    function explainIterationEnd(iteration, board) {
        const backlogExplanation = board.querySelector(".backlog-column .frame-explanation");
        const doneExplanation = board.querySelector(".done-column .frame-explanation");
        const explanations = [`Completed: ${iteration.done}`];

        if (iteration.done < iteration.capacity) {
            explanations.push(`Excess capacity: ${iteration.capacity - iteration.done}`);
        }

        doneExplanation.innerHTML = explanations.join("<br>");
        backlogExplanation.innerHTML = "";
    }

    function startIteration(backlog, boardSelector, wipLimit) {
        const iteration = backlog[iterationIndex];
        console.log(iteration)
        const board = figure.querySelector(boardSelector);
        const backlogColumn = board.querySelector(".backlog-column .items");

        // add newly arrived items
        for (let i = 0; i < iteration.arrived; i++) {
            backlogColumn.appendChild(itemElem());
        }

        for (let i = 0; i < iteration.rejected; i++) {
            markAsRejected(backlogColumn.childNodes[wipLimit + i]);
        }

        explainIterationStart(iteration, board);
    }

    function endIteration(backlog, boardSelector) {
        const iteration = backlog[iterationIndex];
        const board = figure.querySelector(boardSelector);
        const backlogColumn = board.querySelector(".backlog-column .items");
        const doneColumn = board.querySelectorAll(".done-column .iteration")[iterationIndex];

        [].forEach.call(backlogColumn.querySelectorAll(".rejected"), (item) => {
            backlogColumn.removeChild(item);
        });

        for (let i = 0; i < iteration.done; i++) {
            doneColumn.appendChild(itemElem());
        }

        for (let i = 0; i < iteration.done; i++) {
            backlogColumn.removeChild(backlogColumn.childNodes[0]);
        }

        for (let i = iteration.done; i < iteration.capacity; i++) {
            doneColumn.appendChild(itemElem("excess"));
        }

        explainIterationEnd(iteration, board);
    }

    // each backlog as:
    // * backlog behaviour
    // * a start iteration button (grow into backlog)
    // * an end iteration button (do work)

    startIterationButton.addEventListener("click", startListener);
    endIterationButton.addEventListener("click", endListener);

    cueStart();
})();
