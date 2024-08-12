# Accommodation Search

## Technical Coding Test

This project has a simple setup with an api, hooked up to MongoDB and a frontend piece initiated with [vite](https://vitejs.dev/).

## Install and run

From the project root:

```
npm install
```

### Run

Once install has finished, you can use the following to run both the API and UI:

```
npm run start
```

### API

To run the API separately, navigate to the `./packages/api` folder

```
$ cd packages/api
```

And run the `api` server with

```
$ npm run dev
```

The API should start at http://localhost:3001

### Client

To run the `client` server separately, navigate to the `./packages/client` folder

```
$ cd ./packages/client
```

And run the `client` with

```
$ npm run start
```

The UI should start at http://localhost:3000

### Database connection & environment variables

By default, the code is set up to start and seed a MongoDB in-memory server, which should be sufficient for the test. The database URL will be logged on startup, and the seed data can be found at ./packages/api/db/seeds.

If this setup does not work for you or if you prefer to use your own MongoDB server, you can create a .env file. In the ./packages/api folder, create a .env file (or rename the existing .env.sample) and fill in the environment variables.

## Task at hand

When the project is up and running, you should see a search-bar on the screen. This one is currently hooked up to the `/hotels` endpoint.
When you type in a partial string that is part of the name of the hotel, it should appear on the screen.
Ie. type in `resort` and you should see some Hotels where the word `resort` is present.

You will also see 2 headings called **"Countries"** and **"Cities"**.

The assignment is to build a performant way to search for Hotels, Cities or Countries.
Partial searches will be fine. Hotels will need to filterable by location as well.
Ie. The search `uni` should render

- Hotels that are located in the United States, United Kingdom or have the word `uni` in the hotel name.
- Countries that have `uni` in their name Ie. United States, United Kingdom
- No Cities as there is no match

Clicking the close button within the search field should clear out the field and results.

When clicking on one of the `Hotels`, `Cities` or `Countries` links, the application should redirect to the relevant page and render the selected `Hotel`, `City` or `Country` as a heading.

<img src="./assets/search-example.png" width="400px" />

### Write-up

<!-- Write-up/conclusion section -->
### Welcome to my solution!

### A few things to note before you get started:
I have made two branches - ```main``` and ```typesense``` <br>
The main branch uses a mongodb aggregation + indexing + redis caching system to make searches more performant <br>
The typesense branch uses typesense which is great for partial or full text searches, at scale it is more performant than my initial approach <br> <br>

I did this in case you are testing for mongodb aggregation or query optimisation skills, if not the typesense version at scale is more oerformant<br><br>

Please switch to which ever branch is more suited to your interests or assessments, thank you. <br>
Also, I have shared some secrets for my Typesense cloud instance via email to Alana in case you wish to test out the Typesense branch

### More things to note:
1. Run unit + integration tests on the ```api``` package with ```npm run test```
2. Run unit + integration tests on the ```client``` package with ```npm run test```
3. Run the E2E test on the ```client``` package with ```npm run test:e2e```, make sure to first run ```npm run test:e2e:install``` if you don't have playwright/chromium installed

### Things I would have loved to do with more time:
1. Deploy everything to AWS and load up the DB with like 100k+ records or so in order to assess and fix more performance bottlenecks
2. Finish up the last minute tests on the client package in the Typesense branch.
3. Setup a github action to run my E2E tests on push and then auto deploy to AWS.
4. Do a much better job on the accessibility of the search box component.

### I no longer have a lot of observations because i took care of the ones I could find eg:
1. Caching on both client and server-side
2. Query optimisation (aggregations + indexing) for the search
3. Loading state + Error states
4. 404 page and redirecting users when they use a wrong id for hotel, city or country pages
5. Lots of testing - 100% coverage everywhere (except that last test in the typesense branch 😔)
<br>

Thank you!


_When all the behaviour is implemented, feel free to add some observations or conclusions you like to share in the section_

### Database structure

#### Hotels Collection

```json
[
  {
    "chain_name": "Samed Resorts Group",
    "hotel_name": "Sai Kaew Beach Resort",
    "addressline1": "8/1 Moo 4 Tumbon Phe Muang",
    "addressline2": "",
    "zipcode": "21160",
    "city": "Koh Samet",
    "state": "Rayong",
    "country": "Thailand",
    "countryisocode": "TH",
    "star_rating": 4
  },
  {
    /* ... */
  }
]
```

#### Cities Collection

```json
[
  { "name": "Auckland" },
  {
    /* ... */
  }
]
```

#### Countries Collection

```json
[
  {
    "country": "Belgium",
    "countryisocode": "BE"
  },
  {
    /* ... */
  }
]
```
