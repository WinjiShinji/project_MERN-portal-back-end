# Project - Express Users Portal

## Objective Summary
The objective of this project is to build a Full-Stack web-portal.

This web-portal will be able to handle multiple users login Events
with secure authentication and authorization, achieved through the use of bcrypt and JWT.

Data will be managed through the use of the MVC principles, using Mongoose & MongoDB for the data handling aspect of the project.

React will be used for the Front-End, with axios handling endpoint requests.


### Requirements
- Error Logging.
- DB connection.
- Multiple user accounts.
- Admin Roles with ability to add/remove users.
- Route Handling.
- Protected Routes.
- Authentication.
- Authorization.
- JWT Tokens.

## Process
### Back-End
- Install Back-End Dependencies:
  Express.js, cors, dotenv, b-crypt, 
  MongoDB, Mongoose.

- Setup Basic Express server environment:
  server.js, routing, middleware, JSON, etc...

- Setup CORS.
- Setup MongoDB & Mongoose.

- Mongoose:
  models, Schema...

- CRUD Operations:
  Controllers for Read, Write, Update & Delete.

- Security:
  Bcrypt, JWTs, Roles, Protected Routes.
  Authorization & Authentication.

- Admin Controls:
  Authorized CRUD operations for Admins.

### Front-End
- Install Front-End Dependencies:
  React, React-dom, React-router-dom,
  React-Icons, Axios, SASS.

- Axios used to manage requests to Back-End endpoints.

- Axios Interceptors & SessionStorage are used to manage authTokens/persist login.

- Context with Reducers used to track state change.

- Admin controls.