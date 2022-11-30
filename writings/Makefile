test: clean queue-tests.js backlog-tests.js
	node queue-tests.js
	node backlog-tests.js

queue-tests.js:
	cat tests-header.js calculated-intervals.js  queue-illustrations.js queue-illustration-tests.js > queue-tests.js

backlog-tests.js:
	cat tests-header.js backlog-growth-illustrations.js backlog-behaviour-tests.js > backlog-tests.js

clean:
	touch queue-tests.js backlog-tests.js
	rm queue-tests.js backlog-tests.js

.PHONY: test clean
