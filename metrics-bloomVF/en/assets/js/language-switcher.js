// Language Switcher for Metrics Bloom
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        // Detecta o idioma baseado na URL atual
        const path = window.location.pathname;
        if (path.includes('/en/')) {
            return 'en';
        }
        return 'pt';
    }

    init() {
        this.createLanguageToggle();
        this.setupEventListeners();
    }

    createLanguageToggle() {
        // Cria o botão de alternância de idioma
        const languageToggle = document.createElement('div');
        languageToggle.className = 'language-toggle';
        languageToggle.innerHTML = `
            <button class="language-toggle__btn" aria-label="Alternar idioma">
                <span class="language-toggle__flag">${this.currentLanguage === 'pt' ? '🇧🇷' : '🇺🇸'}</span>
                <span class="language-toggle__text">${this.currentLanguage === 'pt' ? 'PT' : 'EN'}</span>
            </button>
        `;

        // Adiciona o botão ao header
        const headerContainer = document.querySelector('.header__container');
        if (headerContainer) {
            headerContainer.appendChild(languageToggle);
        }
    }

    setupEventListeners() {
        const toggleBtn = document.querySelector('.language-toggle__btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.switchLanguage();
            });
        }
    }

    switchLanguage() {
        const currentPath = window.location.pathname;
        const currentPage = this.getCurrentPageName();
        
        let newPath;
        if (this.currentLanguage === 'pt') {
            // Mudando para inglês
            newPath = `/en/${currentPage}`;
        } else {
            // Mudando para português
            newPath = `/${currentPage}`;
        }

        // Redireciona para a nova URL
        window.location.href = newPath;
    }

    getCurrentPageName() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop();
        
        // Se não há arquivo específico, assume index.html
        if (!fileName || fileName === '' || fileName === 'en') {
            return 'index.html';
        }
        
        return fileName;
    }
}

// Inicializa o alternador de idiomas quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    new LanguageSwitcher();
});

