class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: transparent;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(0px);
                }
                
                .nav-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .nav-logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: linear-gradient(to right, #3b82f6, #22c55e);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-decoration: none;
                }
                
                .nav-links {
                    display: flex;
                    gap: 2rem;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                
                .nav-link {
                    color: #e5e7eb;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    position: relative;
                    padding: 0.5rem 0;
                }
                
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(to right, #3b82f6, #22c55e);
                    transition: width 0.3s ease;
                }
                
                .nav-link:hover::after {
                    width: 100%;
                }
                
                .nav-link:hover {
                    color: #fff;
                }
                
                .mobile-menu-toggle {
                    display: none;
                    background: none;
                    border: none;
                    color: #e5e7eb;
                    cursor: pointer;
                }
                
                @media (max-width: 768px) {
                    .mobile-menu-toggle {
                        display: block;
                    }
                    
                    .nav-links {
                        position: fixed;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: rgba(17, 24, 39, 0.95);
                        backdrop-filter: blur(10px);
                        flex-direction: column;
                        padding: 2rem;
                        transform: translateY(-100%);
                        opacity: 0;
                        transition: all 0.3s ease;
                        pointer-events: none;
                    }
                    
                    .nav-links.active {
                        transform: translateY(0);
                        opacity: 1;
                        pointer-events: all;
                    }
                }
            </style>
            
            <nav>
                <div class="nav-container ">
                    <a href="#home" class="nav-logo">AB</a>
                    <button class="mobile-menu-toggle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <ul class="nav-links">
                        <li><a href="#home" class="nav-link">Home</a></li>
                        <li><a href="#about" class="nav-link">About</a></li>
                        <li><a href="#skills" class="nav-link">Skills</a></li>
                        <li><a href="#projects" class="nav-link">Projects</a></li>
                        <li><a href="#contact" class="nav-link">Contact</a></li>
                    </ul>
                </div>
            </nav>
        `;
        
        // Mobile menu toggle functionality
        const menuToggle = this.shadowRoot.querySelector('.mobile-menu-toggle');
        const navLinks = this.shadowRoot.querySelector('.nav-links');
        
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        const links = this.shadowRoot.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

customElements.define('custom-navbar', CustomNavbar);