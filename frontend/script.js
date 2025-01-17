const menuIcon = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');
const mobileSidebar = document.querySelector('.mobile-sidebar');
const overlay = document.createElement('div');

overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Open sidebar
menuIcon.addEventListener('click', () => {
  mobileSidebar.classList.add('active');
  overlay.classList.add('active');
});

// Close sidebar
closeIcon.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

function closeSidebar() {
  mobileSidebar.classList.remove('active');
  overlay.classList.remove('active');
}


//recaptcha


function onClick(e) {
  e.preventDefault();
  grecaptcha.enterprise.ready(async () => {
    const token = await grecaptcha.enterprise.execute('6LelZLIqAAAAAHu2RwA7HNw6NTzuumUs4g5K8uQ3', {action: 'LOGIN'});
  });
}
