/* ========================================NAVEGAÇÃO E SCROLL SUAVE======================================== */

// Smooth scrolling para links âncora
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

// Efeito da navbar no scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.borderBottom = '1px solid rgba(0, 255, 255, 0.2)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.borderBottom = '1px solid rgba(0, 255, 255, 0.1)';
    }
});

/* ========================================HIGHLIGHT DO LINK ATIVO NA NAVEGAÇÃO======================================== */

// Destaque do link de navegação ativo
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

/* ========================================INTERSECTION OBSERVER PARA ANIMAÇÕES======================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.skill-category, .project-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

/* ========================================EFEITO DE DIGITAÇÃO NO TERMINAL======================================== */

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.innerHTML += '<span class="terminal-cursor"></span>';
        }
    }
    type();
}

// Inicializar efeito de digitação quando a página carregar
window.addEventListener('load', () => {
    const roleElement = document.querySelector('.role');
    if (roleElement) {
        setTimeout(() => {
            typeWriter(roleElement, '$ ./developer --fullstack', 80);
        }, 1000);
    }
});

/* ========================================EFEITO GLITCH NO LOGO======================================== */

const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('mouseenter', () => {
        logo.style.textShadow = '2px 0 #ff0000, -2px 0 #00ffff, 0 0 10px #00ffff';
        logo.style.animation = 'glitch 0.3s ease-in-out';
    });
    
    logo.addEventListener('mouseleave', () => {
        logo.style.textShadow = 'none';
        logo.style.animation = 'none';
    });
}

/* ======================================== CARREGADOR DE PROJETOS DO GITHUB======================================== */

async function loadGitHubProjects() {
    const username = 'danyel-oliveira';
    const loadButton = document.getElementById('loadProjects');
    const spinner = document.getElementById('loadingSpinner');
    const projectsGrid = document.getElementById('projectsGrid');

    // Mostrar estado de carregamento
    loadButton.style.display = 'none';
    spinner.style.display = 'block';

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar repositórios');
        }

        const repos = await response.json();
        
        // Filtrar repositórios - remover forks e repo do perfil
        const filteredRepos = repos.filter(repo => 
            !repo.fork && 
            repo.name !== username &&
            repo.name !== `${username}.github.io`
        );

        // Limpar projetos existentes
        projectsGrid.innerHTML = '';

        if (filteredRepos.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fab fa-github"></i>
                    <h3>Nenhum projeto encontrado</h3>
                    <p>Seus repositórios aparecerão aqui automaticamente</p>
                </div>
            `;
        } else {
            filteredRepos.forEach(repo => {
                const projectCard = createProjectCard(repo);
                projectsGrid.appendChild(projectCard);
            });
        }

        // Esconder loading, mostrar botão de atualizar
        spinner.style.display = 'none';
        loadButton.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar Projetos';
        loadButton.style.display = 'inline-block';

    } catch (error) {
        console.error('Erro:', error);
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro ao carregar projetos</h3>
                <p>Verifique sua conexão e tente novamente</p>
            </div>
        `;
        spinner.style.display = 'none';
        loadButton.style.display = 'inline-block';
    }
}

/* ========================================CRIAÇÃO DE CARDS DE PROJETO======================================== */

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Determinar ícone baseado na linguagem ou nome do repo
    const icon = getProjectIcon(repo.language, repo.name);
    
    // Formatar data
    const lastUpdate = new Date(repo.updated_at).toLocaleDateString('pt-BR');
    
    // Obter linguagem principal e tópicos
    const language = repo.language || 'Code';
    const topics = repo.topics || [];
    
    card.innerHTML = `
        <div class="project-header">
            <div class="project-icon">
                <i class="${icon}"></i>
            </div>
            <div class="project-title">${repo.name.replace(/-/g, ' ')}</div>
        </div>
        <div class="project-content">
            <p class="project-description">
                ${repo.description || 'Projeto desenvolvido durante os estudos em Análise e Desenvolvimento de Sistemas.'}
            </p>
            <div class="project-stats">
                <div class="project-stat">
                    <i class="fas fa-code"></i>
                    <span>${language}</span>
                </div>
                <div class="project-stat">
                    <i class="fas fa-star"></i>
                    <span>${repo.stargazers_count}</span>
                </div>
                <div class="project-stat">
                    <i class="fas fa-calendar"></i>
                    <span>${lastUpdate}</span>
                </div>
            </div>
            <div class="project-tech">
                ${language ? `<span class="tech-tag">${language}</span>` : ''}
                ${topics.map(topic => `<span class="tech-tag">${topic}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" class="project-link" target="_blank">
                    <i class="fab fa-github"></i> Repository
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" class="project-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                ` : ''}
                ${repo.has_pages ? `
                    <a href="https://${repo.owner.login}.github.io/${repo.name}" class="project-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> GitHub Pages
                    </a>
                ` : ''}
            </div>
        </div>
    `;

    // Adicionar efeitos de hover
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.borderColor = 'rgba(0, 255, 255, 0.6)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.borderColor = 'rgba(64, 64, 64, 0.3)';
    });

    return card;
}

/* ========================================SELEÇÃO DE ÍCONES PARA PROJETOS======================================== */

function getProjectIcon(language, name) {
    const nameL = name.toLowerCase();
    const langL = (language || '').toLowerCase();

    // Verificar por palavras-chave no nome do projeto
    if (nameL.includes('web') || nameL.includes('site')) return 'fas fa-globe';
    if (nameL.includes('app') || nameL.includes('mobile')) return 'fas fa-mobile-alt';
    if (nameL.includes('game') || nameL.includes('jogo')) return 'fas fa-gamepad';
    if (nameL.includes('bot') || nameL.includes('ai') || nameL.includes('ml')) return 'fas fa-robot';
    if (nameL.includes('api') || nameL.includes('backend')) return 'fas fa-server';
    if (nameL.includes('database') || nameL.includes('db')) return 'fas fa-database';
    if (nameL.includes('portfolio') || nameL.includes('cv')) return 'fas fa-user';

    // Verificar por linguagem
    switch (langL) {
        case 'javascript': return 'fab fa-js-square';
        case 'python': return 'fab fa-python';
        case 'php': return 'fab fa-php';
        case 'html': return 'fab fa-html5';
        case 'css': return 'fab fa-css3-alt';
        case 'java': return 'fab fa-java';
        case 'c++': case 'c': return 'fas fa-code';
        default: return 'fas fa-file-code';
    }
}

/* ========================================INICIALIZAÇÃO DOS EVENT LISTENERS======================================== */

// Event listener para o botão de carregar projetos
document.addEventListener('DOMContentLoaded', () => {
    const loadButton = document.getElementById('loadProjects');
    if (loadButton) {
        loadButton.addEventListener('click', loadGitHubProjects);
        
        // Auto-carregar projetos após 2 segundos
        setTimeout(() => {
            loadGitHubProjects();
        }, 2000);
    }
});