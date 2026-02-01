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
    initAuthTabs();
    initBookingForm();
    initContactForm();
    initRoomGallery();
    setMinDates();
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
   AUTH TABS
   ======================================== */
function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const bookingForm = document.getElementById('bookingForm');
    const authSection = document.getElementById('authSection');

    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tabName === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        });
    });

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate login - in production, this would validate credentials
            showBookingForm();
        });
    }

    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate registration - in production, this would create account
            showBookingForm();

            // Pre-fill booking form with registration data
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const mobile = document.getElementById('regMobile').value;

            document.getElementById('guestName').value = name;
            document.getElementById('guestEmail').value = email;
            document.getElementById('guestMobile').value = mobile;
            document.getElementById('guestWhatsApp').value = mobile;
        });
    }

    function showBookingForm() {
        authSection.classList.add('hidden');
        bookingForm.classList.remove('hidden');
    }
}

/* ========================================
   BOOKING FORM
   ======================================== */
let currentStep = 1;

function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', handleBookingSubmit);
}

function nextStep(step) {
    const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const nextStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const progressSteps = document.querySelectorAll('.progress-step');

    // Validate current step
    if (!validateStep(currentStep)) return;

    // If moving to confirmation, populate summary
    if (step === 3) {
        populateBookingSummary();
    }

    // Update UI
    currentStepEl.classList.remove('active');
    nextStepEl.classList.add('active');

    progressSteps.forEach((ps, index) => {
        if (index + 1 <= step) {
            ps.classList.add('active');
        } else {
            ps.classList.remove('active');
        }
        if (index + 1 < step) {
            ps.classList.add('completed');
        }
    });

    currentStep = step;
}

function prevStep(step) {
    const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const prevStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const progressSteps = document.querySelectorAll('.progress-step');

    currentStepEl.classList.remove('active');
    prevStepEl.classList.add('active');

    progressSteps.forEach((ps, index) => {
        if (index + 1 > step) {
            ps.classList.remove('active', 'completed');
        }
    });

    currentStep = step;
}

function validateStep(step) {
    const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = stepEl.querySelectorAll('input[required], select[required]');
    let valid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.style.borderColor = '#E67E22';
            input.addEventListener('input', () => {
                input.style.borderColor = '';
            }, { once: true });
        }
    });

    if (!valid) {
        alert('Please fill in all required fields.');
    }

    return valid;
}

function populateBookingSummary() {
    const summary = document.getElementById('bookingSummary');

    const data = {
        'Guest Name': document.getElementById('guestName').value,
        'Email': document.getElementById('guestEmail').value,
        'Mobile': document.getElementById('guestMobile').value,
        'WhatsApp': document.getElementById('guestWhatsApp').value,
        'Check-in': formatDate(document.getElementById('checkIn').value),
        'Check-out': formatDate(document.getElementById('checkOut').value),
        'Adults': document.getElementById('adults').value,
        'Children': document.getElementById('children').value,
        'Room Type': document.getElementById('roomType').options[document.getElementById('roomType').selectedIndex].text
    };

    let html = '';
    for (const [label, value] of Object.entries(data)) {
        html += `
            <div class="summary-row">
                <span class="summary-label">${label}</span>
                <span class="summary-value">${value}</span>
            </div>
        `;
    }

    const specialRequests = document.getElementById('specialRequests').value;
    if (specialRequests) {
        html += `
            <div class="summary-row" style="flex-direction: column; gap: 8px;">
                <span class="summary-label">Special Requests</span>
                <span class="summary-value">${specialRequests}</span>
            </div>
        `;
    }

    summary.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

function handleBookingSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('guestName').value,
        email: document.getElementById('guestEmail').value,
        mobile: document.getElementById('guestMobile').value,
        whatsapp: document.getElementById('guestWhatsApp').value,
        checkIn: document.getElementById('checkIn').value,
        checkOut: document.getElementById('checkOut').value,
        adults: document.getElementById('adults').value,
        children: document.getElementById('children').value,
        roomType: document.getElementById('roomType').options[document.getElementById('roomType').selectedIndex].text,
        specialRequests: document.getElementById('specialRequests').value
    };

    // Create WhatsApp message
    const message = createWhatsAppMessage(formData);
    const whatsappUrl = `https://wa.me/919359416735?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Show confirmation
    showBookingConfirmation();

    // Optional: Send email notification via backend (would require server-side implementation)
    // sendEmailNotification(formData);
}

function createWhatsAppMessage(data) {
    return `*New Booking Request - Saket Nikunj HomeStay*

*Guest Details:*
Name: ${data.name}
Email: ${data.email}
Mobile: ${data.mobile}
WhatsApp: ${data.whatsapp}

*Stay Details:*
Check-in: ${formatDate(data.checkIn)}
Check-out: ${formatDate(data.checkOut)}
Adults: ${data.adults}
Children: ${data.children}
Room: ${data.roomType}

*Special Requests:*
${data.specialRequests || 'None'}

---
Sent from Website`;
}

function showBookingConfirmation() {
    const form = document.getElementById('bookingForm');
    const confirmation = document.getElementById('bookingConfirmation');

    form.classList.add('hidden');
    confirmation.classList.remove('hidden');
}

function setMinDates() {
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');

    if (!checkIn || !checkOut) return;

    const today = new Date().toISOString().split('T')[0];
    checkIn.min = today;

    checkIn.addEventListener('change', () => {
        const checkInDate = new Date(checkIn.value);
        checkInDate.setDate(checkInDate.getDate() + 1);
        checkOut.min = checkInDate.toISOString().split('T')[0];

        if (checkOut.value && new Date(checkOut.value) <= new Date(checkIn.value)) {
            checkOut.value = '';
        }
    });
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
