.PHONY: dev
.PHONY: clean
clean:
	rm -rf backend/node_modules
	rm -rf backend/.dynamodb
	rm -rf backend/.build
	rm -rf frontend/node_modules

.PHONY: install
install:
	yarn --cwd frontend install
	npm --prefix backend install -d
	cd backend && npx sls dynamodb install

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
