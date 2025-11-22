// Multi-page Portfolio with Theme Toggle
class Portfolio {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        
        if (page.includes('projects.html')) return 'projects';
        if (page.includes('certificates.html')) return 'certificates';
        if (page.includes('contact.html')) return 'contact';
        return 'home';
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupPageSpecificFeatures();
        this.setupSharedFeatures();
    }

    setupTheme() {
        // Get saved theme or default to dark
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('portfolio-theme', newTheme);
                
                // Add animation class
                themeToggle.classList.add('theme-changing');
                setTimeout(() => {
                    themeToggle.classList.remove('theme-changing');
                }, 300);
            });
        }
    }

    setupNavigation() {
        // Update active navigation link
        const currentPage = this.currentPage;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if ((currentPage === 'home' && href === 'index.html') ||
                (currentPage !== 'home' && href.includes(currentPage))) {
                link.classList.add('active');
            }
        });

        // Mobile menu functionality
        this.setupMobileMenu();
        
        // Smooth scrolling
        this.setupSmoothScrolling();
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking on links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupPageSpecificFeatures() {
        switch (this.currentPage) {
            case 'projects':
                this.setupProjectsPage();
                break;
            case 'certificates':
                this.setupCertificatesPage();
                break;
            case 'contact':
                this.setupContactPage();
                break;
            default:
                this.setupHomePage();
        }
    }

    setupHomePage() {
        // Home page animations
        this.setupScrollAnimations();
        this.setupCounterAnimation();
    }

    setupProjectsPage() {
        this.setupProjectAnimations();
    }

    setupCertificatesPage() {
        this.setupCertificateAnimations();
    }

    setupContactPage() {
        this.setupContactForm();
    }

    setupSharedFeatures() {
        this.setupHeaderScroll();
        this.setupAnimations();
    }

    setupHeaderScroll() {
        const header = document.querySelector('header');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.project-card, .skill-item, .fact-item, .timeline-item, .certificate-card, .faq-item'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupScrollAnimations() {
        // Additional scroll animations for home page
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = `fadeInUp 0.8s ease forwards`;
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.hero-text, .about-content, .timeline').forEach(el => {
            scrollObserver.observe(el);
        });
    }

    setupCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length > 0) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => counterObserver.observe(counter));
        }
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }

    setupProjectAnimations() {
        // Project card hover effects
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-5px)';
            });
        });
    }

    setupCertificateAnimations() {
        // Certificate card animations
        document.querySelectorAll('.certificate-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });

            // Add floating labels effect
            const formInputs = contactForm.querySelectorAll('input, textarea, select');
            formInputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('focused');
                    }
                });

                // Check initial values
                if (input.value) {
                    input.parentElement.classList.add('focused');
                }
            });
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!this.validateForm(data)) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            this.showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Remove focused classes
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('focused');
            });
        }, 2000);
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!data.name || !data.email || !data.subject || !data.message) {
            return false;
        }

        if (!emailRegex.test(data.email)) {
            return false;
        }

        return true;
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-lg);
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            background: ${this.getNotificationColor(type)};
            box-shadow: var(--shadow-lg);
            border-left: 4px solid ${this.getNotificationBorderColor(type)};
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }

    getNotificationBorderColor(type) {
        const colors = {
            success: '#059669',
            error: '#dc2626',
            info: '#2563eb'
        };
        return colors[type] || '#2563eb';
    }
}

// Add CSS for animations
const addAnimationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .theme-changing {
            transform: scale(1.1) rotate(180deg);
        }
        
        .form-group.focused label {
            transform: translateY(-20px) scale(0.85);
            color: var(--primary-color);
        }
        
        .form-group {
            position: relative;
        }
        
        .form-group label {
            transition: all 0.3s ease;
            transform-origin: left top;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fa-spin {
            animation: fa-spin 1s infinite linear;
        }
        
        @keyframes fa-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Smooth transitions for theme switching */
        * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
    `;
    document.head.appendChild(style);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    new Portfolio();
});

// Handle page transitions
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Handle responsive images
document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});