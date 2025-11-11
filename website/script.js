document.addEventListener('DOMContentLoaded', () => {
    // --- Global check, defined ONCE at the top ---
    const isDesktop = window.matchMedia("(min-width: 769px)").matches;

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    // QA FIX: Removed .accordion-question from this list as well, as it's not interactive
    // ADDED: .choice-btn and .zen-toggle-btn to interactive list
    const interactiveElements = document.querySelectorAll('a, button, .choice-btn, .zen-mode-btn, .accordion-question'); 

    if (isDesktop) { // Only run custom cursor on desktop
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
    }

    // --- Hero 3D Parallax Effect ---
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const particles = document.querySelectorAll('.hero-particle');

    if (isDesktop) { // This check now works
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { offsetWidth, offsetHeight } = hero;
            
            // Calculate rotation for the main content
            const xRotation = 20 * ((clientY - (hero.offsetTop + offsetHeight / 2)) / offsetHeight);
            const yRotation = 20 * ((clientX - (hero.offsetLeft + offsetWidth / 2)) / offsetWidth);
            heroContent.style.transform = `perspective(1000px) rotateX(${-xRotation}deg) rotateY(${yRotation}deg)`;

            // Animate particles based on data-depth
            particles.forEach(particle => {
                const depth = particle.getAttribute('data-depth');
                const moveX = (clientX - (hero.offsetLeft + offsetWidth / 2)) * depth / 10;
                const moveY = (clientY - (hero.offsetTop + offsetHeight / 2)) * depth / 10;
                particle.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
            });
        });

        hero.addEventListener('mouseleave', () => {
            heroContent.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            particles.forEach(particle => {
                particle.style.transform = `translateX(0px) translateY(0px)`;
            });
        });
    }

    // --- SVG Timeline Path Drawing ---
    const timelinePath = document.getElementById('timelinePath');
    const processSection = document.getElementById('process');
    
    // *** This now correctly selects ONLY the desktop content ***
    const timelineContents = document.querySelectorAll('.timeline > .timeline-content');
    
    let pathLength = 0;

    if (timelinePath) {
        pathLength = timelinePath.getTotalLength();
        timelinePath.style.strokeDasharray = pathLength;
        timelinePath.style.strokeDashoffset = pathLength;

        // Position timeline content along the path
        if (isDesktop) { // This check now works
            timelineContents.forEach(content => {
                const progress = parseFloat(content.getAttribute('data-path-point'));
                const point = timelinePath.getPointAtLength(pathLength * progress);
                content.style.left = `${point.x}px`;
                content.style.top = `${point.y}px`;
            });
        }
    }


    // --- Intersection Observer for SIMPLE Animations ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // QA FIX: Make observer bi-directional.
                // This will fade elements out when they leave the viewport.
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.intro-image, .lead-magnet');
    animatedElements.forEach(el => observer.observe(el));


    // Staggered animation for approach columns
    const approachColumnsContainer = document.querySelector('.approach-columns');
    const socialProofGrid = document.querySelector('.social-proof-grid');

    if (approachColumnsContainer || socialProofGrid) {
        const staggerObserver = new IntersectionObserver((entries, staggerObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // staggerObserver.unobserve(entry.target); // QA FIX: REMOVED to allow re-animation and fade-out.
                } else {
                    // QA FIX: Make observer bi-directional.
                    // This will fade elements out when they leave the viewport.
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.2 });
        
        if (approachColumnsContainer) {
            staggerObserver.observe(approachColumnsContainer);
        }
        if (socialProofGrid) {
            staggerObserver.observe(socialProofGrid);
        }
    }

    // --- Horizontal Scroll for Testimonials ---
    const horizontalSection = document.querySelector('.testimonials-horizontal-scroll');
    const scrollWrapper = document.querySelector('.horizontal-scroll-wrapper');
    const cards = document.querySelector('.testimonial-cards');
    let scrollAmount = 0;

    if (horizontalSection && scrollWrapper && cards && isDesktop) {
        const wrapperWidth = scrollWrapper.offsetWidth;
        const cardsWidth = cards.scrollWidth;
        scrollAmount = cardsWidth - wrapperWidth;
        
        if (scrollAmount > 0) {
            horizontalSection.style.height = `${scrollAmount + window.innerHeight}px`;
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

    // --- ADVANCED BREATHING TOOL LOGIC ---
    const toolSection = document.getElementById('breathing-tool');
    const startBreathBtn = document.getElementById('start-breath-tool');
    const lung = document.getElementById('living-lung');
    const breathInstruction = document.getElementById('breathing-instruction');
    const choiceMenu = document.getElementById('breathing-choice-menu');
    const choiceBtns = document.querySelectorAll('.choice-btn');
    const zenToggle = document.getElementById('zen-mode-toggle');

    if (toolSection && startBreathBtn && lung && breathInstruction && choiceMenu && zenToggle) {

        let isBreathing = false;
        let currentMode = 'calm'; // 'calm' or 'focus'
        let cycleTimeout = null;
        let synth = null;

        const patterns = {
            calm: {
                name: 'calm',
                timings: [
                    { state: 'inhale', duration: 4000, instruction: 'Inhale...' },
                    { state: 'hold', duration: 7000, instruction: 'Hold.' },
                    { state: 'exhale', duration: 8000, instruction: 'Exhale...' }
                ],
                sounds: { inhale: 'C4', hold: null, exhale: 'G3' },
                totalTime: 19000
            },
            focus: {
                name: 'focus',
                timings: [
                    { state: 'inhale', duration: 4000, instruction: 'Inhale...' },
                    { state: 'hold', duration: 4000, instruction: 'Hold.' },
                    { state: 'exhale', duration: 4000, instruction: 'Exhale...' },
                    { state: 'hold', duration: 4000, instruction: 'Hold.' }
                ],
                sounds: { inhale: 'C4', hold: null, exhale: 'G4', hold2: null },
                totalTime: 16000
            }
        };

        // --- Event Listeners ---

        // 1. Zen Mode Toggle
        zenToggle.addEventListener('click', () => {
            toolSection.classList.toggle('zen-mode');
        });

        // 2. Choice Menu
        choiceMenu.addEventListener('click', (e) => {
            if (!e.target.classList.contains('choice-btn')) return;
            if (isBreathing) stopBreathing(); // Stop if running

            currentMode = e.target.dataset.mode;

            choiceBtns.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            e.target.classList.add('active');
            e.target.setAttribute('aria-pressed', 'true');
        });

        // 3. Start Button
        startBreathBtn.addEventListener('click', () => {
            if (isBreathing) return;

            // Initialize Tone.js on first user interaction
            if (synth === null) {
                try {
                    synth = new Tone.Synth().toDestination();
                } catch (error) {
                    console.error("Tone.js could not be initialized:", error);
                    // Optionally, disable audio features if it fails
                }
            }

            startBreathing();
        });

        // 4. DEV FIX: Click lung to stop
        lung.addEventListener('click', () => {
            if (isBreathing) {
                stopBreathing();
            }
        });


        // --- Control Functions ---

        function startBreathing() {
            isBreathing = true;
            startBreathBtn.classList.add('hidden');
            breathInstruction.classList.remove('hidden');

            const pattern = patterns[currentMode];
            runCycle(pattern);
        }

        function stopBreathing() {
            isBreathing = false;
            clearTimeout(cycleTimeout);
            lung.className = 'living-lung idle';
            breathInstruction.textContent = 'Press Start';
            startBreathBtn.classList.remove('hidden');
        }

        // --- Main Animation Loop ---

        function runCycle(pattern) {
            let step = 0;
            // let totalTime = pattern.totalTime; // Not currently used, but good to have

            function nextStep() {
                if (!isBreathing) return;

                const currentStep = pattern.timings[step];
                
                // DEV FIX: Dynamically set transition duration to match the audio/logic
                const durationInSeconds = currentStep.duration / 1000;
                lung.style.transitionDuration = `${durationInSeconds}s`;

                // Update UI
                lung.className = `living-lung ${currentStep.state}`;
                breathInstruction.textContent = currentStep.instruction;

                // Play Sound
                if (synth) {
                    const sound = pattern.sounds[currentStep.state + (step === 3 ? '2' : '')]; // Handles 'hold2'
                    if (sound) {
                        synth.triggerAttackRelease(sound, `${currentStep.duration / 1000}s`);
                    }
                }

                // Set timeout for next step
                cycleTimeout = setTimeout(() => {
                    step = (step + 1) % pattern.timings.length; // Loop back
                    nextStep();
                }, currentStep.duration);
            }

            nextStep(); // Start the first step
        }
    }


    // --- Consolidated Scroll Animations (Desktop Only) ---
    const pricingCards = document.querySelectorAll('.pricing-card');
    const approachSection = document.querySelector('.approach');
    const faqSection = document.querySelector('.faq');

    let isScrolling = false;

    function handleScrollAnimations() {
        // This function is now only called inside the isDesktop check

        const viewportCenter = window.innerHeight / 2;

        // Testimonial Horizontal Scroll
        if (horizontalSection && scrollWrapper && cards && scrollAmount > 0) {
            const { top } = horizontalSection.getBoundingClientRect();
            if (top <= 0 && top >= -scrollAmount) {
                scrollWrapper.style.transform = `translateX(${top}px)`;
            } else if (top > 0) {
                scrollWrapper.style.transform = `translateX(0px)`;
            } else {
                scrollWrapper.style.transform = `translateX(${-scrollAmount}px)`;
            }
        }

        // SVG Timeline Path Drawing
        if (timelinePath && processSection) {
            const scrollY = window.scrollY;
            const sectionTop = processSection.offsetTop;
            const sectionHeight = processSection.offsetHeight;
            const viewportHeight = window.innerHeight;

            const scrollStart = sectionTop - viewportHeight * 0.8; 
            const scrollEnd = sectionTop + sectionHeight - viewportHeight * 0.2; 
            let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
            progress = Math.max(0, Math.min(1, progress));
            const drawLength = pathLength * progress;
            timelinePath.style.strokeDashoffset = pathLength - drawLength;
        }

        // Scroll-Driven Focus Scaling (Offerings Section)
        pricingCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - cardCenter);
            const maxDistance = viewportCenter + rect.height / 2; 
            let normalizedDistance = distance / maxDistance;
            normalizedDistance = Math.min(1, normalizedDistance); 
            const scale = 1.05 - (normalizedDistance * 0.1); 
            const opacity = 1 - (normalizedDistance * 0.3); 
            card.style.transform = `scale(${scale})`;
            card.style.opacity = opacity;
        });

        // Subtle Depth-Maker (Parallax Backgrounds)
        const applyParallax = (element) => {
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const scrollPos = rect.top;
                    element.style.backgroundPosition = `50% ${scrollPos * 0.3}px`;
                }
            }
        };
        applyParallax(approachSection);
        applyParallax(faqSection);
        
        isScrolling = false;
    }

    if (isDesktop) {
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                requestAnimationFrame(handleScrollAnimations);
                isScrolling = true;
            }
        });
// Initial call to set up animations on page load
        handleScrollAnimations();

        // --- NEW: Magnetic Buttons ---
        // QA FIX 3 (Usability): Removed '.accordion-question' to prevent jittery/distracting UI
        const magneticElements = document.querySelectorAll('.btn, header nav a, .footer-links a');
        
        magneticElements.forEach(el => {
            // QA FIX 1 (Performance): Add animationFrameId to throttle DOM updates
            let animationFrameId = null;

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Cancel previous frame to avoid running multiple updates
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }

                // Wrap the style update in requestAnimationFrame
                animationFrameId = requestAnimationFrame(() => {
                    // Move the element by 20% of the distance from its center
                    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                });
            });

            el.addEventListener('mouseleave', () => {
                // Cancel any pending mousemove frame
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                
                // Request a final frame to reset the position
                animationFrameId = requestAnimationFrame(() => {
                    el.style.transform = 'translate(0, 0)';
                });
            });
        });

        // --- NEW: 3D Tilt for Cards ---
        const tiltElements = document.querySelectorAll('.social-proof-card, .approach-column');
        
        const apply3DTilt = (element) => {
            // QA FIX 1 (Performance): Add animationFrameId to throttle DOM updates
            let animationFrameId = null;

            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const xRotation = 20 * ((e.clientY - rect.top - rect.height / 2) / rect.height);
                const yRotation = 20 * ((e.clientX - rect.left - rect.width / 2) / rect.width);
                
                // Cancel previous frame
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }

                // Wrap the style update in requestAnimationFrame
                animationFrameId = requestAnimationFrame(() => {
                    element.style.transform = `perspective(1000px) rotateX(${-xRotation}deg) rotateY(${yRotation}deg) scale(1.05)`;
                });
            });

            element.addEventListener('mouseleave', () => {
                // Cancel any pending mousemove frame
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }

                // Request a final frame to reset the position
                animationFrameId = requestAnimationFrame(() => {
                    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                });
            });
        };
        
        tiltElements.forEach(apply3DTilt);
    }
});

// --- Pre-loader Logic ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
    }
});