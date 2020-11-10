# dapla-metadata-explorer
[![Build Status](https://dev.azure.com/statisticsnorway/Dapla/_apis/build/status/Frontends/statisticsnorway.dapla-metadata-explorer?branchName=master)](https://dev.azure.com/statisticsnorway/Dapla/_build/latest?definitionId=21&branchName=master)

This application is built for in-house use in Statistics Norway and it aims to create a user interface against various 
metadata exploration services such as 
[exploration-lds](https://github.com/statisticsnorway/dapla-project/blob/master/localstack/docker-compose-exploration.yml).
Its eventual goal is to replace [linked-data-store-client](https://github.com/statisticsnorway/linked-data-store-client).

Functionality includes:
* Listing, browsing and exploring metadata
* Creating, editing and deleting metadata

### Try this application locally
The first time you clone the repository, remember to run `yarn install`.

Run `yarn start` and navigate to `http://localhost:3000`.

`yarn test` runs all tests and `yarn coverage` calculates (rather unreliably) test coverage.

### Docker locally
* `yarn build`
* `docker build -t dapla-metadata-explorer .`
* `docker run -p 8000:80 dapla-metadata-explorer:latest`
  * Alternatively with custom environment variables: `docker run -p 8000:80 -e REACT_APP_EXPLORATION_LDS=http://localhost:29090 dapla-metadata-explorer:latest`
* Navigate to `http://localhost:8000`

**Note** that this application requires [dapla-project localstack](https://github.com/statisticsnorway/dapla-project/blob/master/localstack/README.md)
running to function locally (or atleast a running instance of [linked-data-store](https://github.com/statisticsnorway/linked-data-store-documentation)).

### TODO
* Show the number instances of a domain stored in LDS
* User friendlier table
* Make form for editing
* Input validations
* General refactoring (smaller functions)
* Write tests
