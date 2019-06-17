# Server for the proud stories mobile app

This repo contains the server for the proud stories [mobile app](https://github.com/proud-stories/proud-stories-backend).

## Background

This app was created in June 2019 by Ania Nakayama, Ben Dyer and Konstantin Schlegel over 2 weeks during the Code Chrysalis Immersive Bootcamp ([Cohort 8](https://medium.com/code-chrysalis/code-chrysalis-cohort-8-student-introductions-ba8980e6c3f8)) as an MVP inspired by [Proud Story](http://proud-story.com/en/homepage/).

## Setup

Setup a bucket on Amazon S3 and a Stripe account. After cloning the repository, install dependencies by running `yarn` and obtain an Adonis APP_KEY by [...]. Finally, create a PostgreSQL database and enter all environment variables as in the `.env.example` file.

To make migrations use

```adonis migration:run``` (Adonis CLI installed)
```node ace migration:run``` (no Adonis CLI)

and for seeds

```adonis seed ---files FILENAME``` (Adonis CLI installed)
```node ace seed --files FILENAME``` (no Adonis CLI)

#### Deployment

To deploy on Heroku, use the Heroku Postgres add-on and install two build packs [link]. Migration is taken care of in the Procfile, but seeding must be done manually. This can be accomplished by opening a bash shell on Heroku

```heroku run bash --app APPNAME```

then running

```ENV_SILENT node ace seed --files UserSeeder.js --force```

and similarly for the other seed files.



Use the adonis command to install the blueprint

```bash
adonis new yardstick
```

or manually clone the repo and then run `npm install`.
