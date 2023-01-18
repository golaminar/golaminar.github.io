_site: vendor
	bundle exec jekyll build --unpublished

run: _site
	bundle exec jekyll serve --skip-initial-build --no-watch

dev: _site
	bundle exec jekyll serve

vendor:
	bundle install

.PHONY: run _site vendor
