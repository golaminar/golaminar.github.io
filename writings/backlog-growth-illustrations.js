function computeBacklogBehaviour(arrivals, capacities, wipLimit) {
    const backlogBehaviour = [];
    let backlogSize = 0;

    arrivals.forEach((arrived, index) => {
        backlogSize = backlogSize + arrived;

        const capacity = capacities[index];
        const done = (capacity > backlogSize) ? backlogSize : capacity;
        const rejected = (backlogSize > wipLimit) ? backlogSize - wipLimit : 0;
        const excess = capacity - done;

        backlogSize = backlogSize - done - rejected;

        const iterationOutcome = {
            arrived,
            capacity,
            done,
            rejected,
            excess,
            backlogSizeAfter: backlogSize,
        };

        backlogBehaviour.push(iterationOutcome);
    });

    return backlogBehaviour;
};

(function () {
    const iterationArrivals = [5, 5, 6, 6, 5];
    const iterationCapacities = [5, 4, 4, 6, 6];
    const iterationsCount = iterationArrivals.length;
    const wipLimit = 6;

    const unboundedBacklog = computeBacklogBehaviour(iterationArrivals, iterationCapacities, Infinity);
    const boundedBacklog = computeBacklogBehaviour(iterationArrivals, iterationCapacities, wipLimit);

    let iterationIndex = 0;
    let cuedStage = "start";
    let jumpSize = 3;

    const figure = document.querySelector("#figure-backlog-growth");

    const buttons = figure.querySelectorAll(".controls button");

    function itemColor(type) {
        const colors = {
            "default": "#f72585ff", // pink
            "rejected": "#333", // grey
            "excess": "#bbb", // grey
            "aged": "#c51465ff", // pink but a bit transparent
        };

        return colors[type];
    }

    function itemElem(type) {
        type = type || "default";

        const item = document.createElement("span");
        item.innerText = "Item";
        item.className = `item ${type}`;
        item.style.backgroundColor = itemColor(type);

        return item;
    }

    function iterationElem() {
        const div = document.createElement("div");
        div.className = "iteration";
        return div;
    }

    function markAsRejected(item) {
        item.style.backgroundColor = itemColor("rejected");
        item.className = item.className + " rejected";
    }

    function setButtonEnabledState() {
        const firstFrame = iterationIndex === 0;
        const lastFrame = cuedStage === "start" && iterationIndex >= iterationsCount;

        [].forEach.call(buttons, button => {
            button.disabled = false;
        });

        if (firstFrame) {
            // disable backward buttons
            [].forEach.call(buttons, button => {
                button.disabled = button.dataset.direction === "backward";
            });
        }

        if (lastFrame) {
            // disable forward buttons
            [].forEach.call(buttons, button => {
                button.disabled = button.dataset.direction === "forward";
            });
        }
    }

    function announceFrame() {
        const frameTitle = `${cuedStage} of<br>iteration ${iterationIndex + 1}`;
        figure.querySelector(".frame-title").innerHTML = frameTitle;
    }

    function cueStart() {
        cuedStage = "start";
        setButtonEnabledState();
    }

    function cueEnd() {
        cuedStage = "end";
        setButtonEnabledState();
    }

    function stepForward() {
        if (cuedStage === "start") {
            announceFrame();
            startIteration(unboundedBacklog, ".no-wip", Infinity);
            startIteration(boundedBacklog, ".with-wip", wipLimit);
            cueEnd();
        } else {
            announceFrame();
            endIteration(unboundedBacklog, ".no-wip");
            endIteration(boundedBacklog, ".with-wip");
            iterationIndex++;
            cueStart();
        }
    }

    function stepBackward() {
        if (cuedStage === "start") {
            iterationIndex--;
            announceFrame();
            revertEndIteration(unboundedBacklog, ".no-wip");
            revertEndIteration(boundedBacklog, ".with-wip");
            cueEnd();
        } else {
            announceFrame();
            revertStartIteration(unboundedBacklog, ".no-wip");
            revertStartIteration(boundedBacklog, ".with-wip");
            cueStart();
        }
    }

    function advanceFrame(event) {
        const size = event.target.dataset.size;
        const direction = event.target.dataset.direction;

        if (size === "step" && direction === "forward") {
            stepForward();
        }

        if (size === "jump" && direction === "forward") {
            const targetIteration = iterationIndex + jumpSize;
            while (iterationIndex < Math.min(targetIteration, iterationsCount)) {
                stepForward();
            }
        }

        if (size === "step" && direction === "backward") {
            stepBackward();
        }

        if (size === "jump" && direction === "backward") {
            const targetIteration = iterationIndex - jumpSize;
            while (iterationIndex > Math.max(targetIteration, 0)) {
                stepBackward();
            }
        }
    }

    function explainIterationStart(iteration, board) {
        const backlogExplanation = board.querySelector(".backlog-column .frame-explanation");
        const doneExplanation = board.querySelector(".done-column .frame-explanation");

        const explanations = [
            `Incoming: ${iteration.arrived}`,
        ];

        if (iteration.rejected) {
            explanations.push(`Rejected: ${iteration.rejected}`);
        }

        backlogExplanation.innerHTML = explanations.join("<br>");
        doneExplanation.innerHTML = "";
    }

    function explainIterationEnd(iteration, board) {
        const backlogExplanation = board.querySelector(".backlog-column .frame-explanation");
        const doneExplanation = board.querySelector(".done-column .frame-explanation");

        const explanations = [
            `Completed: ${iteration.done}`,
        ];

        if (iteration.excess) {
            explanations.push(`Excess capacity: ${iteration.excess}`);
        }

        doneExplanation.innerHTML = explanations.join("<br>");
        backlogExplanation.innerHTML = "";
    }

    function startIteration(backlog, boardSelector, wipLimit) {
        const iteration = backlog[iterationIndex];
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
        const doneColumn = iterationElem();

        board.querySelector(".done-column .iterations").appendChild(doneColumn);

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

    function revertStartIteration(backlog, boardSelector) {
        const iteration = backlog[iterationIndex];
        const prevIteration = backlog[iterationIndex - 1];
        const board = figure.querySelector(boardSelector);
        const backlogColumn = board.querySelector(".backlog-column .items");

        // remove newly arrived items
        for (let i = 0; i < iteration.arrived; i++) {
            backlogColumn.removeChild(backlogColumn.lastChild);
        }

        explainIterationEnd(prevIteration, board);
    }

    function revertEndIteration(backlog, boardSelector) {
        const iteration = backlog[iterationIndex];
        const board = figure.querySelector(boardSelector);
        const backlogColumn = board.querySelector(".backlog-column .items");
        const doneColumn = board.querySelector(".done-column .iterations");

        // add back done to backlog
        for (let i = 0; i < iteration.done; i++) {
            backlogColumn.appendChild(itemElem());
        }

        // add back rejected to backlog
        for (let i = 0; i < iteration.rejected; i++) {
            backlogColumn.appendChild(itemElem("rejected"));
        }

        // remove done iteration
        doneColumn.removeChild(doneColumn.lastChild);

        explainIterationStart(iteration, board);
    }

    [].forEach.call(buttons, button => {
        button.addEventListener("click", advanceFrame);
    });

    stepForward();
})();
