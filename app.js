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
