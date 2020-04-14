.PHONY: dev
dev:
	yarn --cwd frontend start

.PHONY: serve
serve:
	cd backend && sls offline start --httpPort 3001
