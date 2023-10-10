

// const { v4: uuidv4 } = require('uuid');
import express from 'express';
import mongoose, { Error } from 'mongoose';
import {Customer} from './models/customer';
import cors from 'cors';
import { Request, Response } from 'express';

mongoose.set('strictQuery', false);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION : any = process.env.CONNECTION;


app.get('/api/customers', async (req:Request, res:Response) => {
  try {
    const result = await Customer.find();
    res.send({ customers: result });
  } catch (e:any) {
    res.status(500).json({ error: e.message });
    console.log(`ERROR: ${e.message}`);
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the home page!!');
});

app.post('/api/customers', async (req:Request, res:Response) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  try {
    await customer.save();
    res.status(201).json({ customer });
  } catch (e:any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/', (req:Request, res:Response) => {
  res.send('This is a post request!!');
});

app.get('/api/customers/:id', async (req:Request, res:Response) => {
  console.log({
    requestParams: req.params,
    requestQuery: req.query,
  });
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    console.log(customer);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found!' });
    } else {
      res.json({ customer });
    }
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/customers/:id', async (req:Request, res:Response) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.findOneAndReplace(
      { _id: customerId },
      req.body,
      { new: true }
    );
    console.log(result);
    res.json({ customer: result });
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/customers/:id', async (req:Request, res:Response) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.findOneAndUpdate(
      { _id: customerId },
      req.body,
      { new: true }
    );
    console.log(result);
    res.json({ customer: result });
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/orders/:id', async (req:Request, res:Response) => {
  try {
    const orderId = req.params.id;
    req.body._id = orderId;
    const result = await Customer.findOneAndUpdate(
      { 'orders._id': orderId },
      { $set: { 'orders.$': req.body } },
      { new: true }
    );
    console.log(result);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Order not found!" });
    }
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/orders/:id', async (req:Request, res:Response) => {
  try {
    const orderId = req.params.id;
    const result = await Customer.findOne(
      { 'orders._id': orderId }
    );
    console.log(result);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Order not found!"});
    }
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/customers/:id', async (req:Request, res:Response) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({ _id: customerId });
    console.log(result);
    res.json({ deletedCount: result.deletedCount });
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

// console.log(uuidv4());

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);

    app.listen(PORT, () => {
      console.log(`App listening on ${PORT}`);
    });
  } catch (e:any) {
    console.log(`ERROR: ${e.message}`);
  }
};

start();
