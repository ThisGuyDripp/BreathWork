document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const interactiveElements = document.querySelectorAll('a, button, .accordion-question');

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        cursorDot.style.left = `${clientX}px`;
        cursorDot.style.top = `${clientY}px`;
        cursorOutline.style.left = `${clientX}px`;
        cursorOutline.style.top = `${clientY}px`;
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });

    // --- Hero 3D Tilt Effect ---
    const heroContent = document.querySelector('.hero-content');
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = hero;
        const xRotation = 20 * ((clientY - offsetHeight / 2) / offsetHeight);
        const yRotation = 20 * ((clientX - offsetWidth / 2) / offsetWidth);
        heroContent.style.transform = `perspective(1000px) rotateX(${-xRotation}deg) rotateY(${yRotation}deg)`;
    });
     hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });


    // --- Intersection Observer for Animations ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    // Observe intro image
    const introImage = document.querySelector('.intro-image');
    if(introImage) observer.observe(introImage);

    // Staggered animation for approach columns
    const approachColumnsContainer = document.querySelector('.approach-columns');
    if (approachColumnsContainer) {
        // Note: This requires CSS to handle the staggered animation of children.
        // e.g., .approach-columns.is-visible .approach-column:nth-child(n) { transition-delay: n * 150ms; }
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.2 });
        staggerObserver.observe(approachColumnsContainer);
    }

    // Timeline animation
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.5 });
        timelineObserver.observe(timeline);

        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => observer.observe(item));
    }

    // --- Horizontal Scroll for Testimonials ---
    const horizontalSection = document.querySelector('.testimonials-horizontal-scroll');
    const scrollWrapper = document.querySelector('.horizontal-scroll-wrapper');
    const cards = document.querySelector('.testimonial-cards');

    if (horizontalSection && scrollWrapper && cards && window.matchMedia("(min-width: 769px)").matches) {
        const wrapperWidth = scrollWrapper.offsetWidth;
        const cardsWidth = cards.scrollWidth; // Use scrollWidth for the full content width
        
        const scrollAmount = cardsWidth - wrapperWidth;
        
        if (scrollAmount > 0) {
            horizontalSection.style.height = `${scrollAmount + window.innerHeight}px`;

            window.addEventListener('scroll', () => {
                const { top } = horizontalSection.getBoundingClientRect();
                
                if (top <= 0 && top >= -scrollAmount) {
                    scrollWrapper.style.transform = `translateX(${top}px)`;
                } else if (top > 0) {
                    scrollWrapper.style.transform = `translateX(0px)`;
                } else {
                    scrollWrapper.style.transform = `translateX(${-scrollAmount}px)`;
                }
            });
        }
    }


    // --- FAQ Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const question = item.querySelector('.accordion-question');
        const answer = item.querySelector('.accordion-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('.accordion-answer').style.maxHeight = '0px';
                }
            });

            if (isOpen) {
                item.classList.remove('open');
                answer.style.maxHeight = '0px';
            } else {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('header nav');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('is-active');
        nav.classList.toggle('is-active');
    });
});
