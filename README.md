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
* “Resolve“ antall instanser av et domene et sted, slik at man kan se hvor mange instanser det finnes uten å måtte gå inn på tabellen for hver enkelt.
* Fikse tabellvisning til å være mer brukervennlig
* Lage faktisk skjema for å endre/lage ny instans av et domene -- Delvis løst
* Finne en god løsning på manglende displayName -- Delvis løst
* Gjøre tabellkolonnevalg mer brukervennlig
* Rekkefølge på properties i view at en instans av et domene (kanskje også da i skjema for å opprette ny/endre) <— Disse bør være like
* Generell brukervennlighet
* Forsøke å få applikasjonen til å fungere som bibliotek (kan bli utfordrende med React Router)
* Se litt på dropdownSingle som skal hente fra flere ressurser der løsningen nå er litt lite robust og klarer ikke flere enn 2
* Input valideringer (i første omgang hvertfall sanitering og ting som er påkrevd)
* Generell refactorering av kompliserte funksjoner (gjelder både å trekke ut i mindre funksjoner og forenkling)
