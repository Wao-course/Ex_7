# Lecture 07 Excercises

## Exercise 1 - Resolvers without database

### Lab 1.1

Clone the demo <https://gitlab.au.dk/swwao/demo-projs/graphql/graphql-resolvers.git> and get it running on your computer.

### Lab 1.2

Implement the field-arguments demo, but with use of a text based schema.

## Exercise 3 - Run PostgreSQL in a container

### Lab 3.1

1. Start PostgreSQL in a container - I suggest that you use <https://github.com/docker/awesome-compose/tree/master/postgresql-pgadmin>.
2. Use pgAdmin 4 <https://www.pgadmin.org/docs/pgadmin4/6.20/index.html> to connect to your PostgreSQL database. Setup a new database with a table (just some simple fields for a test run), and populate it with some data.
3. Make a simple Node project that connect to your PostgreSQL DB, and read some data. You may get some help here: <https://node-postgres.com/>

## Exercise 3 - Implement a GraphQL server

### Lab 3.1

Use Node, express and **PostgreSQL** to create a server that implements the GraphQL schema defined in lab 06-3.1 and test the server with graphiQL and Postman.
