const navLinks = document.getElementById('nav-links');
const hamburger = document.getElementById('hamburger');
const closeBtn = document.getElementById('close-btn');

// Toggle navigation visibility
hamburger.addEventListener('click', () => {
    navLinks.classList.add('active');
});

// Close navigation when close button is clicked
closeBtn.addEventListener('click', () => {
    navLinks.classList.remove('active');
});
