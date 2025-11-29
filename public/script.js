// State
let products = [];
let cart = [];

// DOM Elements
const productList = document.getElementById('product-list');
const cartCount = document.getElementById('cart-count');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

// Fetch Products from Backend
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        productList.innerHTML = '<p>Gagal memuat produk.</p>';
    }
}

// Render Products to HTML
function renderProducts(data) {
    productList.innerHTML = data.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="p-info">
                <h3>${product.name}</h3>
                <p class="p-category">${product.category}</p>
                <div class="p-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                <button class="btn-add" onclick="addToCart(${product.id})">
                    <i class="fas fa-plus"></i> Tambah
                </button>
            </div>
        </div>
    `).join('');
}

// Add to Cart Logic
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    updateCartUI();
    toggleCart(true); // Auto open cart
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Update Cart Display
function updateCartUI() {
    cartCount.innerText = cart.reduce((acc, item) => acc + item.qty, 0);
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Keranjang kosong.</p>';
        cartTotalElement.innerText = 'Rp 0';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <small>Rp ${item.price.toLocaleString()} x ${item.qty}</small>
                </div>
                <button onclick="removeFromCart(${item.id})" style="color:red; background:none; border:none; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    cartTotalElement.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

// Toggle Cart Modal
function toggleCart(forceOpen = null) {
    if (forceOpen === true) {
        cartOverlay.classList.add('active');
    } else if (forceOpen === false) {
        cartOverlay.classList.remove('active');
    } else {
        cartOverlay.classList.toggle('active');
    }
}

// Checkout Function (Send to WhatsApp for simplicity)
function checkout() {
    if (cart.length === 0) return alert("Keranjang kosong!");

    let message = "Halo DevStore, saya ingin membeli:%0A";
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.name} (${item.qty}x) - Rp ${(item.price * item.qty).toLocaleString()}%0A`;
        total += item.price * item.qty;
    });

    message += `%0A*Total: Rp ${total.toLocaleString()}*`;

    // Kirim data ke backend juga (opsional untuk logging)
    fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, total })
    })
    .then(res => res.json())
    .then(data => console.log(data.message));

    // Redirect ke WhatsApp
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
}

// Initialize
fetchProducts();
