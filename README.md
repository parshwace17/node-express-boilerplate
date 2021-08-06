# Techuz Boilerplate

Boilerplate by Techuz Infoweb Pvt Ltd (https://www.techuz.com/)

### Scripts

`npm run dev`
- run the app in development mode, app will be reloaded on file changes

`npm run build`
- build the app

`NODE_ENV=dev npm run db:seed`
- seed database

`NODE_ENV=dev npm run db:migrate`
- create or alter database

### If we use knex for migration instead of sequelize then use below commands:
"make-migration": "knex migrate:make",
"make-seed": "knex seed:make",
"db:migrate": "knex migrate:latest",
"rollback": "knex migrate:rollback",
"db:seed": "knex seed:run"

### Debugging

If you need to debug some of your code during development, it's very easy. Open following URL in Chrome: `chrome://inspect/#devices`. Click on `Open dedicated DevTools for Node` => DevTools should open. Use `Ctrl + P` shortcut to find the file you need, for example `Common.controller.ts`. After adding a breakpoint the TypeScript file should be opened directly in devtools.

**Note:** If inspect mode does not work for you, you need to configure ports by clicking on `Configure` button in `chrome://inspect/# devices`. The websocket port through which the inspect mode works is displayed during app launch in the command line ("Debugger listening on ws://127.0.0.1:9229/..."). In this example you need to add `localhost:9229` in `Configure` settings.


### Production deployment example

Clone the repo on any unix (cloud) server. Make a build of the app:

```
npm run build
```

Install [pm2](https://github.com/Unitech/pm2) process manager:

```
yarn add -g pm2
```
Add .env.production

Start the app:

```
pm2 start pm2-process.json
```

App will be started in daemon mode (background). To check the logs of the app issue following command:

```
pm2 logs nameOfTheAppFromPm2
```

You can find the name of the app in `pm2-process.json` file.


## Structure Explaination

We have modular structure here so each module have collection of files like controller,
service and inside each helper we have added interface and validator files.

All models are created in models directory seperately

All configurations, sonstants, db configs, helpers, logger, middleware and some common services are added inside the core directory.

## Docker Installation Guide (We need it to use minio for file upload)

Check below document for docker installtion.
https://docs.google.com/document/d/1J1p-FD2ETFF0JmLqLhd_HShWbla3C_G099VbQXwSE4s/edit

## Mail service
For sending email we have used common mail.js file in which we have compiled hbs tempaltes.

## .env file
Make sure to add env file before you start execution, Add env file based on environment variable, Example: .env.dev

## ORM & Database
Here we have used MySQL Database and Sequelize ORM
Migration and seeds are added for sequelize.
https://sequelize.org/v5/

## Authentication Encryption, Decryption
We have used Crpto to encrypt and decrypt response for secure modules like authentication, we can use same in payment for security purpose
The module we used is doing encryption/decryption of request/response.
We are using browser fingerprint along with JWT token for more security.