# Cloud Capstone Project – Application to create Markdown Notes

[![Build Status](https://travis-ci.com/vladimir-kazan/aws-cloud-developer-capstone.svg?token=zxPyrm14pyehF19ofyyj&branch=master)](https://travis-ci.com/vladimir-kazan/aws-cloud-developer-capstone)

## Markdown Notes with Serverless Design

Application is hosted:
http://notes-markdown-hosting-dev-v1.s3-website-us-east-1.amazonaws.com/

![img/md-notes-login.png](img/md-notes-login.png)
![img/md-notes-page.png](img/md-notes-page.png)

## Setup

1. To run locally please update file `frontend/src/config.ts` and uncomment url pointing to `localhost`
2. To install all packages in all applications (`backend` and `frontend`) run `make install`
3. To run serverless application locally – `make serve`
4. To run frontend application locally `make dev`

## Deployment

Test and deployment is executed automatically using `travis-ci.com` pipeline. Please refer to `.travis.yml` for details.

Manually deployment can be executed with next command:

1. `make deploy` to build and deploy serverless applicaiton.
2. `make deploy-client` to build and deploy frontend application into S3 bucket.

## Elastic Search

Elastic Search is used to execute full-text search.
So it could have some delay before search results are available while DynamoDB does syncronization with Elastic Search

Implementation:

- `backend/src/lambda/http/searchNotes.ts`
- `backend/src/lambda/dynamoDb/elastic-search-sync.ts`
