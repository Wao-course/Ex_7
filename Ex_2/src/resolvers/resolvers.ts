import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Ex_7_2',
  password: 'admin',
  port: 5432,
});

// Read secret key from file
const readSecretKey = async () => {
  const secretData = await fs.readFileSync('./Secret.json', 'utf-8');
  return JSON.parse(secretData).secret;
};

const isAuthenticated = (context) => {
  if (!context.user) {
    throw new Error('You must be logged in to perform this action');
  }
};

const resolvers = {
  Query: {
    orders: async (_, __, context) => {
      isAuthenticated(context);
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM orders');
        return result.rows;
      } finally {
        client.release();
      }
    },
    order: async (_, { id }, context) => {
      isAuthenticated(context);
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
        return result.rows[0];
      } finally {
        client.release();
      }
    },
    users: async (_, __, context) => {
      isAuthenticated(context);
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM users');
        return result.rows;
      } finally {
        client.release();
      }
    },
  },
  Mutation: {
    registerUser: async (_, { user }) => {
      const { username, password } = user;
      const hashedPassword = await bcrypt.hash(password, 10);
      const client = await pool.connect();
      try {
        await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        return 'User registered successfully';
      } finally {
        client.release();
      }
    },
    loginUser: async (_, { user }) => {
      const { username, password } = user;
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
          throw new Error('User not found');
        }
        const existingUser = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
        const token = jwt.sign({ userId: existingUser.id }, await readSecretKey(), { expiresIn: '5h' });
        return token;
      } finally {
        client.release();
      }
    },
    createOrder: async (_, { input }, context) => {
      isAuthenticated(context);
      const client = await pool.connect();
      try {
        const result = await client.query('INSERT INTO orders (material, amount, currency, price, timestamp, delivery) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [
          input.material,
          input.amount,
          input.currency,
          input.price,
          input.timestamp,
          input.delivery,
        ]);
        return result.rows[0];
      } finally {
        client.release();
      }
    },
    updateOrder: async (_, { id, input }, context) => {
      isAuthenticated(context);
      const client = await pool.connect();
      try {
        const result = await client.query('UPDATE orders SET material = $1, amount = $2, currency = $3, price = $4, timestamp = $5, delivery = $6 WHERE id = $7 RETURNING *', [
          input.material,
          input.amount,
          input.currency,
          input.price,
          input.timestamp,
          input.delivery,
          id,
        ]);
        return result.rows[0];
      } finally {
        client.release();
      }
    },
    deleteOrder: async (_, { id }, context) => {
      isAuthenticated(context);
      const client = await pool.connect();
      try {
        const result = await client.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
      } finally {
        client.release();
      }
    },
    seedDatabase: async () => {
      try {
        const ordersDataRaw = await fs.readFileSync("C:/Users/hashe/Documents/group/ex_6/appolo-server/graphql-server-example/MOCK_DATA_MATERIALS.json", "utf-8");
        const ordersData = JSON.parse(ordersDataRaw); // Parse the JSON string into an object

        const client = await pool.connect();
        try {
          await client.query('DELETE FROM orders'); // Emptying the orders table
          const result = await client.query('INSERT INTO orders (material, amount, currency, price, timestamp, delivery) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [
            ordersData.material,
            ordersData.amount,
            ordersData.currency,
            ordersData.price,
            ordersData.timestamp,
            ordersData.delivery,
          ]);
          return {
            orders: {
              ids: result.rows.map(order => order.id),
              count: result.rowCount,
            },
          };
        } finally {
          client.release();
        }
      } catch (error) {
        console.error("Error seeding data:", error);
        throw new Error("Error seeding data");
      }
    },
  },
};

export default resolvers;
