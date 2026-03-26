// Backend SPER - API Server
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database simulada (em memória)
const db = {
  users: [],
  orders: [],
  services: [
    { id: 1, name: 'Instagram Seguidores', price: 1.00, min: 100, max: 100000, platform: 'instagram' },
    { id: 2, name: 'Instagram Curtidas', price: 0.50, min: 50, max: 50000, platform: 'instagram' },
    { id: 3, name: 'TikTok Seguidores', price: 1.50, min: 100, max: 50000, platform: 'tiktok' },
    { id: 4, name: 'TikTok Curtidas', price: 0.80, min: 50, max: 100000, platform: 'tiktok' },
    { id: 5, name: 'YouTube Views', price: 2.00, min: 1000, max: 1000000, platform: 'youtube' },
    { id: 6, name: 'Facebook Curtidas', price: 0.60, min: 100, max: 50000, platform: 'facebook' }
  ]
};

// Gerar ID único
const generateId = () => Math.random().toString(36).substring(2, 15);

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  req.user = { id: 1, username: 'admin' }; // Simplificado
  next();
};

// Routes

// 1. Listar serviços
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    data: db.services
  });
});

// 2. Criar pedido
app.post('/api/order', (req, res) => {
  const { service_id, link, quantity, email } = req.body;
  
  const service = db.services.find(s => s.id == service_id);
  if (!service) {
    return res.status(400).json({ success: false, error: 'Serviço não encontrado' });
  }
  
  const order = {
    id: generateId(),
    service_id,
    service_name: service.name,
    link,
    quantity: parseInt(quantity),
    email,
    status: 'processing',
    price: (service.price * quantity / 1000).toFixed(2),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  db.orders.push(order);
  
  // Simular processamento (30s depois muda para completed)
  setTimeout(() => {
    order.status = 'completed';
    order.updated_at = new Date().toISOString();
    console.log(`[Order ${order.id}] Completed`);
  }, 30000);
  
  res.json({
    success: true,
    message: 'Pedido criado com sucesso!',
    data: order
  });
});

// 3. Status do pedido
app.get('/api/order/:id', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Pedido não encontrado' });
  }
  
  res.json({
    success: true,
    data: order
  });
});

// 4. Listar todos os pedidos (admin)
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    count: db.orders.length,
    data: db.orders
  });
});

// 5. Registrar usuário
app.post('/api/auth/register', (req, res) => {
  const { email, login, password, whatsapp } = req.body;
  
  const user = {
    id: generateId(),
    email,
    login,
    password, // Em produção: hash!
    whatsapp,
    balance: 100.00,
    created_at: new Date().toISOString()
  };
  
  db.users.push(user);
  
  res.json({
    success: true,
    message: 'Usuário registrado com sucesso!',
    data: { id: user.id, email: user.email, login: user.login }
  });
});

// 6. Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ success: false, error: 'Credenciais inválidas' });
  }
  
  res.json({
    success: true,
    message: 'Login realizado!',
    token: 'fake-jwt-token-' + user.id,
    data: { id: user.id, email: user.email, login: user.login, balance: user.balance }
  });
});

// 7. Status do sistema
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    stats: {
      users: db.users.length,
      orders: db.orders.length,
      services: db.services.length
    }
  });
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SPER API - Backend Online', version: '1.0.0' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SPER API running on port ${PORT}`);
  console.log(`📊 Stats: ${db.users.length} users, ${db.orders.length} orders`);
});

module.exports = app;
