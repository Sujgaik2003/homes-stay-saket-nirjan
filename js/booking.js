/* ========================================
   Saket Nikunj HomeStay - Booking Modal
   Sends booking details directly to email
   via FormSubmit.co (free, no signup needed)
   ======================================== */

// Email where all booking details will be sent
const BOOKING_EMAIL = 'sujeetsg1372@gmail.com';

/* ========================================
   MODAL OPEN / CLOSE
   ======================================== */
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Set minimum dates for check-in and check-out
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('bookingCheckin');
    const checkoutInput = document.getElementById('bookingCheckout');
    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;

    // Close mobile menu if open
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (toggle && menu) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
    }
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form and show form again
    const form = document.getElementById('bookingForm');
    const success = document.getElementById('bookingSuccess');
    if (form) {
        form.reset();
        form.style.display = '';
    }
    if (success) success.style.display = 'none';
}

/* ========================================
   EVENT LISTENERS
   ======================================== */
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.getElementById('bookingModalClose');
    const form = document.getElementById('bookingForm');
    const checkinInput = document.getElementById('bookingCheckin');

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeBookingModal);
    }

    // Close on overlay click
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeBookingModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeBookingModal();
        }
    });

    // Update checkout min date when check-in changes
    if (checkinInput) {
        checkinInput.addEventListener('change', function () {
            const checkoutInput = document.getElementById('bookingCheckout');
            if (checkoutInput) {
                checkoutInput.min = this.value;
                if (checkoutInput.value && checkoutInput.value <= this.value) {
                    checkoutInput.value = '';
                }
            }
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', handleBookingSubmit);
    }
});

/* ========================================
   FORM SUBMISSION — Direct Email via FormSubmit.co
   ======================================== */
async function handleBookingSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('bookingSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Gather form data
    const name = document.getElementById('bookingName').value.trim();
    const mobile = document.getElementById('bookingMobile').value.trim();
    const checkin = document.getElementById('bookingCheckin').value;
    const checkout = document.getElementById('bookingCheckout').value;
    const guests = document.getElementById('bookingGuests').value;
    const message = document.getElementById('bookingMessage').value.trim();

    // Validate
    if (!name || !mobile || !checkin || !checkout) {
        alert('Please fill in all required fields.');
        return;
    }

    // Format dates for display
    const checkinDate = new Date(checkin).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const checkoutDate = new Date(checkout).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Show loading state
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'inline';
    submitBtn.disabled = true;

    try {
        // Send directly to email via FormSubmit.co
        const response = await fetch(`https://formsubmit.co/ajax/${BOOKING_EMAIL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `🏨 New Booking Request — ${name}`,
                'Guest Name': name,
                'Mobile Number': mobile,
                'Check-in Date': checkinDate,
                'Check-out Date': checkoutDate,
                'Number of Guests': guests,
                'Special Requests': message || 'None',
                _template: 'table'
            })
        });

        const result = await response.json();

        if (result.success === 'true' || result.success === true || response.ok) {
            showBookingSuccess();
        } else {
            throw new Error('Email send failed');
        }

    } catch (error) {
        console.error('Form submission error:', error);
        // If the API call fails, show a friendly error and offer an alternative
        alert('Something went wrong while sending. Please try again, or contact us directly at +91 9927949222.');

    } finally {
        // Reset button state
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
}

/* ========================================
   SUCCESS STATE
   ======================================== */
function showBookingSuccess() {
    const form = document.getElementById('bookingForm');
    const success = document.getElementById('bookingSuccess');

    if (form) form.style.display = 'none';
    if (success) success.style.display = 'block';
}
