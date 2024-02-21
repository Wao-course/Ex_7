import express from 'express';
import { resolvers } from '../controllers/orders_controller.js'; // Import resolver functions

// its only needed to import the resolvers from the controller file
// which means that they are only needed for the restfull api endpoints.
// Initialize Express router
const router = express.Router();

// Define routes for orders
router.get('/', async (req, res) => {
  const orders = await resolvers.Query.orders();
  res.json(orders);
}); // GET all orders

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const order = await resolvers.Query.order(null, { id });
  res.json(order);
}); // GET order by ID

router.post('/', async (req, res) => {
  const { input } = req.body;
  const order = await resolvers.Mutation.createOrder(null, { input });
  res.json(order);
}); // POST a new order

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { input } = req.body;
  const order = await resolvers.Mutation.updateOrder(null, { id, input });
  res.json(order);
}); // PUT update order by ID

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const order = await resolvers.Mutation.deleteOrder(null, { id });
  res.json(order);
}); // DELETE order by ID

// Export router
export { router as orderRoutes };
