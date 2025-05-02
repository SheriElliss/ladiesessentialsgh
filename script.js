// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.querySelector('.search i');
    
    if (searchInput) {
        // Add placeholder text animation
        searchInput.addEventListener('focus', function() {
            this.placeholder = 'Search products...';
        });
        
        searchInput.addEventListener('blur', function() {
            this.placeholder = 'Search';
        });

        // Debounce function to limit search frequency
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

        // Enhanced search function
        const performSearch = debounce(function(searchTerm) {
            const productCards = document.querySelectorAll('.product-card');
            let hasResults = false;

            // Remove existing no results message
            const existingNoResults = document.querySelector('.no-results-message');
            if (existingNoResults) {
                existingNoResults.remove();
            }

            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                const productPrice = card.querySelector('.price').textContent.toLowerCase();
                const productDescription = card.getAttribute('data-description')?.toLowerCase() || '';
                const productCategory = card.getAttribute('data-category')?.toLowerCase() || '';
                
                const searchTerms = searchTerm.toLowerCase().split(' ');
                const matches = searchTerms.every(term => 
                    productName.includes(term) || 
                    productPrice.includes(term) || 
                    productDescription.includes(term) ||
                    productCategory.includes(term)
                );

                if (matches) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-out';
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // Show no results message
            if (!hasResults && searchTerm.length > 0) {
                const noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.textContent = `No products found matching "${searchTerm}"`;
                document.querySelector('.product-container').appendChild(noResultsMsg);
            }
        }, 300);

        // Search input event listener
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.trim();
            performSearch(searchTerm);
        });

        // Search icon click event
        if (searchIcon) {
            searchIcon.addEventListener('click', function() {
                searchInput.focus();
            });
        }

        // Add keyboard shortcut (Ctrl/Cmd + K) for search
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });

        // Add search animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .product-card {
                transition: all 0.3s ease;
            }

            .search input:focus {
                box-shadow: 0 0 0 2px var(--primary-light);
            }

            .no-results-message {
                background: rgba(255, 255, 255, 0.98);
                border-radius: 8px;
                margin: 20px 0;
                padding: 15px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                text-align: center;
                color: var(--text-dark);
                font-size: 1.2em;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }

    // Newsletter form validation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;

            if (validateEmail(email)) {
                showNotification('Thank you for subscribing!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    });

    // Mobile navigation toggle
    const createMobileNav = () => {
        const header = document.querySelector('header');
        const nav = document.querySelector('.navigation');
        
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-nav-toggle')) {
                const toggle = document.createElement('button');
                toggle.className = 'mobile-nav-toggle';
                toggle.innerHTML = '☰';
                header.insertBefore(toggle, nav);
                
                toggle.addEventListener('click', () => {
                    nav.classList.toggle('active');
                });
            }
        } else {
            const toggle = document.querySelector('.mobile-nav-toggle');
            if (toggle) {
                toggle.remove();
            }
            nav.classList.remove('active');
        }
    };

    // Initial check for mobile navigation
    createMobileNav();
    
    // Update on window resize
    window.addEventListener('resize', createMobileNav);

    // Helper function to validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Helper function to show notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Add styles for the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.zIndex = '1000';
        notification.style.animation = 'slideIn 0.5s ease-out';
        
        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
        } else {
            notification.style.backgroundColor = '#f44336';
        }
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}); 