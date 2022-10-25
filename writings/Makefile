test: clean tests.js
	node tests.js

tests.js:
	cat tests-header.js calculated-intervals.js  queue-illustrations.js queue-illustration-tests.js > tests.js

clean:
	touch tests.js
	rm tests.js

.PHONY: test clean
