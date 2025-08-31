AOS.init({
    once: true,
    duration: 800,
    offset: 120,
});

// Initialize EmailJS
(function () {
    emailjs.init("LSBM0l5JQQY78vctA"); // You'll need to replace this with your actual EmailJS public key
})();

const nav = document.querySelector('nav');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector(".nav-links");

// Contact form handling
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const thankYouModal = document.getElementById('thank-you-modal');
const modalClose = document.getElementById('modal-close');
const modalCloseBtn = document.getElementById('modal-close-btn');

// Modal close functions
function closeModal() {
    thankYouModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside
if (thankYouModal) {
    thankYouModal.addEventListener('click', function (e) {
        if (e.target === thankYouModal) {
            closeModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && thankYouModal.style.display === 'block') {
        closeModal();
    }
});

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        formStatus.style.display = 'none';

        // EmailJS template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_name: 'BYTE BUILD TECH',
            to_email: 'sales@bytebuild.org'
        };

        // Send email using EmailJS
        emailjs.send('service_n8uzhqi', 'template_jyarjnm', templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);

                // Show beautiful modal
                thankYouModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling

                // Reset form
                contactForm.reset();
            }, function (error) {
                console.log('FAILED...', error);

                // Show error message
                formStatus.innerHTML = '❌ <strong>Oops! Something went wrong.</strong><br>Please try again or contact us directly.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            })
            .finally(function () {
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            });
    });
}

window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);

    menuToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    nav.classList.toggle("open");
});

/* close menu when clicking a link (mobile) */
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            nav.classList.remove("open");

        }
    });
});

const swiper = new Swiper('.swiper', {
    slidesPerView: 3,
    spaceBetween: 20,
    loop: true,
    speed: 400,  // Much faster transitions
    autoplay: {
        delay: 1500,  // Faster autoplay - 1.5 seconds
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },
    allowTouchMove: true,
    grabCursor: true,
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 15
        },
        600: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        992: {
            slidesPerView: 3,
            spaceBetween: 20
        },
        1200: {
            slidesPerView: 4,
            spaceBetween: 25
        }
    }
});


const statNumbers = document.querySelectorAll('.stat-number');

const animateStats = () => {
    statNumbers.forEach(stat => {
        const target = +stat.textContent.replace('+', '').replace('%', '');
        const isPercent = stat.textContent.includes('%');
        const isPlus = stat.textContent.includes('+');
        let count = 0;

        const duration = 2000; // total animation duration in ms
        const frameRate = 60;  // 60 frames per second
        const totalFrames = Math.round(duration / (1000 / frameRate));
        const increment = target / totalFrames;

        const update = () => {
            count += increment;
            if (count < target) {
                stat.textContent = isPlus
                    ? `${Math.floor(count)}+`
                    : isPercent
                        ? `${Math.floor(count)}%`
                        : Math.floor(count);
                requestAnimationFrame(update);
            } else {
                stat.textContent = isPlus
                    ? `${target}+`
                    : isPercent
                        ? `${target}%`
                        : target;
            }
        };

        update();
    });
};

let statsStarted = false;
window.addEventListener('scroll', () => {
    const statsSection = document.getElementById('stats');
    const sectionTop = statsSection.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight - 100;

    if (sectionTop < triggerPoint && !statsStarted) {
        animateStats();
        statsStarted = true;
    }
});

// services modal


// Load services.json as an object keyed by id
async function loadServicesMap() {
    try {
        const res = await fetch('services.json');
        if (!res.ok) {
            console.error('Failed to fetch services.json:', res.status, res.statusText);
            return null;
        }
        const data = await res.json();
        return data; // expected shape: { "amazon": {...}, "web-dev": {...} }
    } catch (err) {
        console.error('Error parsing services.json:', err);
        return null;
    }
}

// Service modal
function openServiceModal(service) {
    if (!service) return;

    const titleEl = document.getElementById('service-title');
    const descEl = document.getElementById('service-description');
    const featsEl = document.getElementById('service-features');
    const modal = document.getElementById('service-modal');
    const modalContent = modal?.querySelector('.service-modal-content');

    if (titleEl) titleEl.textContent = service.title || '';
    if (descEl) descEl.textContent = service.description || '';

    // 🔹 Build services sections
    if (featsEl) {
        featsEl.innerHTML = `<h1>${service.title2}</h1>`;

       if (service.services) {
    const gridWrapper = document.createElement("div");
    gridWrapper.classList.add("service-blocks"); // GRID WRAPPER

    service.services.forEach(section => {
        const block = document.createElement('div');
        block.classList.add('modal-service-card');

        block.innerHTML = `
          <div class="service-card-header">
            <span class="service-icon">${section.icon || ''}</span>
            <h3 class="service-category">${section.category}</h3>
          </div>
          <ul class="service-list">
            ${section.items.map(item => `<li> ${item}</li>`).join("")}
          </ul>
        `;

        gridWrapper.appendChild(block);
    });

    featsEl.appendChild(gridWrapper); // add the grid to modal
}

    }

    // 🔹 Add drivers (optional bottom section)
    if (service.drivers) {
        const driversWrapper = document.createElement('div');
        driversWrapper.classList.add('drivers-grid');
        driversWrapper.innerHTML = `
            <h3 class="drivers-title">${service.title3}</h3>
            <div class="drivers-cards">
                ${service.drivers.map(d => `
                    <div class="driver-card">
                        <div class="driver-icon">${d.icon}</div>
                        <div class="driver-text">
                        <h4>${d.title}</h4>
                        <p>${d.description}</p>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
        featsEl.appendChild(driversWrapper);
    }

    // CHANGE THEME ACCORDING TO SERVICE 
    if (modalContent) {
        modalContent.classList.remove('theme-webdev', 'theme-design', 'theme-marketing');
        if (service.theme) {
            modalContent.classList.add(`theme-${service.theme}`);
        }
    }

    if (modal) modal.style.display = 'flex';
    document.body.style.overflow = "hidden";
}


// Attach click handlers to .service-card
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', async () => {
        const serviceId = card.getAttribute('data-service');
        if (!serviceId) {
            console.warn('service-card missing data-service attribute', card);
            return;
        }

        const servicesMap = await loadServicesMap();
        if (!servicesMap) return;

        const service = servicesMap[serviceId]; // direct lookup
        if (!service) {
            console.warn('No service found for id:', serviceId, 'Available keys:', Object.keys(servicesMap));
            return;
        }

        openServiceModal(service);
    });

    // close the modal
    document.querySelector(".modal-close").addEventListener("click", () => {
        document.getElementById("service-modal").style.display = "none";
        document.body.style.overflow = "auto";
    });
    const serviceModal = document.getElementById("service-modal");

    serviceModal.addEventListener("click", (e) => {
        if (e.target === serviceModal) {
            serviceModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
});