"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const { v4: uuidv4 } = require('uuid');
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const customer_1 = require("./models/customer");
const cors_1 = __importDefault(require("cors"));
mongoose_1.default.set('strictQuery', false);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;
app.get('/api/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield customer_1.Customer.find();
        res.send({ customers: result });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
        console.log(`ERROR: ${e.message}`);
    }
}));
app.get('/', (req, res) => {
    res.send('Welcome to the home page!!');
});
app.post('/api/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const customer = new customer_1.Customer(req.body);
    try {
        yield customer.save();
        res.status(201).json({ customer });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
}));
app.post('/', (req, res) => {
    res.send('This is a post request!!');
});
app.get('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({
        requestParams: req.params,
        requestQuery: req.query,
    });
    try {
        const customerId = req.params.id;
        const customer = yield customer_1.Customer.findById(customerId);
        console.log(customer);
        if (!customer) {
            res.status(404).json({ message: 'Customer not found!' });
        }
        else {
            res.json({ customer });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.put('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const result = yield customer_1.Customer.findOneAndReplace({ _id: customerId }, req.body, { new: true });
        console.log(result);
        res.json({ customer: result });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.patch('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const result = yield customer_1.Customer.findOneAndUpdate({ _id: customerId }, req.body, { new: true });
        console.log(result);
        res.json({ customer: result });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.patch('/api/orders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        req.body._id = orderId;
        const result = yield customer_1.Customer.findOneAndUpdate({ 'orders._id': orderId }, { $set: { 'orders.$': req.body } }, { new: true });
        console.log(result);
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ error: "Order not found!" });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.get('/api/orders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const result = yield customer_1.Customer.findOne({ 'orders._id': orderId });
        console.log(result);
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ error: "Order not found!" });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
app.delete('/api/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.id;
        const result = yield customer_1.Customer.deleteOne({ _id: customerId });
        console.log(result);
        res.json({ deletedCount: result.deletedCount });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
// console.log(uuidv4());
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(CONNECTION);
        app.listen(PORT, () => {
            console.log(`App listening on ${PORT}`);
        });
    }
    catch (e) {
        console.log(`ERROR: ${e.message}`);
    }
});
start();
