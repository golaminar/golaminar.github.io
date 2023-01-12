_site: vendor
	bundle exec jekyll build

run: _site
	bundle exec jekyll serve --skip-initial-build --no-watch

vendor:
	bundle install

.PHONY: run  
