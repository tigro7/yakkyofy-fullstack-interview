# Yakkyofy interview

This a starter repository with a base project structure.

You'll need to setup a local MongoDB and RabbitMQ server to get started.

## What's inside?

This turborepo uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `client`: a [Vue.js](https://vuejs.org/) app - `port: 8080 `
- `server`: Nodejs & Express Server - `port: 3000`
- `consumer`: Nodejs app connected to the server via RabbitMQ
- `models`: MongoDB models used throughout the monorepo
- `types`: TS types and declarations used throughout the monorepo

## What you need to do

We're looking for a user authentication + CRUD. The customer deletion must be performed in a separate service with a queue.

### Client

- Login page.
- Signup page.
- Profile page (protected with vue router middleware).
- 404 page.

### Server

- User MongoDB Model
- User CRUD endpoints
- Authentication endpoints
- Authentication middleware
- Communicate with the consumer for the deletion of an User (Delete endpoint)

### Consumer

- Consume queue messages for user deletion

## Development guide

### App-specific commands

To run a command exclusively in one app (ex: installing a dependency, developing a single app)

```
yarn workspace <app name> <command>
```

Important: `app name` equals to the name in the package.json

### Build

To build all apps and packages, run the following command:

```
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
yarn run dev
```

## Useful Links

- [Turborepo](https://turborepo.org/docs)
