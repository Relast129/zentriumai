/**
 * Contact Form Handler for Zentrium AI
 * This script handles the contact form submission using EmailJS
 * It sends emails to both zentriumai@gmail.com and ramzyraheesh@gmail.com
 * Optimized for faster performance
 */

// Cache DOM elements and initialize variables early
let contactForm, nameInput, emailInput, phoneInput, subjectInput, messageInput,
    privacyConsent, submitButton, emailStatus;

// Pre-initialize EmailJS as early as possible
document.addEventListener('DOMContentLoaded', function() {
    // Cache all form elements immediately for faster access
    contactForm = document.getElementById('contactForm');

    if (contactForm) {
        nameInput = document.getElementById('name');
        emailInput = document.getElementById('email');
        phoneInput = document.getElementById('phone');
        subjectInput = document.getElementById('subject');
        messageInput = document.getElementById('message');
        privacyConsent = document.getElementById('privacy-consent');
        submitButton = document.getElementById('submit-button');
        emailStatus = document.getElementById('email-status');

        // Add form submission event listener with optimized handling
        contactForm.addEventListener('submit', handleFormSubmit);

        // Pre-validate form fields on input to speed up final validation
        setupLiveValidation();
    }
});

/**
 * Handles form submission with optimized validation and sending
 * @param {Event} event - The form submission event
 */
function handleFormSubmit(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Fast validation using cached elements
    if (fastValidateForm()) {
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        emailStatus.style.display = 'none';

        // Send the email with optimized parameters
        sendEmailFast();
    }
}

/**
 * Sets up live validation for form fields to improve user experience and speed up submission
 */
function setupLiveValidation() {
    // Simple email regex for quick validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate name on input
    nameInput.addEventListener('input', function() {
        if (this.value.trim()) {
            this.classList.remove('is-invalid');
        }
    });

    // Validate email on input
    emailInput.addEventListener('input', function() {
        if (this.value.trim() && emailRegex.test(this.value.trim())) {
            this.classList.remove('is-invalid');
        }
    });

    // Validate message on input
    messageInput.addEventListener('input', function() {
        if (this.value.trim()) {
            this.classList.remove('is-invalid');
        }
    });

    // Validate privacy consent on change
    if (privacyConsent) {
        privacyConsent.addEventListener('change', function() {
            if (this.checked) {
                this.classList.remove('is-invalid');
                this.parentElement.classList.remove('privacy-error');
            }
        });
    }
}

/**
 * Fast validation function that uses cached elements
 * @returns {boolean} - Whether the form is valid
 */
function fastValidateForm() {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate name (fast check)
    if (!nameInput.value.trim()) {
        nameInput.classList.add('is-invalid');
        isValid = false;
    }

    // Validate email (fast check)
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    }

    // Validate message (fast check)
    if (!messageInput.value.trim()) {
        messageInput.classList.add('is-invalid');
        isValid = false;
    }

    // Validate privacy consent (fast check)
    if (privacyConsent && !privacyConsent.checked) {
        privacyConsent.classList.add('is-invalid');
        privacyConsent.parentElement.classList.add('privacy-error');
        isValid = false;
    }

    return isValid;
}

/**
 * Sends an email using EmailJS with optimized performance
 * Uses cached DOM elements and optimized parameters
 */
function sendEmailFast() {
    // Check if EmailJS is available with faster check
    if (window.emailjs) {
        // Get values directly (faster than accessing DOM repeatedly)
        const userName = nameInput.value.trim();
        const userEmail = emailInput.value.trim();
        const userPhone = phoneInput ? phoneInput.value.trim() || 'Not provided' : 'Not provided';
        const userSubject = subjectInput ? subjectInput.value.trim() || 'Contact Form Submission' : 'Contact Form Submission';
        const userMessage = messageInput.value.trim();

        // Prepare the template parameters (optimized object creation)
        const templateParams = {
            user_name: userName,
            user_email: userEmail,
            user_phone: userPhone,
            subject: userSubject,
            message: userMessage,
            to_email: 'zentriumai@gmail.com',
            cc_email: 'ramzyraheesh@gmail.com'
        };

        // Use Promise.race to implement a timeout for EmailJS
        const emailPromise = window.emailjs.send('service_zentrium', 'template_zentrium', templateParams);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 8000); // 8 second timeout
        });

        // Race between the email sending and the timeout
        Promise.race([emailPromise, timeoutPromise])
            .then(function(response) {
                // Show success message immediately
                showSuccessMessage();
                console.log('SUCCESS!', response.status, response.text);
            })
            .catch(function(error) {
                console.log('FAILED...', error);

                // If it's a timeout, use the fallback method
                if (error.message === 'Request timed out') {
                    useFallbackMethod(userName, userEmail, userPhone, userSubject, userMessage);
                } else {
                    // Show error message
                    showErrorMessage();
                }
            });
    } else {
        // Fallback for when EmailJS is not available
        useFallbackMethod(
            nameInput.value.trim(),
            emailInput.value.trim(),
            phoneInput ? phoneInput.value.trim() : '',
            subjectInput ? subjectInput.value.trim() : '',
            messageInput.value.trim()
        );
    }
}

/**
 * Shows a success message and resets the form
 */
function showSuccessMessage() {
    // Show success message
    emailStatus.className = 'alert alert-success';
    emailStatus.innerHTML = '<strong>Thank you!</strong> Your message has been sent. We will get back to you soon.';
    emailStatus.style.display = 'block';

    // Reset form
    contactForm.reset();

    // Reset button
    submitButton.disabled = false;
    submitButton.innerHTML = '<span class="button-content"><span class="button-text">Send Message</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span></span>';

    // Remove success message after 3 seconds (reduced from 5)
    setTimeout(() => {
        emailStatus.style.display = 'none';
    }, 3000);
}

/**
 * Shows an error message
 */
function showErrorMessage() {
    // Show error message
    emailStatus.className = 'alert alert-danger';
    emailStatus.innerHTML = '<strong>Oops!</strong> Something went wrong. Please try again later or contact us directly at zentriumai@gmail.com or ramzyraheesh@gmail.com.';
    emailStatus.style.display = 'block';

    // Reset button
    submitButton.disabled = false;
    submitButton.innerHTML = '<span class="button-content"><span class="button-text">Send Message</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span></span>';
}

/**
 * Uses a fallback method to send the email
 * @param {string} name - The user's name
 * @param {string} email - The user's email
 * @param {string} phone - The user's phone
 * @param {string} subject - The email subject
 * @param {string} message - The email message
 */
function useFallbackMethod(name, email, phone, subject, message) {
    // Create a mailto link as a fallback
    const subjectValue = subject || 'Contact Form Submission';
    const phoneValue = phone || 'Not provided';
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phoneValue}\n\n${message}`);
    const mailtoLink = `mailto:zentriumai@gmail.com,ramzyraheesh@gmail.com?subject=${encodeURIComponent(subjectValue)}&body=${body}`;

    // Show message about using email client
    emailStatus.className = 'alert alert-info';
    emailStatus.innerHTML = '<strong>Opening your email client...</strong> If it doesn\'t open automatically, please <a href="' + mailtoLink + '" target="_blank">click here</a> to send your message.';
    emailStatus.style.display = 'block';

    // Open the mailto link
    window.location.href = mailtoLink;

    // Reset button
    submitButton.disabled = false;
    submitButton.innerHTML = '<span class="button-content"><span class="button-text">Send Message</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span></span>';
}
