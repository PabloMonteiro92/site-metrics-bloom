// Metrics Bloom - JavaScript Principal

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Função principal de inicialização
function initializeApp() {
    setupScrollAnimations();
    setupSmoothScrolling();
    setupMobileMenu();
    setupFormValidation();
    setupInteractiveElements();
}

// Animações de scroll com Intersection Observer
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos com classe fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
}

// Scroll suave para links internos
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Menu mobile - Implementação completa
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const nav = document.querySelector('.header__nav');
    const header = document.querySelector('.header');
    const body = document.body;
    
    if (!mobileToggle || !nav || !header) return;
    
    let isMenuOpen = false;
    
    // Função para abrir o menu
    function openMenu() {
        isMenuOpen = true;
        header.classList.add('nav-open');
        nav.classList.add('active');
        body.classList.add('nav-open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileToggle.setAttribute('aria-label', 'Fechar menu de navegação');
        
        // Focar no primeiro link do menu para acessibilidade
        const firstLink = nav.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
    }
    
    // Função para fechar o menu
    function closeMenu() {
        isMenuOpen = false;
        header.classList.remove('nav-open');
        nav.classList.remove('active');
        body.classList.remove('nav-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    }
    
    // Toggle do menu ao clicar no botão
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Fechar menu ao clicar em um link de navegação
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Fechar menu ao clicar fora da área de navegação
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !nav.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
            mobileToggle.focus(); // Retornar foco para o botão
        }
    });
    
    // Navegação por teclado dentro do menu
    nav.addEventListener('keydown', function(e) {
        if (!isMenuOpen) return;
        
        const links = nav.querySelectorAll('a');
        const currentIndex = Array.from(links).indexOf(document.activeElement);
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0;
                links[nextIndex].focus();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
                links[prevIndex].focus();
                break;
                
            case 'Home':
                e.preventDefault();
                links[0].focus();
                break;
                
            case 'End':
                e.preventDefault();
                links[links.length - 1].focus();
                break;
        }
    });
    
    // Fechar menu ao redimensionar a janela para desktop
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth > 1023 && isMenuOpen) {
            closeMenu();
        }
    }, 250));
    
    // Prevenir scroll quando menu está aberto
    function preventScroll(e) {
        if (isMenuOpen) {
            e.preventDefault();
        }
    }
    
    // Adicionar listeners para prevenir scroll
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', preventScroll, { passive: false });
}

// Validação de formulários
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });

        // Validação em tempo real
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

// Validar formulário
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Verificar se é obrigatório
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }

    // Validação de email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, insira um email válido.';
        }
    }

    // Validação de telefone
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            isValid = false;
            errorMessage = 'Por favor, insira um telefone válido.';
        }
    }

    // Mostrar/esconder erro
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

// Mostrar erro no campo
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    
    field.parentNode.appendChild(errorDiv);
}

// Limpar erro do campo
function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Elementos interativos
function setupInteractiveElements() {
    // Efeito de hover nos cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Botões com feedback visual
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Efeito ripple
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Infográfico interativo do ciclo de vida do dado
function createDataLifecycleChart() {
    const container = document.getElementById('data-lifecycle-chart');
    if (!container) return;

    const stages = [
        { name: 'Criação', description: 'Dados são gerados e coletados', icon: '📊' },
        { name: 'Retenção', description: 'Armazenamento ativo para uso', icon: '💾' },
        { name: 'Arquivamento', description: 'Movidos para armazenamento de longo prazo', icon: '📦' },
        { name: 'Exclusão', description: 'Remoção segura quando não necessários', icon: '🗑️' }
    ];

    let currentStage = 0;

    function renderChart() {
        container.innerHTML = `
            <div class="lifecycle-chart">
                <div class="lifecycle-stages">
                    ${stages.map((stage, index) => `
                        <div class="lifecycle-stage ${index === currentStage ? 'active' : ''}" 
                             data-stage="${index}">
                            <div class="stage-icon">${stage.icon}</div>
                            <h4>${stage.name}</h4>
                            <p>${stage.description}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="lifecycle-controls">
                    <button onclick="previousStage()">← Anterior</button>
                    <button onclick="nextStage()">Próximo →</button>
                </div>
            </div>
        `;
    }

    window.nextStage = function() {
        currentStage = (currentStage + 1) % stages.length;
        renderChart();
    };

    window.previousStage = function() {
        currentStage = currentStage === 0 ? stages.length - 1 : currentStage - 1;
        renderChart();
    };

    renderChart();

    // Auto-avançar a cada 5 segundos
    setInterval(() => {
        nextStage();
    }, 5000);
}

// Utilitários
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance - lazy loading de imagens
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Inicializar lazy loading quando disponível
if ('IntersectionObserver' in window) {
    setupLazyLoading();
}

// Exportar funções para uso global
window.MetricsBloom = {
    createDataLifecycleChart,
    validateForm,
    debounce
};

