# 🚀 Backend SPER Framework

Backend funcional em Node.js/Express para o sistema SPER.

## 📦 Estrutura

```
/
├── api/
│   └── server.js          # Servidor principal
├── package.json           # Dependências
├── Procfile              # Config Railway
├── railway.yaml          # Config avançada
└── api_client.js         # Cliente frontend
```

## 🔧 Instalação Local

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Servidor roda em: http://localhost:3000
```

## 📡 Endpoints da API

### Serviços
```
GET    /api/services          # Lista todos os serviços
GET    /api/status            # Status do sistema
```

### Pedidos
```
POST   /api/order             # Criar pedido
GET    /api/order/:id         # Status do pedido
GET    /api/orders            # Listar todos (admin)
```

### Autenticação
```
POST   /api/auth/register     # Registrar usuário
POST   /api/auth/login        # Login
```

## 💡 Exemplo de Uso

### Criar Pedido
```javascript
fetch('/api/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    service_id: 1,
    link: 'https://instagram.com/usuario',
    quantity: 1000,
    email: 'cliente@email.com'
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

### Resposta
```json
{
  "success": true,
  "message": "Pedido criado com sucesso!",
  "data": {
    "id": "abc123",
    "service_name": "Instagram Seguidores",
    "status": "processing",
    "price": "1.00"
  }
}
```

## 🎯 Funcionalidades

✅ API REST completa  
✅ CORS habilitado  
✅ Banco de dados em memória (simulado)  
✅ Processamento automático de pedidos (30s)  
✅ Status tracking  
✅ Fallback para modo offline  

## 🚀 Deploy no Railway

O backend é deployado automaticamente junto com o frontend:

1. Push para GitHub
2. Railway detecta e faz build
3. API fica disponível em: `https://sua-url.railway.app/api`

## 📊 Dados Simulados

O backend já vem com dados de exemplo:
- 6 serviços (IG, TikTok, YT, FB)
- Preços de R$ 0,50 a R$ 2,00
- Quantidades 50 a 1.000.000

## 🔒 Segurança

- CORS configurado para aceitar todas origens (dev)
- Em produção: restringir origins
- Adicionar autenticação JWT completa
- Implementar rate limiting

## 📝 TODO

- [ ] Conectar com provedor SMM real
- [ ] Implementar pagamentos (Stripe/PayPal)
- [ ] Webhooks para status de entrega
- [ ] Painel admin completo
- [ ] Relatórios e analytics
