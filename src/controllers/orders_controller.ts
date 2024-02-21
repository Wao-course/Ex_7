import { schema } from '../models/orderModel.js'; // Import the Order model/schema
import { user_schema } from '../models/userModel.js'; // Import the Order model/schema

import mongoose from 'mongoose';
import { promises as fs } from 'fs';
import { ApolloServer, gql } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const Order = mongoose.model('Order', schema);
const User = mongoose.model('User', user_schema);

// Read the JSON file containing the secret
const secretData = await fs.readFile('./Secret.json', 'utf-8');
const { secret } = JSON.parse(secretData);

// Define resolvers
export const resolvers = {
  Query: {
    //orders queries 
    orders: async () => {
      return await Order.find();
    },
    order: async (_, { id }) => {
      return await Order.findById(id);
    },

    //user queries
    loginUser: async (_, { user }) => {
      const { username, password } = user;
  
      // Find the user by username
      const existingUser = await User.findOne({ username }).select('+password');
      if (!existingUser) {
        throw new Error('User not found');
      }
      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      console.log("User logged in successfully");
      // Generate JWT token
      const token = jwt.sign({ id: existingUser._id }, secret, { expiresIn: '1h' });
      
      return token;
    },
    users: async () => {
      return await User.find();
    },
  },

  Mutation: {
    //user mutations
    registerUser: async (_, { user }) => {
      const { username, password } = user;
      console.log("Attempting to create a user...");
  
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          console.log("User already exists");
          throw new Error('Username is already taken');
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
  
        console.log("User registered successfully");
        return 'User registered successfully';
      } catch (error) {
        console.error("Error registering user:", error);
        throw error;
      }
    },

  
    //orders resolvers

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
