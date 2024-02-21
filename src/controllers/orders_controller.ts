import { schema } from '../models/orderModel.js'; // Import the Order model/schema
import mongoose from 'mongoose';
import { promises as fs } from 'fs';
import { ApolloServer, gql } from 'apollo-server-express';


const Order = mongoose.model('Order', schema);
// Define GraphQL schema
export const typeDefs = gql`
  type Order {
    id: ID!
    material: String!
    amount: Int!
    currency: String!
    price: Float!
    timestamp: String!
    delivery: Delivery!
  }

  type Delivery {
    first_name: String!
    last_name: String!
    address: Address!
  }

  type Address {
    street_name: String!
    street_number: String!
    city: String!
  }

  type Query {
    orders: [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    createOrder(input: OrderInput!): Order!
    updateOrder(id: ID!, input: OrderInput!): Order!
    deleteOrder(id: ID!): Order!
    seedDatabase: SeedResponse!
  }

  type SeedResponse {
    orders: OrderSeedResult!
  }

  type OrderSeedResult {
    ids: [ID!]!
    count: Int!
  }

  input OrderInput {
    material: String!
    amount: Int!
    currency: String!
    price: Float!
    timestamp: String!
    delivery: DeliveryInput!
  }

  input DeliveryInput {
    first_name: String!
    last_name: String!
    address: AddressInput!
  }

  input AddressInput {
    street_name: String!
    street_number: String!
    city: String!
  }
`;

// Define resolvers
export const resolvers = {
  Query: {
    orders: async () => {
      return await Order.find();
    },
    order: async (_, { id }) => {
      return await Order.findById(id);
    },
  },
  Mutation: {
    createOrder: async (_, { input }) => {
      const order = new Order(input);
      await order.save();
      return order;
    },
    updateOrder: async (_, { id, input }) => {
      return await Order.findByIdAndUpdate(id, input, { new: true });
    },
    deleteOrder: async (_, { id }) => {
      return await Order.findByIdAndDelete(id);
    },
    seedDatabase: async () => {
      try {
        console.log("Attempting to delete existing orders...");
        await Order.deleteMany(); // Emptying the orders collection

        console.log("Existing orders deleted successfully");

        console.log("Attempting to read data file...");
        let ordersData = await fs.readFile("C:/Users/hashe/Documents/group/ex_6/appolo-server/graphql-server-example/MOCK_DATA_MATERIALS.json", "utf-8");
        console.log("Data file read successfully");

        console.log("Attempting to parse data...");
        let OrdersDataInserted = await Order.insertMany(JSON.parse(ordersData));
        console.log("Data inserted successfully");

        return {
          orders: {
            ids: OrdersDataInserted.map((order) => order._id),
            count: OrdersDataInserted.length,
          },
        };
      } catch (error) {
        console.error("Error seeding data:", error);
        throw new Error("Error seeding data");
      }
    },
  },
};
