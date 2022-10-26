// Node requires variables to be defined before referencing them
// even if those functions are never called.

let document = {
    querySelector: function () {
        return false;
    },
};

let d3 = {
    select: function () {
        return this;
    },
    selectAll: function () {
        return this;
    },
    data: function () {
        return this;
    },
    enter: function () {
        return this;
    },
    append: function () {
        return this;
    },
    text: function () {
        return this;
    },
    attr: function () {
        return this;
    },
    style: function () {
        return this;
    },
    remove: function () {
        return this;
    },
};