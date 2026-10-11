const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory array (or connect to a lightweight file/database if needed)
let orders = [];

// GET orders for kitchen & students
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// POST new order from student cart checkout
app.post('/api/orders', (req, res) => {
    const newOrder = req.body;
    orders.unshift(newOrder); // Add to beginning of array
    res.status(201).json({ success: true, order: newOrder });
});

// Kitchen update status endpoint
app.post('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { statusStage } = req.body;
    const order = orders.find(o => o.id === id);
    if (order) {
        order.statusStage = statusStage;
        res.json({ success: true, order });
    } else {
        res.status(404).json({ error: "Order not found" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MCE ByteBites Server running on port ${PORT}`));