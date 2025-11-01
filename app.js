const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const navLogo = document.querySelector('#navbar__logo');

const mobileMenu = () => {
    menu.classList.toggle('active');
    menuLinks.classList.toggle('active');
}

menu.addEventListener('click', mobileMenu);

//Show active menu when scrolling
const highlightMenu = () => {
    const navbarHeight = 80; // Account for sticky navbar
    const scrollPos = window.scrollY + navbarHeight + 100; // Add offset for better accuracy
    
    // Get all sections
    const sections = [
        { element: document.querySelector('#home'), menu: document.querySelector('#home-page') },
        { element: document.querySelector('#about'), menu: document.querySelector('#about-page') },
        { element: document.querySelector('#features'), menu: document.querySelector('#features-page') },
        { element: document.querySelector('#sign-up'), menu: document.querySelector('#sign-up-page') }
    ];

    // Remove all highlights first
    sections.forEach(section => {
        if (section.menu) {
            section.menu.classList.remove('highlight');
            section.menu.classList.remove('highlight__button');
        }
    });
    
    // Only highlight on desktop screens
    if (window.innerWidth <= 960) return;
    
    // Find which section is currently in view
    let currentSection = null;
    
    sections.forEach(section => {
        if (section.element) {
            const sectionTop = section.element.offsetTop;
            const sectionBottom = sectionTop + section.element.offsetHeight;
            
            // Check if current scroll position is within this section
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section;
            }
        }
    });
    
    // If we're at the very top, always highlight home
    if (window.scrollY < 100) {
        currentSection = sections[0]; // Home section
    }
    
    // Highlight the current section
    if (currentSection && currentSection.menu) {
        // Check if it's the sign-up button (last section)
        if (currentSection === sections[3]) { // sign-up section
            currentSection.menu.classList.add('highlight__button');
        } else {
            currentSection.menu.classList.add('highlight');
        }
    }
}

window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);
window.addEventListener('resize', highlightMenu); // Recalculate on window resize

//Close mobile menu when clicking on a menu item
const hideMobileMenu = () => {
    if(window.innerWidth <= 960) { // Match your mobile breakpoint
        menu.classList.remove('active');
        menuLinks.classList.remove('active');
    }
}

// Add event listeners to each navigation link individually
document.querySelectorAll('.navbar__links').forEach(link => {
    link.addEventListener('click', hideMobileMenu);
});

// Also close mobile menu when clicking the sign-up button
document.querySelector('.button').addEventListener('click', hideMobileMenu);

// Close when clicking the logo
navLogo.addEventListener('click', hideMobileMenu);

// Helper: smooth scroll to element accounting for sticky navbar height
const getNavbarHeight = () => {
    const nav = document.querySelector('.navbar');
    return nav ? (nav.offsetHeight - 80 ) : 0;
};

const smoothScrollTo = (el) => {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - getNavbarHeight();
    window.scrollTo({ top, behavior: 'smooth' });
};

// Smooth scroll from Learn More button to About section accounting for sticky navbar
const learnMoreBtn = document.querySelector('.hero__button');
const aboutSection = document.querySelector('#about');
if(learnMoreBtn && aboutSection){
    learnMoreBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        smoothScrollTo(aboutSection);
    });
}

//smooth scroll from Features button to Features section accounting for sticky navbar
const readMoreBtn = document.querySelector('.main__btn');
const featuresSection = document.querySelector('#features');
if(readMoreBtn && featuresSection){
    readMoreBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        smoothScrollTo(featuresSection);
    });
}

// Intercept navbar hash links to use smoothScrollTo with correct offset
const navHashLinks = document.querySelectorAll('.navbar a[href^="#"]');
navHashLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            smoothScrollTo(targetEl);
            hideMobileMenu();
        }
    });
});


// -------------------------
// Signup form handling
// -------------------------
(function setupSignupForm(){
    const form = document.querySelector('.signup__form');
    if(!form) return;

    const emailInput = form.querySelector('#email');
    const nameInput = form.querySelector('#name');
    const privacyInput = form.querySelector('#privacy');
    const hpInput = form.querySelector('input[name="hp"]');

    // Count how many times the Subscribe button is clicked (console output only)
    let subscribeClickCount = 0;
    const subscribeBtn = form.querySelector('.signup__btn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', () => {
            subscribeClickCount++;
            console.log('Subscribe button clicks:', subscribeClickCount);
        });
    }

    // Create or reuse a status message element
        let status = form.querySelector('.signup__status');

    const setStatus = (type, message)=>{
        status.classList.remove('is-success','is-error','is-loading');
        if(type) status.classList.add(type);
        status.textContent = message || '';
    };

    const validateEmail = (value)=>{
        // Simple RFC-ish email check
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
    };

    form.addEventListener('submit', async (e)=>{
        e.preventDefault();

        // Basic validation
        const email = emailInput?.value?.trim();
        const name = nameInput?.value?.trim();
        const hp = hpInput?.value?.trim();
        const privacyChecked = !!privacyInput?.checked;

        if(!email || !validateEmail(email)){
            setStatus('is-error', 'Please enter a valid email address.');
            emailInput?.focus();
            return;
        }
        if(!privacyChecked){
            setStatus('is-error', 'Please accept the privacy policy to proceed.');
            privacyInput?.focus();
            return;
        }

        setStatus('is-loading', 'Submitting...');
        const submitBtn = form.querySelector('.signup__btn');
        if (submitBtn) submitBtn.disabled = true;

        // Allow the browser to perform a normal POST to the form action (Formspree)
        // This will navigate away / show Formspree response page unless you configured a redirect
        form.submit();
        return;
    });
})();