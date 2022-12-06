test: clean tests.js
	node tests.js

tests.js:
	cat test-helpers.js tests-header.js calculated-intervals.js illustration-helpers.js  queue-illustrations.js backlog-growth-illustrations.js queue-illustration-tests.js backlog-behaviour-tests.js > tests.js

clean:
	touch tests.js
	rm tests.js

.PHONY: test clean
