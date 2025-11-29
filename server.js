const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Data Dummy Produk (Bisa diganti database nanti)
const products = [
    { id: 1, name: "Website Landing Page", price: 500000, category: "Service", image: "https://via.placeholder.com/300/09f/fff?text=Landing+Page" },
    { id: 2, name: "Source Code E-Commerce", price: 150000, category: "Code", image: "https://via.placeholder.com/300/e91e63/fff?text=E-Commerce+Code" },
    { id: 3, name: "UI/UX Design Kit", price: 75000, category: "Asset", image: "https://via.placeholder.com/300/4caf50/fff?text=UI+Kit" },
    { id: 4, name: "Bot WhatsApp Node.js", price: 200000, category: "Code", image: "https://via.placeholder.com/300/ff9800/fff?text=WA+Bot" }
];

// API: Ambil semua produk
app.get('/api/products', (req, res) => {
    res.json(products);
});

// API: Simulasi Checkout
app.post('/api/checkout', (req, res) => {
    const { cart, total } = req.body;
    console.log('Order diterima:', cart);
    // Di sini logika database atau payment gateway disimpan
    res.json({ status: 'success', message: `Terima kasih! Total pembayaran: Rp ${total.toLocaleString()}` });
});

// Route Utama
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
