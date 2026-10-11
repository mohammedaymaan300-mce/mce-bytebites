const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

let orders = [];

app.post('/api/orders', (req, res) => {
    const newOrder = req.body;
    orders.unshift(newOrder);
    console.log(`>>> ORDER RECEIVED: ID ${newOrder.id} - ₹${newOrder.total}`);
    res.json({ success: true, order: newOrder });
});

app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.post('/api/orders/status', (req, res) => {
    const { id, statusStage } = req.body;
    const order = orders.find(o => o.id === id);
    if (order) {
        order.statusStage = statusStage;
        console.log(`>>> ORDER ${id} STATUS UPDATED -> Stage ${statusStage}`);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`MCE ByteBites Production Server is LIVE on http://localhost:${PORT}`);
});