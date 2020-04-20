.PHONY: dev
dev:
	yarn --cwd frontend start

.PHONY: serve
serve:
	cd backend && IS_OFFLINE=true npx sls offline start --httpPort 3001

.PHONY: clean-build
clean-build:
	rm -rf backend/.build

.PHONY: deploy
deploy: clean-build
	cd backend && npx sls deploy -v
