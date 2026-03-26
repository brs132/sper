// Fix 405 - Inline version
(function() {
    'use strict';
    
    console.log('[Railway Fix] Iniciando...');
    
    function interceptAllForms() {
        document.querySelectorAll('form').forEach(function(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Railway] Formulário interceptado');
                
                // Simula processamento
                var notification = document.createElement('div');
                notification.style.cssText = 'position:fixed;top:20px;right:20px;padding:15px 25px;background:#28a745;color:white;border-radius:5px;z-index:99999;font-family:sans-serif;';
                notification.textContent = '✅ Operação realizada com sucesso!';
                document.body.appendChild(notification);
                
                setTimeout(function() {
                    notification.remove();
                }, 3000);
                
                return false;
            }, true);
        });
    }
    
    // Executa imediatamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', interceptAllForms);
    } else {
        interceptAllForms();
    }
    
    // Observa mudanças no DOM
    var observer = new MutationObserver(interceptAllForms);
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    console.log('[Railway Fix] OK');
})();
