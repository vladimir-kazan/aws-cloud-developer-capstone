.PHONY: dev
dev:
	yarn --cwd frontend start

.PHONY: serve
serve:
	cd backend && IS_OFFLINE=true sls offline start --httpPort 3001
