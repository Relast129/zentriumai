/**
 * Performance Optimization Script for Zentrium AI Website
 * This script implements various performance optimizations to make the website faster
 * while preserving the loading animation
 *
 * Version: 3.0 - Ultra Performance with Loading Animation
 */

// Execute immediately for critical optimizations
(function() {
    // Critical performance optimizations that should run immediately
    function criticalOptimizations() {
        // Check if we're in the loading phase
        const isLoading = document.getElementById('page-loader') !== null;

        // Don't disable animations during loading phase to allow loader animation
        if (!isLoading) {
            document.documentElement.classList.add('no-animations');
        }

        // Add a style tag to selectively disable animations
        // but preserve the loader animations
        const style = document.createElement('style');
        style.textContent = `
            /* Preserve loader animations */
            .page-loader, .loader-content, .loader-animation, .loader-circle,
            .loader-progress-bar, .progress-fill, .loader-text {
                animation-duration: initial !important;
                transition-duration: initial !important;
                animation-delay: initial !important;
                transition-delay: initial !important;
            }
        `;
        document.head.appendChild(style);

        // Remove animations after page load and loader completion
        window.addEventListener('load', function() {
            const checkLoaderGone = () => {
                if (document.getElementById('page-loader') === null) {
                    // Remove animation blocking after loader is gone
                    setTimeout(function() {
                        document.documentElement.classList.remove('no-animations');
                        style.remove();
                    }, 300);
                } else {
                    setTimeout(checkLoaderGone, 100);
                }
            };

            checkLoaderGone();
        });
    }

    // Now call the function
    criticalOptimizations();
})();

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Performance optimization functions
    initPerformanceOptimizations();
});

// Main performance optimization function is called when DOM is loaded

// Main performance optimization function
function initPerformanceOptimizations() {
    // Preload critical resources
    preloadCriticalResources();

    // Detect device capabilities
    detectDeviceCapabilities();

    // Optimize images with lazy loading
    optimizeImages();

    // Optimize animations
    optimizeAnimations();

    // Optimize scroll events
    optimizeScrollEvents();

    // Optimize resource loading
    optimizeResourceLoading();

    // Optimize event listeners
    optimizeEventListeners();

    // Add favicon dynamically to ensure it's loaded
    addDynamicFavicon();
}

// Optimize images by adding lazy loading and proper dimensions
function optimizeImages() {
    // Find all images without loading attribute
    const images = document.querySelectorAll('img:not([loading])');

    images.forEach(img => {
        // Add lazy loading to all images except the first visible ones
        if (!isInViewport(img)) {
            img.setAttribute('loading', 'lazy');
        }

        // Add decoding async for better performance
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }

        // Add width and height if missing to prevent layout shifts
        if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
            // Set default dimensions based on image type/location
            if (img.classList.contains('hero-image') || img.parentElement.classList.contains('hero-image-container')) {
                img.setAttribute('width', '600');
                img.setAttribute('height', '400');
            } else if (img.parentElement.classList.contains('member-image')) {
                img.setAttribute('width', '300');
                img.setAttribute('height', '300');
            } else {
                img.setAttribute('width', '400');
                img.setAttribute('height', '300');
            }
        }
    });
}

// Optimize animations by disabling them on low-end devices while preserving loader
function optimizeAnimations() {
    // Check if device is low-end
    const isLowEndDevice = isLowEnd();
    // Check if loader is present
    const isLoading = document.getElementById('page-loader') !== null;

    if (isLowEndDevice || window.innerWidth <= 768) {
        // Disable AOS animations
        if (window.AOS) {
            window.AOS.init({
                disable: true
            });
        }

        // Remove all animation classes except for loader
        document.querySelectorAll('[data-aos]').forEach(el => {
            // Skip loader elements
            if (!isLoading || !el.closest('.page-loader')) {
                el.removeAttribute('data-aos');
                el.removeAttribute('data-aos-delay');
                el.removeAttribute('data-aos-duration');
            }
        });

        // Disable other animations but preserve loader animations
        const style = document.createElement('style');
        style.textContent = `
            /* Disable most animations */
            .animate-in, .fade-in, .slide-up, .slide-in-left, .slide-in-right {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
                transition: none !important;
            }

            .hero-animation, .services-bg-animation, .services-particles {
                display: none !important;
            }

            /* Preserve loader animations */
            .page-loader, .loader-content, .loader-animation, .loader-circle,
            .loader-progress-bar, .progress-fill, .loader-text {
                animation-duration: initial !important;
                transition-duration: initial !important;
                opacity: initial !important;
                transform: initial !important;
                transition: initial !important;
            }

            /* Ensure loader animations work */
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Optimize scroll events with throttling
function optimizeScrollEvents() {
    // Replace all scroll event listeners with throttled versions
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'scroll') {
            // Throttle scroll events
            const throttledListener = throttle(listener, 100);
            originalAddEventListener.call(this, type, throttledListener, options);
        } else {
            originalAddEventListener.call(this, type, listener, options);
        }
    };

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Optimize resource loading
function optimizeResourceLoading() {
    // We already called preloadCriticalResources in initPerformanceOptimizations
    // So we'll just lazy load non-critical resources here
    lazyLoadNonCriticalResources();
}

// Preload critical resources
function preloadCriticalResources() {
    // Preload hero image
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage && heroImage.src) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = heroImage.src;
        document.head.appendChild(preloadLink);
    }
}

// Lazy load non-critical resources
function lazyLoadNonCriticalResources() {
    // Lazy load background images
    const elementsWithBgImages = document.querySelectorAll('.has-bg-image');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const bgImage = el.dataset.bgImage;
                if (bgImage) {
                    el.style.backgroundImage = `url(${bgImage})`;
                    observer.unobserve(el);
                }
            }
        });
    }, { rootMargin: '200px' });

    elementsWithBgImages.forEach(el => observer.observe(el));
}

// Optimize event listeners
function optimizeEventListeners() {
    // Use event delegation where possible
    document.addEventListener('click', function(e) {
        // Handle service card clicks
        if (e.target.closest('.service-card')) {
            const card = e.target.closest('.service-card');
            const link = card.querySelector('.service-link');
            if (link) {
                link.click();
            }
        }
    });
}

// Helper function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Detect device capabilities and set appropriate flags
function detectDeviceCapabilities() {
    // Create a global object to store device capabilities
    window.deviceCapabilities = {
        isLowEnd: isLowEnd(),
        isMobile: isMobileDevice(),
        isTablet: isTabletDevice(),
        isDesktop: !isMobileDevice() && !isTabletDevice(),
        supportsWebP: false,
        connectionType: getConnectionType(),
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // Check WebP support
    checkWebPSupport(function(supported) {
        window.deviceCapabilities.supportsWebP = supported;
    });

    // Add device-specific classes to the HTML element
    const htmlElement = document.documentElement;

    if (window.deviceCapabilities.isLowEnd) {
        htmlElement.classList.add('low-end-device');
    }

    if (window.deviceCapabilities.isMobile) {
        htmlElement.classList.add('mobile-device');
    } else if (window.deviceCapabilities.isTablet) {
        htmlElement.classList.add('tablet-device');
    } else {
        htmlElement.classList.add('desktop-device');
    }

    if (window.deviceCapabilities.prefersReducedMotion) {
        htmlElement.classList.add('reduced-motion');
    }

    // Log device capabilities for debugging
    console.log('Device capabilities:', window.deviceCapabilities);
}

// Helper function to check if device is low-end
function isLowEnd() {
    // Check for low memory
    if (navigator.deviceMemory && navigator.deviceMemory <= 4) {
        return true;
    }

    // Check for low CPU cores
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        return true;
    }

    // Check for mobile device with additional checks
    if (isMobileDevice() && (
        // Check for older devices or slow connection
        /Android 5|Android 6|iPhone OS 10|iPhone OS 11/i.test(navigator.userAgent) ||
        getConnectionType() === 'slow-2g' ||
        getConnectionType() === '2g'
    )) {
        return true;
    }

    return false;
}

// Helper function to check if device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
           window.innerWidth < 768;
}

// Helper function to check if device is tablet
function isTabletDevice() {
    return /iPad|Android/i.test(navigator.userAgent) &&
           window.innerWidth >= 768 &&
           window.innerWidth <= 1024;
}

// Helper function to get connection type
function getConnectionType() {
    const connection = navigator.connection ||
                      navigator.mozConnection ||
                      navigator.webkitConnection;

    if (connection) {
        return connection.effectiveType || 'unknown';
    }

    return 'unknown';
}

// Helper function to check WebP support
function checkWebPSupport(callback) {
    const webP = new Image();
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    webP.onload = webP.onerror = function() {
        callback(webP.height === 2);
    };
}

// Add favicon dynamically to ensure it's loaded
function addDynamicFavicon() {
    // Check if favicon already exists
    const existingFavicon = document.querySelector('link[rel="icon"]');

    if (!existingFavicon) {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = 'images/logo.ico';
        favicon.type = 'image/x-icon';
        document.head.appendChild(favicon);
    }

    // Force favicon refresh for browsers that might cache it
    const refreshFavicon = document.createElement('link');
    refreshFavicon.rel = 'shortcut icon';
    refreshFavicon.href = 'images/logo.ico';
    refreshFavicon.type = 'image/x-icon';
    document.head.appendChild(refreshFavicon);
}
