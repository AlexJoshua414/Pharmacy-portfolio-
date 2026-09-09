document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year in Footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 2. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking any nav link on mobile
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 3. Copy Phone Number Functionality & Toast Notification
    const copyPhoneBtn = document.getElementById('copyPhoneBtn');
    const toast = document.getElementById('toast');
    const phoneNumber = '07044934896';

    function showToast() {
        if (!toast) return;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    if (copyPhoneBtn) {
        copyPhoneBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(phoneNumber).then(() => {
                showToast();
            }).catch(err => {
                console.error('Failed to copy phone number: ', err);
            });
        });
    }

    // 4. Scroll-Triggered Fade-In Animations (Intersection Observer)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // 5. Active Nav Link Highlighting While Scrolling
    const sections = document.querySelectorAll('section');
    
    function highlightNavLink() {
        let scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // 6. Contact Form Real Submission with Formspree
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && formMessage && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('senderName').value;
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formMessage.style.display = 'block';
                    formMessage.style.backgroundColor = 'var(--teal-light)';
                    formMessage.style.color = 'var(--teal-dark)';
                    formMessage.textContent = `Thank you, ${nameInput}! Your message has been sent successfully — I’ll reply soon.`;
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    formMessage.style.display = 'block';
                    formMessage.style.backgroundColor = '#fee2e2';
                    formMessage.style.color = '#991b1b';
                    formMessage.textContent = data.error || 'Oops! There was a problem submitting your form. Please try again.';
                }
            } catch (error) {
                formMessage.style.display = 'block';
                formMessage.style.backgroundColor = '#fee2e2';
                formMessage.style.color = '#991b1b';
                formMessage.textContent = 'Oops! Network error. Please try again or email me directly.';
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;

                // Hide message after a while
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 7000);
            }
        });
    }
});
