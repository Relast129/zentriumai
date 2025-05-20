// Enhanced Navigation Functionality with Performance Optimizations
document.addEventListener('DOMContentLoaded', function() {

    // Animate hero elements immediately without delay
    try {
        animateHeroElements();
        animateServiceButtons();
        animateWhyUsCards(); // Add animation for Why Choose Us cards
    } catch (e) {
        console.error("Error in animations:", e);
    }

    // Function to animate service buttons with staggered delays and continuous effects
    function animateServiceButtons() {
        const serviceLinks = document.querySelectorAll('.service-link');

        serviceLinks.forEach(link => {
            const delay = link.getAttribute('data-animation-delay') || 0;

            // Add initial styles
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            link.style.transition = 'all 0.5s ease';

            // Animate in with delay
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';

                // Add shimmer effect after appearing
                setTimeout(() => {
                    const linkHoverEffect = link.querySelector('.link-hover-effect');
                    if (linkHoverEffect) {
                        // Initial shimmer
                        animateShimmer(linkHoverEffect);

                        // Set up periodic shimmer effect
                        setInterval(() => {
                            animateShimmer(linkHoverEffect);
                        }, 4000); // Repeat every 4 seconds
                    }
                }, 500);
            }, delay * 1000);
        });
    }

    // Function to animate the shimmer effect
    function animateShimmer(element) {
        // Animate shimmer from left to right
        element.style.transform = 'translateX(100%)';

        // Reset shimmer position after animation completes
        setTimeout(() => {
            element.style.transition = 'none';
            element.style.transform = 'translateX(-100%)';

            // Re-enable transition after reset
            setTimeout(() => {
                element.style.transition = 'transform 0.6s ease';
            }, 50);
        }, 600);
    }

    // Function to animate hero elements with staggered timing
    function animateHeroElements() {
        const heroElements = [
            document.querySelector('.hero-tagline'),
            document.querySelector('.hero h1'),
            document.querySelector('.hero p'),  // Changed from .hero-description to .hero p
            document.querySelector('.hero-features'),
            document.querySelector('.hero-buttons'),
            document.querySelector('.hero-clients'),
            document.querySelector('.hero-image')
        ];

        heroElements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.classList.add('animate-in');
                }, index * 150);
            }
        });
    }

    // Initialize AOS animations with further optimized performance settings
    AOS.init({
        duration: 600, // Reduced duration for faster animations
        easing: 'ease-out',
        once: true, // Changed to true - animations only happen once for better performance
        mirror: false,
        offset: 50, // Reduced offset
        delay: 0, // Removed delay for immediate animations
        anchorPlacement: 'top-bottom',
        disable: 'mobile', // Disable on mobile for better performance
        throttleDelay: 150, // Increased throttle delay for better performance
        disableMutationObserver: true // Disable mutation observer for better performance
    });

    // Light Theme Only
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        // Set light theme
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';

        // Update meta theme-color for browser UI
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#f8fafc');
        }

        // Store light theme preference
        localStorage.setItem('theme', 'light');

        // Hide theme toggle button (optional)
        // themeToggleBtn.style.display = 'none';
    }

    // Navbar dropdown hover effect for desktop with improved interaction
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');

    function handleDropdownHover() {
        if (window.innerWidth >= 992) { // Only on desktop
            dropdowns.forEach(dropdown => {
                // Clear previous event listeners by cloning
                const clone = dropdown.cloneNode(true);
                dropdown.parentNode.replaceChild(clone, dropdown);

                // Add new event listeners
                clone.addEventListener('mouseenter', function() {
                    this.querySelector('.dropdown-menu').classList.add('show');
                    this.querySelector('.nav-link').classList.add('active');
                });

                clone.addEventListener('mouseleave', function() {
                    this.querySelector('.dropdown-menu').classList.remove('show');
                    this.querySelector('.nav-link').classList.remove('active');
                });
            });
        }
    }

    // Initial call
    handleDropdownHover();

    // Recalculate on window resize with debounce
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleDropdownHover, 250);
    });

    // Active link highlighting - removed duplicate function
    // This function is defined again later in the code, so we're removing this instance

    // Smooth scrolling with offset for dropdown items
    document.querySelectorAll('.dropdown-item[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }

                // Get the height of the fixed header
                const headerHeight = document.querySelector('header').offsetHeight;

                // Calculate the position to scroll to
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile navigation toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }

    // Form validation is now handled in the contact form section below

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (!emailInput) return;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                return;
            }

            // Simulate form submission
            const formElements = newsletterForm.elements;
            for (let i = 0; i < formElements.length; i++) {
                formElements[i].disabled = true;
            }

            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.textContent = 'Subscribing...';
            }

            // Simulate server response
            setTimeout(() => {
                newsletterForm.innerHTML = '<div class="alert alert-success">Thank you for subscribing to our newsletter!</div>';
            }, 1500);
        });
    }

    // Initialize Swiper for testimonials
    const testimonialSwiper = document.querySelector('.testimonial-swiper');
    if (testimonialSwiper) {
        new Swiper('.testimonial-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            },
        });
    }

    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Simplified and fixed highlightNavLink function
    let isScrolling = false;
    function highlightNavLink() {
        // Skip if already processing a scroll event
        if (isScrolling) return;

        isScrolling = true;

        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            const scrollPosition = window.scrollY + 100; // Offset for better highlighting

            // Remove active class from all links first
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            // Find the current section
            let currentSection = null;
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const sectionTop = section.offsetTop - 150; // Increased offset for better detection
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section;
                    break; // Exit the loop once we find the current section
                }
            }

            // Add active class to current section link if found
            if (currentSection) {
                const sectionId = currentSection.getAttribute('id');
                const currentLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (currentLink) {
                    currentLink.classList.add('active');
                }
            }

            isScrolling = false;
        });
    }

    // Initial call and add scroll event listener
    highlightNavLink();
    window.addEventListener('scroll', highlightNavLink);

    // EmailJS is now initialized in the HTML file

    // Contact form validation and submission with EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Add input focus effects
        const formInputs = contactForm.querySelectorAll('.form-control');

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Enhanced form validation
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            const phone = document.getElementById('phone');
            const subject = document.getElementById('subject');
            const privacyConsent = document.getElementById('privacy-consent');
            const submitButton = document.getElementById('submit-button');
            const emailStatus = document.getElementById('email-status');

            // Reset all validation states
            formInputs.forEach(input => {
                input.classList.remove('is-invalid');
            });

            // Validate name
            if (!name.value.trim()) {
                name.classList.add('is-invalid');
                isValid = false;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
                email.classList.add('is-invalid');
                isValid = false;
            }

            // Validate message
            if (!message.value.trim()) {
                message.classList.add('is-invalid');
                isValid = false;
            }

            // Validate privacy consent
            if (privacyConsent && !privacyConsent.checked) {
                privacyConsent.classList.add('is-invalid');
                privacyConsent.parentElement.classList.add('privacy-error');
                isValid = false;
            } else if (privacyConsent) {
                privacyConsent.parentElement.classList.remove('privacy-error');
            }

            // If form is valid, send email using EmailJS
            if (isValid) {
                // Show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                emailStatus.style.display = 'none';

                // Send the email using EmailJS if available, otherwise use a fallback
                if (typeof window.emailjs !== 'undefined') {
                    // Get the subject value
                    const subjectValue = document.getElementById('subject').value || 'Contact Form Submission';
                    const phoneValue = document.getElementById('phone').value || 'Not provided';

                    // Prepare the template parameters
                    const templateParams = {
                        user_name: name.value,
                        user_email: email.value,
                        user_phone: phoneValue,
                        subject: subjectValue,
                        message: message.value,
                        to_email: 'zentriumai@gmail.com',
                        cc_email: 'ramzyraheesh@gmail.com'
                    };

                    // Send the email using EmailJS
                    window.emailjs.send('service_zentrium', 'template_zentrium', templateParams)
                        .then(function(response) {
                            console.log('SUCCESS!', response.status, response.text);

                            // Show success message
                            emailStatus.className = 'alert alert-success';
                            emailStatus.innerHTML = '<strong>Thank you!</strong> Your message has been sent to zentriumai@gmail.com and ramzyraheesh@gmail.com. We will get back to you soon.';
                            emailStatus.style.display = 'block';

                            // Reset form
                            contactForm.reset();

                            // Reset button
                            submitButton.disabled = false;
                            submitButton.innerHTML = '<span class="button-content"><span class="button-text">Send Message</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span></span>';

                            // Remove success message after 5 seconds
                            setTimeout(() => {
                                emailStatus.style.display = 'none';
                            }, 5000);
                        })
                        .catch(function(error) {
                            console.log('FAILED...', error);

                            // Show error message
                            emailStatus.className = 'alert alert-danger';
                            emailStatus.innerHTML = '<strong>Oops!</strong> Something went wrong. Please try again later or contact us directly at zentriumai@gmail.com or ramzyraheesh@gmail.com.';
                            emailStatus.style.display = 'block';

                            // Reset button
                            submitButton.disabled = false;
                            submitButton.innerHTML = '<span class="button-content"><span class="button-text">Send Message</span><span class="button-icon"><i class="fas fa-paper-plane"></i></span></span>';
                        });
                } else {
                    // Fallback for when EmailJS is not available
                    // Create a mailto link as a fallback
                    const subject = encodeURIComponent(document.getElementById('subject').value || 'Contact Form Submission');
                    const phone = document.getElementById('phone').value || 'Not provided';
                    const body = encodeURIComponent(`Name: ${name.value}\nEmail: ${email.value}\nPhone: ${phone}\n\n${message.value}`);
                    const mailtoLink = `mailto:zentriumai@gmail.com,ramzyraheesh@gmail.com?subject=${subject}&body=${body}`;

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
            }
        });
    }

    // The enhanced chatbot functionality has been moved to separate files:
    // - chatbot.js: Core functionality and initialization
    // - chatbot-utils.js: Helper functions
    // - chatbot-responses.js: Response generation

    // This improves code organization and maintainability

    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');

    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    // Function to handle scroll animation
    function handleScrollAnimation() {
        animateElements.forEach(element => {
            if (isInViewport(element)) {
                if (element.classList.contains('fade-in')) {
                    element.classList.add('fade-in-active');
                } else if (element.classList.contains('slide-up')) {
                    element.classList.add('slide-up-active');
                } else if (element.classList.contains('slide-in-left')) {
                    element.classList.add('slide-in-left-active');
                } else if (element.classList.contains('slide-in-right')) {
                    element.classList.add('slide-in-right-active');
                }
            }
        });
    }

    // Initial check for elements in viewport
    handleScrollAnimation();

    // Enhanced animations for Why Choose Us cards
    function animateWhyUsCards() {
        const cards = document.querySelectorAll('.why-us-card');
        if (cards.length === 0) return;

        // Check if we're on mobile or tablet
        const isMobileOrTablet = window.innerWidth < 992;

        // Add staggered entrance animation only on desktop
        cards.forEach((card, index) => {
            // Only add floating animation on desktop
            if (!isMobileOrTablet) {
                card.style.animation = `floatCard 3s ease-in-out ${index * 0.2}s infinite alternate`;
            } else {
                // Remove any animations on mobile/tablet to prevent layout issues
                card.style.animation = 'none';
                card.style.transform = 'none';
            }

            // Only add 3D tilt effect on desktop/larger screens
            if (!isMobileOrTablet) {
                // Add hover effect for 3D tilt
                card.addEventListener('mousemove', function(e) {
                    const cardRect = card.getBoundingClientRect();
                    const cardCenterX = cardRect.left + cardRect.width / 2;
                    const cardCenterY = cardRect.top + cardRect.height / 2;
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;

                    // Calculate rotation based on mouse position
                    const rotateY = (mouseX - cardCenterX) / 20;
                    const rotateX = (cardCenterY - mouseY) / 20;

                    // Apply the rotation transform
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

                    // Make icon pop out more on hover
                    const icon = card.querySelector('.card-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1.1) translateZ(20px)';
                    }
                });

                // Reset card on mouse leave
                card.addEventListener('mouseleave', function() {
                    card.style.transform = '';

                    // Reset icon
                    const icon = card.querySelector('.card-icon');
                    if (icon) {
                        icon.style.transform = '';
                    }
                });
            } else {
                // For mobile devices, just add a simple tap effect on the icon
                const icon = card.querySelector('.card-icon');
                if (icon) {
                    icon.addEventListener('touchstart', function(e) {
                        e.stopPropagation(); // Prevent card event from firing
                        this.style.transform = 'scale(1.1)';
                    }, { passive: true });

                    icon.addEventListener('touchend', function() {
                        this.style.transform = '';
                    }, { passive: true });
                }
            }
        });

        // Add keyframe animation to stylesheet
        if (!document.querySelector('#card-animations')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'card-animations';
            styleSheet.textContent = `
                @keyframes floatCard {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes glowPulse {
                    0% {
                        box-shadow: 0 5px 15px rgba(79, 195, 247, 0.2);
                    }
                    50% {
                        box-shadow: 0 5px 25px rgba(79, 195, 247, 0.4);
                    }
                    100% {
                        box-shadow: 0 5px 15px rgba(79, 195, 247, 0.2);
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }

        // Handle window resize to update animations
        let resizeCardTimer;
        let lastWidth = window.innerWidth;

        window.addEventListener('resize', function() {
            clearTimeout(resizeCardTimer);
            resizeCardTimer = setTimeout(function() {
                // Only reinitialize if we cross a breakpoint (mobile/tablet <-> desktop)
                const currentWidth = window.innerWidth;
                const wasDesktop = lastWidth >= 992;
                const isNowDesktop = currentWidth >= 992;

                if (wasDesktop !== isNowDesktop) {
                    // Remove all event listeners by cloning cards
                    cards.forEach(card => {
                        // Reset any inline styles first
                        card.style.animation = '';
                        card.style.transform = '';

                        // Clone to remove event listeners
                        const clone = card.cloneNode(true);
                        card.parentNode.replaceChild(clone, card);
                    });

                    // Re-initialize animations
                    animateWhyUsCards();
                }

                lastWidth = currentWidth;
            }, 250);
        });
    }

    // Check on scroll
    window.addEventListener('scroll', handleScrollAnimation);

    // Booking calendar functionality
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic form validation
            let valid = true;
            const nameInput = document.getElementById('booking-name');
            const emailInput = document.getElementById('booking-email');
            const dateInput = document.getElementById('booking-date');
            const timeInput = document.getElementById('booking-time');

            // Reset previous error states
            [nameInput, emailInput, dateInput, timeInput].forEach(input => {
                if (input) input.classList.remove('is-invalid');
            });

            // Validate name
            if (nameInput && !nameInput.value.trim()) {
                nameInput.classList.add('is-invalid');
                valid = false;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && (!emailInput.value.trim() || !emailRegex.test(emailInput.value))) {
                emailInput.classList.add('is-invalid');
                valid = false;
            }

            // Validate date
            if (dateInput && !dateInput.value) {
                dateInput.classList.add('is-invalid');
                valid = false;
            }

            // Validate time
            if (timeInput && !timeInput.value) {
                timeInput.classList.add('is-invalid');
                valid = false;
            }

            // If form is valid, simulate form submission
            if (valid) {
                const formElements = bookingForm.elements;
                for (let i = 0; i < formElements.length; i++) {
                    formElements[i].disabled = true;
                }

                const submitButton = bookingForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.textContent = 'Booking...';
                }

                // Simulate server response
                setTimeout(() => {
                    bookingForm.innerHTML = '<div class="alert alert-success">Thank you for booking a consultation! We\'ll confirm your appointment shortly.</div>';
                }, 1500);
            }
        });
    }

    // Further optimized Sticky header on scroll with better performance
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    let ticking = false;

    // Use requestAnimationFrame for better performance
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // Only update classes if there's a significant change in scroll position
                if (Math.abs(scrollTop - lastScrollTop) > 5) {
                    if (scrollTop > 100) {
                        header.classList.add('sticky');

                        // Hide header when scrolling down, show when scrolling up
                        if (scrollTop > lastScrollTop + 10) {
                            header.classList.add('header-hidden');
                        } else if (lastScrollTop - scrollTop > 10) {
                            header.classList.remove('header-hidden');
                        }
                    } else {
                        header.classList.remove('sticky');
                        header.classList.remove('header-hidden');
                    }

                    lastScrollTop = scrollTop;
                }

                ticking = false;
            });

            ticking = true;
        }
    }, { passive: true }); // Passive flag for better performance

    // Optimized parallax effect with throttling and reduced complexity
    const parallaxElements = document.querySelectorAll('.parallax-effect');

    if (parallaxElements.length > 0) {
        let isMoving = false;

        // Mouse move parallax effect with throttling
        document.addEventListener('mousemove', function(e) {
            if (!isMoving) {
                requestAnimationFrame(function() {
                    const mouseX = e.clientX / window.innerWidth - 0.5;
                    const mouseY = e.clientY / window.innerHeight - 0.5;

                    // Reduced intensity for better performance
                    const intensity = 10;
                    const moveX = mouseX * intensity;
                    const moveY = mouseY * intensity;

                    // Simplified transform - removed 3D rotation for better performance
                    parallaxElements.forEach(element => {
                        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    });

                    isMoving = false;
                });

                isMoving = true;
            }
        }, { passive: true });

        // Reset position when mouse leaves
        document.addEventListener('mouseleave', function() {
            parallaxElements.forEach(element => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Add smooth scrolling behavior to the entire page
    document.documentElement.style.scrollBehavior = 'smooth';

    // Basic mobile optimizations
    if (window.innerWidth <= 768) {
        // Optimize images for mobile
        document.querySelectorAll('img').forEach(img => {
            // Add loading="lazy" attribute if not already present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            // Add decoding="async" for better performance
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }

    // Add CSS for hero element animations
    const style = document.createElement('style');
    style.textContent = `
        .hero-tagline, .hero h1, .hero-description, .hero-features,
        .hero-buttons, .hero-clients, .hero-image {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .fade-out {
            opacity: 0 !important;
            transition: opacity 0.5s ease !important;
        }

        .loader-animation {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
        }

        .loader-circle {
            width: 80px;
            height: 80px;
            border: 4px solid rgba(79, 195, 247, 0.2);
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }

        .loader-text {
            font-size: 1.2rem;
            color: var(--primary);
            margin-bottom: 15px;
            font-weight: 500;
        }

        .loader-progress {
            width: 200px;
            height: 4px;
            background: rgba(79, 195, 247, 0.2);
            border-radius: 4px;
            overflow: hidden;
        }

        .loader-progress-bar {
            height: 100%;
            background: var(--gradient-primary);
            width: 0%;
            transition: width 0.3s ease;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Optimized intersection observer for revealing elements on scroll
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (revealElements.length > 0) {
        const revealOptions = {
            threshold: 0.1, // Lower threshold for earlier triggering
            rootMargin: '0px 0px -50px 0px' // Smaller margin
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Unobserve after revealing for better performance
                    revealObserver.unobserve(entry.target);
                }
            });
        }, revealOptions);

        // Batch DOM operations for better performance
        requestAnimationFrame(() => {
            revealElements.forEach(element => {
                element.classList.add('reveal-hidden');
                revealObserver.observe(element);
            });
        });

        // Add CSS for reveal animations - simplified transitions
        const revealStyle = document.createElement('style');
        revealStyle.textContent = `
            .reveal-hidden {
                opacity: 0;
                transform: translateY(20px); /* Smaller transform distance */
                transition: opacity 0.5s ease, transform 0.5s ease; /* Faster transition */
            }

            .revealed {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(revealStyle);
    }
});
