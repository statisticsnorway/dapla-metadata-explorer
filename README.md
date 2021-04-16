# dapla-metadata-explorer

[![Build Status](https://dev.azure.com/statisticsnorway/Dapla/_apis/build/status/Frontends/statisticsnorway.dapla-metadata-explorer?branchName=master)](https://dev.azure.com/statisticsnorway/Dapla/_build/latest?definitionId=21&branchName=master)

This application is built for in-house use in Statistics Norway and it aims to create a user interface against various
metadata exploration services such as
[exploration-lds](https://github.com/statisticsnorway/dapla-project/blob/master/localstack/docker-compose-exploration.yml)
and
[concept-lds](https://github.com/statisticsnorway/dapla-project/blob/master/localstack/docker-compose-concept.yml).

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
* `docker run -p 8000:8180 dapla-metadata-explorer:latest`
    * Alternatively with custom environment
      variables: `docker run -p 8000:8180 -e REACT_APP_EXPLORATION_LDS=http://localhost:29090 dapla-metadata-explorer:latest`
* Navigate to `http://localhost:8000`

**Note** that this application
requires [dapla-project localstack](https://github.com/statisticsnorway/dapla-project/blob/master/localstack/README.md)
running to function locally (or at least a running instance
of [linked-data-store](https://github.com/statisticsnorway/linked-data-store-documentation)).

### TODO

* Input validations
* General refactoring (smaller functions, code smells, etc.)
* Table pagination (or table data based on which user is logged in)
* Conveniently show the number of instances of a domain (requires updates to backend)
* Horizontal scrolling of the domain tables
