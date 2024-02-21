import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './controllers/orders_controller.js';
import { orderRoutes } from './routes/order_routes.js';

// Initialize Express app
const app = express();
// Define routes
app.use('/api/orders', orderRoutes); // Mount order routes at '/api/orders'
// Create Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Apply middleware to Express app
server.applyMiddleware({ app });



export default app;
