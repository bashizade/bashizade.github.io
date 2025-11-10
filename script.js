// Smooth scroll behavior for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather Icons (with graceful fallback)
    if (window.feather && typeof window.feather.replace === 'function') {
        feather.replace();
    } else {
        console.warn('Feather icons library not found. Icon placeholders will remain.');
    }
    
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
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
    
    // Intersection Observer for scroll animations
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
    
    // Observe elements for animations
    document.querySelectorAll('.skill-card, .project-card, section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
    
    // Dynamic typing effect for hero title (optional)
    const heroTitle = document.querySelector('h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let index = 0;
        
        function typeWriter() {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('nav');
        if (navbar) {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('backdrop-blur-lg', 'bg-gray-900/80');
                navbar.classList.remove('bg-transparent');
            } else {
                navbar.classList.remove('backdrop-blur-lg', 'bg-gray-900/80');
                navbar.classList.add('bg-transparent');
            }
            
            lastScroll = currentScroll;
        }
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('#home');
        if (parallax) {
            const speed = 0.5;
            parallax.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
    
    // Add hover effect to skill bars
    const skillBars = document.querySelectorAll('.bg-gradient-to-r');
    skillBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'scaleX(1.05)';
            this.style.transformOrigin = 'left';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'scaleX(1)';
        });
    });
    
    // Dynamic projects rendering
    const projectsContainer = document.getElementById('projects-container');
    const projectsLoading = document.getElementById('projects-loading');
    const projectsError = document.getElementById('projects-error');
    const PROJECTS_JSON_PATH = './data/projects.json';

    if (projectsContainer) {
        fetch(`${PROJECTS_JSON_PATH}?cache=${Date.now()}`)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load projects.json (${response.status})`);
                }
                return response.json();
            })
            .then((projects) => {
                renderProjects(projectsContainer, projects);
                initialiseProjectCardTilt();
            })
            .catch((error) => {
                console.error('Unable to load projects:', error);
                if (projectsError) {
                    projectsError.classList.remove('hidden');
                }
            })
            .finally(() => {
                if (projectsLoading) {
                    projectsLoading.classList.add('hidden');
                }
            });
    }
    
    // Form submission handling (for contact form)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                submitButton.textContent = 'Message Sent!';
                submitButton.classList.add('bg-green-600');
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('bg-green-600');
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('fade-in');
        });
    });
    
    // Easter egg: Konami code
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                document.body.style.animation = 'float 6s ease-in-out infinite';
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
});

function renderProjects(container, projects) {
    container.innerHTML = '';

    if (!Array.isArray(projects) || projects.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'col-span-full bg-gray-900/40 border border-dashed border-gray-700 rounded-2xl p-8 text-center text-gray-400';
        emptyState.textContent = 'No projects are available yet. Use the project manager page to add new items.';
        container.appendChild(emptyState);
        return;
    }

    projects.forEach((project) => {
        const card = document.createElement('article');
        card.className = 'project-card group bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500/50 transition-all duration-300';

        const mediaWrapper = document.createElement('div');
        mediaWrapper.className = 'project-image-wrapper relative overflow-hidden h-48';

        const fallbackImage = 'https://static.photos/technology/640x360/placeholder';

        const baseImage = document.createElement('img');
        baseImage.src = project.image || fallbackImage;
        baseImage.alt = project.title || 'Project image';
        baseImage.className = 'project-thumb absolute inset-0 w-full h-full object-cover';
        mediaWrapper.appendChild(baseImage);

        const screenshotWrapper = document.createElement('div');
        screenshotWrapper.className = 'project-screenshot-wrapper absolute inset-0 overflow-hidden pointer-events-none';

        const screenshotImage = document.createElement('img');
        screenshotImage.src = project.screenshot || project.image || fallbackImage;
        screenshotImage.alt = `${project.title || 'Project'} screenshot`;
        screenshotImage.className = 'project-screenshot w-full h-auto object-cover';
        screenshotWrapper.appendChild(screenshotImage);

        mediaWrapper.appendChild(screenshotWrapper);

        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent pointer-events-none';
        mediaWrapper.appendChild(overlay);

        const content = document.createElement('div');
        content.className = 'p-6';

        const title = document.createElement('h3');
        title.className = 'text-xl font-semibold mb-2';
        title.textContent = project.title || 'Untitled project';
        content.appendChild(title);

        const description = document.createElement('p');
        description.className = 'text-gray-400 mb-4';
        description.textContent = project.description || '';
        content.appendChild(description);

        if (Array.isArray(project.tags) && project.tags.length) {
            const tagsWrapper = document.createElement('div');
            tagsWrapper.className = 'flex flex-wrap gap-2 mb-4';

            project.tags.forEach((tag) => {
                const chip = document.createElement('span');
                chip.className = 'px-2 py-1 bg-gray-800 rounded text-xs text-gray-300';
                chip.textContent = tag;
                tagsWrapper.appendChild(chip);
            });

            content.appendChild(tagsWrapper);
        }

        const actions = document.createElement('div');
        actions.className = 'flex gap-3';

        if (project.liveUrl) {
            const liveLink = document.createElement('a');
            liveLink.href = project.liveUrl;
            liveLink.target = '_blank';
            liveLink.rel = 'noopener noreferrer';
            liveLink.className = 'text-primary-400 hover:text-primary-300 transition-colors';
            liveLink.textContent = 'View live →';
            actions.appendChild(liveLink);
        }

        if (project.repoUrl) {
            const repoLink = document.createElement('a');
            repoLink.href = project.repoUrl;
            repoLink.target = '_blank';
            repoLink.rel = 'noopener noreferrer';
            repoLink.className = 'text-gray-400 hover:text-gray-300 transition-colors';
            repoLink.textContent = 'View source →';
            actions.appendChild(repoLink);
        }

        if (!actions.children.length) {
            const placeholder = document.createElement('span');
            placeholder.className = 'text-gray-500 text-sm';
            placeholder.textContent = 'No links provided';
            actions.appendChild(placeholder);
        }

        content.appendChild(actions);

        card.appendChild(mediaWrapper);
        card.appendChild(content);

        container.appendChild(card);
    });
}

function initialiseProjectCardTilt() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Dark mode toggle (if needed in future)
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
}