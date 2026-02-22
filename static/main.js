// Scroll Animation for Gallery Items
function handleScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        observer.observe(item);
    });
}

// Tab Functionality (removed - now using separate pages)
function initTabs() {
    // This function is no longer needed as we're using separate pages
    // Keeping for compatibility but it does nothing
}

// Navigation Link Handling
function initNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Check if it's a "Work In Progress" page
            if (href === 'registry.html') {
                // showWorkInProgress();
                window.location.href = 'registry.html';
                return;
            }
            
            // Handle smooth scrolling for home page links
            if (href === 'index.html') {
                window.location.href = 'index.html';
                return;
            }

            // Handle RSVP page (allow normal navigation)
            if (href === 'info.html') {
                window.location.href = 'info.html';
                return;
            }
            
            // Handle RSVP page (allow normal navigation)
            if (href === 'rsvp.html') {
                window.location.href = 'rsvp.html';
                return;
            }

            // Handle RSVP page (allow normal navigation)
            if (href === 'our-story.html') {
                window.location.href = 'our-story.html';
                return;
            }
            
            // Handle anchor links for smooth scrolling
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Work In Progress Popup
function showWorkInProgress() {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'wip-overlay';
    overlay.innerHTML = `
        <div class="wip-popup">
            <h3>Work In Progress</h3>
            <p>This page is currently under construction. Check back soon!</p>
            <button class="wip-close">Close</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(overlay);
    
    // Add event listeners
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('wip-close')) {
            document.body.removeChild(overlay);
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// RSVP Form Handling
function initRSVPForm() {
    const rsvpForm = document.querySelector('.rsvp-form');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            alert('Thank you for your RSVP! We look forward to celebrating with you.');
            
            // Reset form
            rsvpForm.reset();
        });
    }
}

// Navbar Background on Scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const navLogo = document.querySelector('.nav-logo');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            // navbar.style.background = '#5c8051';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            navLogo.style.color = '#f4b7d2';
        } else {
            // navbar.style.background = '#5c8051';
            navbar.style.boxShadow = 'none';
            navLogo.style.color = '#ffffff';
        }
    });
}

// Parallax Effect for Hero Section
function initParallax() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.25;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Carousel Auto-Scroll
function initGalleryCarousel() {
    const track = document.querySelector('.gallery-track');
    if (!track) return;
    let scrollAmount = 0;
    // const speed = 2; // pixels per frame

    function getSpeed() {
        if (window.innerWidth < 600) return 0.5;      // Slowest on mobile
        if (window.innerWidth < 900) return 1.25;     // Medium on tablet
        return 2;                                   // Fastest on desktop
    }

    // Speed control
    let speed = getSpeed();
    const speedSlider = document.getElementById('carousel-speed-slider');
    const speedValue = document.querySelector('.carousel-speed-value');
    if (speedSlider && speedValue) {
        speedSlider.value = speed;
        speedValue.textContent = speed;
        speedSlider.addEventListener('input', () => {
            speed = parseFloat(speedSlider.value);
            speedValue.textContent = speed;
        });
    }

    // Show/hide slider
    const speedBtn = document.querySelector('.carousel-speed-btn');
    const sliderContainer = document.querySelector('.carousel-speed-slider-container');
    if (speedBtn && sliderContainer) {
        speedBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sliderContainer.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!sliderContainer.contains(e.target) && !speedBtn.contains(e.target)) {
                sliderContainer.classList.remove('active');
            }
        });
    }

    // Function to determine speed based on window width (overridden by slider)
    // function getSpeed() {
    //     if (window.innerWidth < 600) return 0.5;      // Slowest on mobile
    //     if (window.innerWidth < 900) return 1.25;     // Medium on tablet
    //     return 2;                                   // Fastest on desktop
    // }
    // let speed = getSpeed();

    // window.addEventListener('resize', () => {
    //     speed = getSpeed();
    // });

    // Shuffle images before duplicating
    const images = Array.from(track.children);
    // Fisher-Yates shuffle
    for (let i = images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]];
    }
    // Remove all children and re-append in shuffled order
    while (track.firstChild) {
        track.removeChild(track.firstChild);
    }
    images.forEach(img => track.appendChild(img));

    // Duplicate images for seamless looping
    images.forEach(img => {
        const clone = img.cloneNode(true);
        track.appendChild(clone);
    });

    function animate() {
        scrollAmount += speed;
        if (scrollAmount >= track.scrollWidth / 2) {
            scrollAmount = 0;
        }
        track.style.transform = `translateX(${-scrollAmount}px)`;
        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // handleScrollAnimations();
    initTabs();
    initNavigationLinks();
    initRSVPForm();
    initNavbarScroll();
    initParallax();
    initSaveTheDateAnimation();
    initHamburgerMenu();
    initGalleryCarousel(); // <-- Add this line
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Fade in save-the-date background image
    const saveTheDateBg = document.querySelector('.save-the-date-bg');
    if (saveTheDateBg) {
        setTimeout(() => {
            saveTheDateBg.classList.add('fade-in');
        }, 2000); // 2 second delay for effect
    }
});

// Hamburger Menu Functionality
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Save the Date Image Animation
function initSaveTheDateAnimation() {
    const saveTheDateImg = document.querySelector('.save-the-date-img');
    
    if (saveTheDateImg) {
        // Start with image off-screen
        saveTheDateImg.style.transform = 'translateY(100vh)';
        saveTheDateImg.style.opacity = '0';
        
        // Trigger animation after a short delay
        setTimeout(() => {
            saveTheDateImg.style.transition = 'transform 1.5s ease-out, opacity 1.5s ease-out';
            saveTheDateImg.style.transform = 'translateY(0)';
            saveTheDateImg.style.opacity = '1';
            saveTheDateImg.classList.add('loaded');
        }, 500);
    }
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to detail cards
    const detailCards = document.querySelectorAll('.detail-card');
    detailCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to registry links
    const registryLinks = document.querySelectorAll('.registry-link');
    registryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Add a ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            link.style.position = 'relative';
            link.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 

// Play audio when 'love' in footer is clicked
const footerLove = document.getElementById('footer-love');
const footerLoveAudio = document.getElementById('footer-love-audio');
if (footerLove && footerLoveAudio) {
    footerLove.addEventListener('click', () => {
        footerLoveAudio.currentTime = 0;
        footerLoveAudio.play();
    });
} 