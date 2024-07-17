# Softball League Backend

This project is a backend application for managing a softball league, built using the NestJS framework.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

To install the dependencies, run:

```bash
$ yarn install
```

## Running the app

To run the application in different modes, use the following commands:

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

To run tests, use the following commands:

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

### Deployment

### Deploying to Heroku

1. **Install Heroku CLI**:
   Download and install the Heroku CLI from [here](https://devcenter.heroku.com/articles/heroku-cli).

2. **Login to Heroku**:
   Open your terminal and log in to Heroku:
   ```bash
   heroku login
   ```

3. **Create a Heroku App** (only once):
   Navigate to your project directory and create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

4. **Add a `Procfile`**:
   Create a `Procfile` in the root of your project directory. This file tells Heroku how to run your application.
   ```Procfile
   web: yarn start:prod
   ```

5. **Set Up Environment Variables**:
   If your application requires environment variables, you can set them using the Heroku CLI:
   ```bash
   heroku config:set KEY=VALUE
   ```

6. **Commit Your Code**:
   Make sure all your changes are committed to your Git repository:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   ```

7. **Deploy to Heroku**:
   Push your code to Heroku:
   ```bash
   git push heroku main
   ```

8. **Open Your App**:
   Once the deployment is complete, you can open your app in the browser:
   ```bash
   heroku open
   ```

### Publishing New Versions

To publish new versions of your application to Heroku, follow these steps:

1. **Make Changes**:
   Make the necessary changes to your codebase.

2. **Commit Changes**:
   Commit your changes to your Git repository:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

3. **Deploy to Heroku**:
   Push your changes to Heroku:
   ```bash
   git push heroku main
   ```

4. **Verify Deployment**:
   Open your app to verify that the new version is running correctly:
   ```bash
   heroku open
   ```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).