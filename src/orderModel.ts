import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrders {
  material: string;
  amount: number;
  currency: string;
  price: number;
  timestamp: Date;
  delivery: {
    first_name: string;
    last_name: string;
    address: {
      street_name: string;
      street_number: string;
      city: string;
    };
  };
}

export const schema = new Schema<IOrders>({
  material: String,
  amount: Number,
  currency: String,
  price: Number,
  timestamp: Date,
  delivery: {
    first_name: String,
    last_name: String,
    address: {
      street_name: String,
      street_number: String,
      city: String,
    },
  },
});

