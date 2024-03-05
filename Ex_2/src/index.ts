import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { readFileSync } from 'fs';
import resolvers from './resolvers/resolvers.js';
import { generateToken, verifyToken} from './auth/auth.js';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
const { Pool } = pkg;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Ex_7_2',
  password: 'admin',
  port: 5432,
});



const secretData = readFileSync('./Secret.json', 'utf-8');
const { secret } = JSON.parse(secretData);

// Initialize Express app
const app = express();
const typeDefs = readFileSync('src/schema/schema.graphql', { encoding: 'utf-8' });
// Create Apollo Server instance

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Extract JWT token from request headers
    const token = req.headers.authorization || '';

    try {
      // Decode JWT token and extract user information
      const user = jwt.verify(token.replace('Bearer ', ''), secret);
      
      // Attach user object to context
      return { user };
    } catch (error) {
      // If token is invalid or missing, return an empty user object
      return { user: null };
    }
  },
});

async function startServer() {
  await server.start();

  // Apply middleware to Express app
  server.applyMiddleware({ app });

  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Call the function to connect to MongoDB and start the server
startServer();