import { Schema, model } from "mongoose";

interface IOrder {
description:string,
priceInDollars?:number
}

interface ICustomer{
  name:string,
  industry?:string,
  orders?:IOrder[]
}

const customerSchema= new Schema<ICustomer>({
  name: {
    type: String,
    required: true,
  },
  industry: String,
  orders: [
    {
      description: String,
      priceInDollars: Number,
    },
  ],
});

export const Customer = model('Customer', customerSchema);
