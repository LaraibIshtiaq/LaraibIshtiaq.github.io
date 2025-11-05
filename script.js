document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollArrow = document.querySelector('.scroll-arrow');
    const bottomNavItems = document.querySelectorAll('.nav-item');

    // Bottom navigation functionality
    bottomNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');
            const targetElement = document.getElementById(targetSection);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active navigation item based on scroll position
    const updateActiveNavItem = () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                bottomNavItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-section') === sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    };

    // Scroll progress indicator and navigation update
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
        updateActiveNavItem();
    });

    // Scroll arrow functionality
    scrollArrow.addEventListener('click', () => {
        document.querySelector('#about').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Intersection Observer for section animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add animation styles to sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });


    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }

    // Typing animation for hero text
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        typingText.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    typingText.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});

// Image carousel functionality
let currentSlideIndices = {};

function getCurrentSlide(carouselIndex) {
    return currentSlideIndices[carouselIndex] || 1;
}

function setCurrentSlide(carouselIndex, slideIndex) {
    currentSlideIndices[carouselIndex] = slideIndex;
}

function showSlide(n, carouselIndex) {
    const carousels = document.querySelectorAll('.image-carousel');
    const carousel = carousels[carouselIndex];
    if (!carousel) return;
    
    const images = carousel.querySelectorAll('.carousel-image');
    if (images.length === 0) return;
    
    // Find current active image
    const currentActive = carousel.querySelector('.carousel-image.active');
    
    // Remove active and prev classes from all images
    images.forEach(img => {
        img.classList.remove('active', 'prev');
    });
    
    // Slide out current image to the right
    if (currentActive) {
        currentActive.classList.add('prev');
    }
    
    // Add active class to new image (will slide in from left)
    const slideIndex = n - 1;
    if (images[slideIndex]) {
        images[slideIndex].classList.add('active');
        setCurrentSlide(carouselIndex, n);
    }
}

function nextSlide(carouselIndex) {
    const carousels = document.querySelectorAll('.image-carousel');
    const carousel = carousels[carouselIndex];
    if (!carousel) return;
    
    const images = carousel.querySelectorAll('.carousel-image');
    if (images.length === 0) return;
    
    const current = getCurrentSlide(carouselIndex);
    const next = current >= images.length ? 1 : current + 1;
    showSlide(next, carouselIndex);
}

function prevSlide(carouselIndex) {
    const carousels = document.querySelectorAll('.image-carousel');
    const carousel = carousels[carouselIndex];
    if (!carousel) return;
    
    const images = carousel.querySelectorAll('.carousel-image');
    if (images.length === 0) return;
    
    const current = getCurrentSlide(carouselIndex);
    const prev = current <= 1 ? images.length : current - 1;
    showSlide(prev, carouselIndex);
}

// Legacy function for compatibility
function currentSlide(n, carouselIndex) {
    showSlide(n, carouselIndex);
}

// Initialize carousels on page load
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.image-carousel');
    
    carousels.forEach((carousel, carouselIndex) => {
        const images = carousel.querySelectorAll('.carousel-image');
        
        // Initialize first slide
        if (images.length > 0) {
            setCurrentSlide(carouselIndex, 1);
            showSlide(1, carouselIndex);
        }
        
        // Auto-rotate only if multiple images
        if (images.length > 1) {
            setInterval(() => {
                nextSlide(carouselIndex);
            }, 5000);
        }
    });
}); 