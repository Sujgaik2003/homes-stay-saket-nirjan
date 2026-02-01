/* ========================================
   Saket Nikunj HomeStay - Main JavaScript
   Premium Interactions & Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    initNavbar();
    initHeroSlider();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initRoomGallery();
});

/* ========================================
   NAVBAR SCROLL EFFECT
   ======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/* ========================================
   HERO SLIDER
   ======================================== */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const hero = document.querySelector('.hero');
    let currentSlide = 0;
    const slideInterval = 6000;

    if (slides.length === 0) return;

    // Add loaded class for animations
    setTimeout(() => {
        hero.classList.add('hero-loaded');
    }, 100);

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto-advance slides
    setInterval(nextSlide, slideInterval);
}

/* ========================================
   SCROLL ANIMATIONS (Intersection Observer)
   ======================================== */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        fadeElements.forEach(el => el.classList.add('visible'));
    }
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('active')) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ========================================
   ROOM GALLERY
   ======================================== */
function initRoomGallery() {
    // Gallery Lightbox Functionality
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(img => img.src);

    if (!lightbox || !galleryItems.length) return;

    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.closest('.gallery-item').addEventListener('click', () => {
            currentIndex = index;
            updateLightboxImage();
            openLightbox();
        });
    });

    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);

    // Close on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Navigation
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        lightboxImg.src = images[currentIndex];
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    }

    // Swipe Support for Touch Devices
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) showNext();
        if (touchEndX > touchStartX + threshold) showPrev();
    }
}

function changeRoomImage(src, button) {
    const mainImage = document.getElementById('mainRoomImage');
    const thumbs = document.querySelectorAll('.gallery-thumb');

    if (!mainImage) return;

    // Add changing class for transition
    mainImage.classList.add('changing');

    setTimeout(() => {
        mainImage.src = src;
        mainImage.classList.remove('changing');
    }, 250);

    // Update active state
    thumbs.forEach(thumb => thumb.classList.remove('active'));
    button.classList.add('active');
}



/* ========================================
   CONTACT FORM
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            message: document.getElementById('contactMessage').value
        };

        // Create WhatsApp message for contact
        const message = `*New Contact Message - Saket Nikunj HomeStay*

*From:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone || 'Not provided'}

*Message:*
${formData.message}

---
Sent from Website Contact Form`;

        const whatsappUrl = `https://wa.me/919359416735?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        form.reset();
    });
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy loading for images (if IntersectionObserver is supported)
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Active navigation highlighting
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', throttle(highlightNav, 100), { passive: true });
}

// Initialize additional features
initLazyLoading();
initActiveNavHighlight();
