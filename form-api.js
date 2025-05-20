/**
 * Direct API Form Handler for Zentrium AI
 * This script provides a faster alternative to EmailJS by using direct API calls
 */

// Configuration
const API_CONFIG = {
    // Using EmailJS as the primary method
    useEmailJS: true,
    // FormSubmit.co as backup
    endpoint: 'https://formsubmit.co/ajax/zentriumai@gmail.com',
    cc: 'ramzyraheesh@gmail.com',
    // Increased timeout for better reliability
    timeout: 8000, // 8 seconds timeout
    // EmailJS configuration
    emailjs: {
        serviceId: 'service_zentrium',
        templateId: 'template_zentrium'
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Replace the default submit handler
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

/**
 * Handles form submission with optimized performance
 * @param {Event} event - The form submission event
 */
async function handleFormSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get form elements
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const statusElement = document.getElementById('email-status');

    // Validate form
    if (!validateForm(form)) {
        return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    if (statusElement) statusElement.style.display = 'none';

    try {
        // Get form values for both methods
        const userName = form.querySelector('#name').value.trim();
        const userEmail = form.querySelector('#email').value.trim();
        const userPhone = form.querySelector('#phone')?.value.trim() || 'Not provided';
        const userSubject = form.querySelector('#subject')?.value.trim() || 'Contact Form Submission';
        const userMessage = form.querySelector('#message').value.trim();

        // Try EmailJS first if configured to use it
        if (API_CONFIG.useEmailJS && window.emailjs) {
            console.log('Attempting to send via EmailJS...');

            // Prepare template parameters
            const templateParams = {
                user_name: userName,
                user_email: userEmail,
                user_phone: userPhone,
                subject: userSubject,
                message: userMessage,
                to_email: 'zentriumai@gmail.com',
                cc_email: 'ramzyraheesh@gmail.com'
            };

            try {
                // Use Promise.race to implement a timeout
                const emailPromise = window.emailjs.send(
                    API_CONFIG.emailjs.serviceId,
                    API_CONFIG.emailjs.templateId,
                    templateParams
                );

                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('EmailJS request timed out')), API_CONFIG.timeout);
                });

                // Wait for either the email to send or the timeout
                const response = await Promise.race([emailPromise, timeoutPromise]);
                console.log('EmailJS success:', response);
                showSuccess(form, submitButton, statusElement);
                return;
            } catch (emailjsError) {
                console.error('EmailJS failed:', emailjsError);
                // Continue to FormSubmit.co as fallback
            }
        }

        // If EmailJS failed or is not configured, use FormSubmit.co
        console.log('Attempting to send via FormSubmit.co...');
        const formData = new FormData(form);

        // Add CC email
        formData.append('_cc', API_CONFIG.cc);

        // Use faster fetch API with timeout
        const response = await fetchWithTimeout(API_CONFIG.endpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }, API_CONFIG.timeout);

        // Handle success
        if (response.ok) {
            showSuccess(form, submitButton, statusElement);
        } else {
            // If API call fails, use mailto as last resort
            useMailtoFallback(form, submitButton, statusElement);
        }
    } catch (error) {
        console.error('Form submission error:', error);

        // If all else fails, use mailto as last resort
        useMailtoFallback(form, submitButton, statusElement);
    }
}

/**
 * Fetch with timeout for faster response
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} - Fetch response
 */
async function fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Fast form validation
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
    let isValid = true;

    // Get required fields
    const requiredFields = form.querySelectorAll('[required]');

    // Reset validation state
    requiredFields.forEach(field => {
        field.classList.remove('is-invalid');
        if (field.type === 'checkbox') {
            field.parentElement.classList.remove('privacy-error');
        }
    });

    // Validate each required field
    requiredFields.forEach(field => {
        if (field.type === 'checkbox' && !field.checked) {
            field.classList.add('is-invalid');
            field.parentElement.classList.add('privacy-error');
            isValid = false;
        } else if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim() || !emailRegex.test(field.value.trim())) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        } else if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Show success message and reset form
 * @param {HTMLFormElement} form - The form element
 * @param {HTMLButtonElement} submitButton - The submit button
 * @param {HTMLElement} statusElement - The status element
 */
function showSuccess(form, submitButton, statusElement) {
    // Reset form
    form.reset();

    // Reset button
    submitButton.disabled = false;
    submitButton.innerHTML = '<span class="button-content"><span class="button-text">Send Message</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span></span>';

    // Show success message
    if (statusElement) {
        statusElement.className = 'alert alert-success';
        statusElement.innerHTML = '<strong>Thank you!</strong> Your message has been sent to zentriumai@gmail.com and ramzyraheesh@gmail.com. We will get back to you soon.';
        statusElement.style.display = 'block';

        // Hide message after 3 seconds
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 3000);
    }
}

/**
 * Shows an error message
 * @param {HTMLElement} statusElement - The status element
 * @param {HTMLButtonElement} submitButton - The submit button
 */
function showErrorMessage(statusElement, submitButton) {
    // Show error message
    if (statusElement) {
        statusElement.className = 'alert alert-danger';
        statusElement.innerHTML = '<strong>Oops!</strong> Something went wrong. Please try again later or contact us directly at zentriumai@gmail.com or ramzyraheesh@gmail.com.';
        statusElement.style.display = 'block';
    }

    // Reset button
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '<span class="button-content"><span class="button-text">Send Message</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span></span>';
    }
}

/**
 * Use mailto as last resort fallback
 * @param {HTMLFormElement} form - The form element
 * @param {HTMLButtonElement} submitButton - The submit button
 * @param {HTMLElement} statusElement - The status element
 */
function useMailtoFallback(form, submitButton, statusElement) {
    // Get form values
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const phone = form.querySelector('#phone')?.value || 'Not provided';
    const subject = form.querySelector('#subject')?.value || 'Contact Form Submission';
    const message = form.querySelector('#message').value;

    // Create mailto link
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`);
    const mailtoLink = `mailto:zentriumai@gmail.com,ramzyraheesh@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    // Show message
    if (statusElement) {
        statusElement.className = 'alert alert-info';
        statusElement.innerHTML = '<strong>Opening your email client...</strong> If it doesn\'t open automatically, please <a href="' + mailtoLink + '" target="_blank">click here</a> to send your message.';
        statusElement.style.display = 'block';
    }

    // Open mailto link
    window.location.href = mailtoLink;

    // Reset button
    submitButton.disabled = false;
    submitButton.innerHTML = '<span class="button-content"><span class="button-text">Send Message</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span></span>';
}
