import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { connectToDatabase } from './mongoDb.js';
import { readFileSync } from 'fs';
import { resolvers } from './controllers/orders_controller.js';

// Initialize Express app
const app = express();
const typeDefs = readFileSync('src/schema/schema.graphql', { encoding: 'utf-8' });
// Create Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

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
connectToDatabase().then(startServer).catch(error => console.error('Error connecting to MongoDB:', error));
