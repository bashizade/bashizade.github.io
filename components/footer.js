class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    background: linear-gradient(to bottom, rgba(17, 24, 39, 0.5), rgba(17, 24, 39, 0.9));
                    backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 3rem 0 2rem;
                    margin-top: 4rem;
                }
                
                .footer-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    margin-bottom: 2rem;
                }
                
                .footer-brand {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .footer-logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: linear-gradient(to right, #3b82f6, #22c55e);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .footer-text {
                    color: #9ca3af;
                    line-height: 1.6;
                }
                
                .footer-socials {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                
                .social-link {
                    width: 40px;
                    height: 40px;
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #3b82f6;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }
                
                .social-link:hover {
                    background: rgba(59, 130, 246, 0.2);
                    transform: translateY(-3px);
                }
                
                .footer-links {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
                
                .footer-column h3 {
                    color: #fff;
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                
                .footer-column ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .footer-column li {
                    margin-bottom: 0.75rem;
                }
                
                .footer-column a {
                    color: #9ca3af;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }
                
                .footer-column a:hover {
                    color: #3b82f6;
                }
                
                .footer-bottom {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 2rem;
                    text-align: center;
                    color: #6b7280;
                }
                
                .footer-bottom a {
                    color: #3b82f6;
                    text-decoration: none;
                }
                
                @media (max-width: 768px) {
                    .footer-container {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    
                    .footer-links {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                }
            </style>
            
            <footer>
                <div class="footer-container">
                    <div class="footer-brand">
                        <div class="footer-logo">Amirhossein Bashizade</div>
                        <p class="footer-text">
                            Passionate web developer with expertise in modern web technologies and AI integration. Building the future of the web, one line of code at a time.
                        </p>
                        <div class="footer-socials">
                            <a href="https://github.com" class="social-link">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                            <a href="https://linkedin.com" class="social-link">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                            </a>
                            <a href="mailto:amir@example.com" class="social-link">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div class="footer-links">
                        <div class="footer-column">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="#home">Home</a></li>
                                <li><a href="#about">About</a></li>
                                <li><a href="#skills">Skills</a></li>
                                <li><a href="#projects">Projects</a></li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h3>Technologies</h3>
                            <ul>
                                <li><a href="#">Python/Django</a></li>
                                <li><a href="#">Vue.js/JavaScript</a></li>
                                <li><a href="#">WordPress</a></li>
                                <li><a href="#">Local LLMs</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 Amirhossein Bashizade. Crafted with <span style="color: #ef4444;">❤️</span> and lots of <span style="color: #22c55e;">☕</span></p>
                </div>
            </footer>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);