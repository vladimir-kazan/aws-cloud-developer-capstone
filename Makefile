.PHONY: dev
dev:
	yarn --cwd frontend start

.PHONY: serve
serve:
	cd backend && IS_OFFLINE=true npx sls offline start --httpPort 3001

.PHONY: deploy
deploy:
	cd backend && npx sls deploy -v
