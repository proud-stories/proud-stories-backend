# Server for the proud stories mobile app

This repo contains the backend API for the proud stories [mobile app](https://github.com/proud-stories/proud-stories-backend).

## Background

This app was created in June 2019 by Ania Nakayama, Ben Dyer and Konstantin Schlegel over 2 weeks during the Code Chrysalis Immersive Bootcamp ([Cohort 8](https://medium.com/code-chrysalis/code-chrysalis-cohort-8-student-introductions-ba8980e6c3f8)) as an MVP inspired by [Proud Story](http://proud-story.com/en/homepage/).

## Dependencies

We use AdonisJs with a PostgreSQL database. Videos are stored as links to our AWS S3 bucket, and we also use Stripe for payment and Auth0 for login/authorization.

## Setup

Setup an S3 bucket on AWS and a Stripe account. After cloning the repository, install dependencies by running `yarn` and obtain an Adonis APP_KEY by [...]. Finally, create a PostgreSQL database and enter all environment variables as in the `.env.example` file.

To make migrations use

```adonis migration:run``` (Adonis CLI installed) <br>
```node ace migration:run``` (no Adonis CLI)

and for seeds

```adonis seed ---files FILENAME``` (Adonis CLI installed)<br>
```node ace seed --files FILENAME``` (no Adonis CLI)

#### Deployment

To deploy on Heroku, use the Heroku Postgres add-on and install two build packs [link]. Migration is taken care of in the Procfile, but seeding must be done manually. This can be accomplished by opening a bash shell on Heroku

```heroku run bash --app APPNAME```

then running

```ENV_SILENT=true node ace seed --files UserSeeder.js --force```

and similarly for the other seed files.

#### Testing

Tests for each endpoint are written using the Adonis HTTP client and can be run with `adonis test`.

#### Continuous Integration

We used CircleCI for integration. To give CircleCI access to an Heroku Postgres resource one needs add a query string to Heroku's DATABASE_URL for the CircleCI workflow's DATABASE_URL.

```jdbc:<DATABASE_URL>?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory```

## API

The following endpoints are available.

GET,POST ```/users/```

GET ```/users/:id```

GET ```/users/:id/videos```

POST ```/upload```

GET ```/users/:id/feed```

GET ```/users/:id/balance```

GET ```/users/:id/transactions```

POST ```/transactions```

GET,PATCH,DELETE ```/videos/:id```

POST ```/videos/:id/likes```

GET,POST,PATCH,DELETE ```/videos/:id/comments```

GET ```/categories```

POST ```/api/doPayment``` (stripe endpoint)
