const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Persistent storage using a local file so orders never get wiped on restart
const ORDERS_FILE = path.join(__dirname, 'orders.json');

function getStoredOrders() {
    try {
        if (fs.existsSync(ORDERS_FILE)) {
            const data = fs.readFileSync(ORDERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Error reading orders file", e);
    }
    return [];
}

function saveStoredOrders(orders) {
    try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    } catch (e) {
        console.error("Error writing orders file", e);
    }
}

// GET orders for kitchen & students
app.get('/api/orders', (req, res) => {
    const orders = getStoredOrders();
    res.json(orders);
});

// POST new order from student cart checkout
app.post('/api/orders', (req, res) => {
    const orders = getStoredOrders();
    const newOrder = req.body;
    orders.unshift(newOrder); // Add to beginning
    saveStoredOrders(orders);
    res.status(201).json({ success: true, order: newOrder });
});

// Kitchen update status endpoint
app.post('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { statusStage } = req.body;
    let orders = getStoredOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
        order.statusStage = statusStage;
        saveStoredOrders(orders);
        res.json({ success: true, order });
    } else {
        res.status(404).json({ error: "Order not found" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MCE ByteBites Server running on port ${PORT}`));