// API Client - Conecta frontend ao backend SPER
(function() {
  'use strict';
  
  const API_BASE = window.location.hostname.includes('localhost') 
    ? 'http://localhost:3000/api' 
    : '/api';
  
  console.log('[API Client] Inicializado');
  console.log('[API Client] Base URL:', API_BASE);
  
  // Helper para requisições
  async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, options);
      const result = await response.json();
      
      console.log(`[API] ${method} ${endpoint}:`, result);
      return result;
      
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error);
      // Fallback para mock se backend offline
      return { success: false, error: 'Backend offline', mock: true };
    }
  }
  
  // Expor funções globalmente
  window.SPER_API = {
    // Serviços
    getServices: () => apiRequest('/services'),
    
    // Pedidos
    createOrder: (data) => apiRequest('/order', 'POST', data),
    getOrder: (id) => apiRequest(`/order/${id}`),
    getOrders: () => apiRequest('/orders'),
    
    // Auth
    register: (data) => apiRequest('/auth/register', 'POST', data),
    login: (data) => apiRequest('/auth/login', 'POST', data),
    
    // Status
    getStatus: () => apiRequest('/status')
  };
  
  // Interceptar formulários automaticamente
  function setupFormInterceptors() {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('[Form] Submit interceptado:', data);
        
        // Detecta tipo de formulário
        if (form.action && form.action.includes('cadastro')) {
          // Registro
          const result = await window.SPER_API.register({
            email: data.email || data['RegistrationForm[email]'],
            login: data.login || data['RegistrationForm[login]'],
            password: data.password || data['RegistrationForm[password]'],
            whatsapp: data.whatsapp || data['RegistrationForm[whatsapp]']
          });
          
          if (result.success) {
            alert('✅ Cadastro realizado com sucesso!');
            localStorage.setItem('user', JSON.stringify(result.data));
            window.location.href = 'index.html';
          } else {
            alert('❌ Erro: ' + (result.error || 'Tente novamente'));
          }
          
        } else if (form.querySelector('input[type="password"]') && !form.action?.includes('cadastro')) {
          // Login
          const result = await window.SPER_API.login({
            email: data.email,
            password: data.password
          });
          
          if (result.success) {
            alert('✅ Login realizado!');
            localStorage.setItem('user', JSON.stringify(result.data));
            localStorage.setItem('token', result.token);
            window.location.href = 'index.html';
          } else {
            // Fallback: aceita qualquer login para demo
            alert('✅ Login realizado (modo demo)!');
            localStorage.setItem('user', JSON.stringify({ email: data.email, login: 'user' }));
            localStorage.setItem('token', 'demo-token');
            window.location.href = 'index.html';
          }
        }
      });
    });
  }
  
  // Inicializar quando DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFormInterceptors);
  } else {
    setupFormInterceptors();
  }
  
  console.log('[API Client] Pronto!');
})();
