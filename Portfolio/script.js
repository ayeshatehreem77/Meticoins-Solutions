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

// -------- Services Modal --------
let servicesMap = {};

async function loadServices() {
  try {
    const res = await fetch("services.json");
    servicesMap = await res.json();
  } catch (err) {
    console.error("❌ Error loading services.json", err);
  }
}

function openServiceModal(service) {
  const modal = document.getElementById("service-modal");

  const titleEl = modal.querySelector("#service-title");
  const subtitleEl = modal.querySelector("#service-subtitle");
  const descEl = modal.querySelector("#service-description");
  const sectionsEl = modal.querySelector("#service-sections");
  const driversEl = modal.querySelector("#service-drivers");
  const toolsEl = modal.querySelector("#service-tools");
  const whyUsEl = modal.querySelector("#why-us");
  const ctaEl = modal.querySelector("#service-cta");

  // Hero classes
  const heroSection = modal.querySelector(".service-hero");
  heroSection.className = "service-hero";
  switch (service.id) {
    case "amazon": heroSection.classList.add("hero-amazon"); break;
    case "digital-marketing": heroSection.classList.add("hero-digital"); break;
    case "graphic-design": heroSection.classList.add("hero-graphic"); break;
    case "ecommerce": heroSection.classList.add("hero-ecommerce"); break;
    case "tiktok-shop": heroSection.classList.add("hero-tiktok"); break;
  }

  // Fill content...
  titleEl.textContent = service.title || "";
  subtitleEl.textContent = service.subtitle || "";
  descEl.textContent = service.description || "";

  // Sections
  sectionsEl.innerHTML = "";
  if (service.services) {
    sectionsEl.innerHTML = `
      <div class="modal-service-title"><h4>${service.sub_services}</h4></div>
      <div class="modal-service-container">
        ${service.services.map(s => `
          <div class="modal-service-block">
            <div class="category-header">
              <div class="service-icon">${s.icon || ""}</div>
              <div class="category-title">${s.category}</div>
            </div>
            <div class="category-description">${s.category_description || ""}</div>
            <hr class="separator">
            <ul class="category-items">
              ${s.items.map(item => `<li>${item}</li>`).join("")}
            </ul>
          </div>`).join("")}
      </div>`;
  }

  // Drivers
  driversEl.innerHTML = "";
  if (service.drivers) {
    driversEl.innerHTML = `
      <h4 class="driver-title">${service.drivers_title}</h4>
      <div class="drivers-container">
        ${service.drivers.map(d => `
          <div class="driver-block">
            <div class="driver-icon">${d.icon || ""}</div>
            <div class="driver-info">
              <h5>${d.title}</h5>
              <p>${d.description}</p>
            </div>
          </div>`).join("")}
      </div>`;
  }

  // Tools
  toolsEl.innerHTML = "";
  if (service.tools) {
    toolsEl.innerHTML = `
      <h4 class="tools-title">${service.tools_title}</h4>
      <div class="tools-grid">
        ${service.tools.map(tool => `
          <div class="tool-card">
            <img class="tool-icon" src="${tool.logo}" alt="${tool.title}" />
            <span>${tool.title}</span>
          </div>`).join("")}
      </div>
      <p class="tools-note">...and other industry-standard tools for professional results</p>`;
  }

  // Why Us
  whyUsEl.innerHTML = "";
  if (service.why_us) {
    whyUsEl.innerHTML = `
      <h4 class="why-us-title">Why Choose Meticoin Solutions?</h4>
      <div class="why-us-list">
        ${service.why_us.map(reason => `<div class="why-us-item">${reason}</div>`).join("")}
      </div>`;
  }

  // CTA
  ctaEl.innerHTML = "";
  if (service.cta) {
    ctaEl.innerHTML = `
      <div class="cta-content">
        <h4 class="cta-title">${service.cta.title}</h4>
        <p class="cta-description">${service.cta.description}</p>
        <p class="cta-note"><em>${service.cta.note}</em></p>
      </div>`;
  }

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeServiceModal() {
  document.getElementById("service-modal").style.display = "none";
  document.body.style.overflow = "auto";
}

// Init services
document.addEventListener("DOMContentLoaded", async () => {
  await loadServices();
  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.getAttribute("data-service");
      const service = servicesMap[key];
      if (service) openServiceModal(service);
    });
  });

  document.getElementById("service-modal-close").addEventListener("click", closeServiceModal);
  document.getElementById("service-modal").addEventListener("click", (e) => {
    if (e.target.id === "service-modal") closeServiceModal();
  });
});


// -------- Case Studies Modal --------
let caseStudiesMap = {};

// Load case-studies.json
async function loadCaseStudies() {
  try {
    const res = await fetch("case-studies.json");
    const data = await res.json();
    caseStudiesMap = {};
    (data.case_studies || []).forEach(study => {
      caseStudiesMap[study.id] = study;
    });
  } catch (err) {
    console.error("❌ Error loading case-studies.json", err);
  }
}

// Open modal
function openCaseModal(study) {
  const modal = document.getElementById("case-modal");
  if (!modal) return;

  // Title
  const titleEl = modal.querySelector("#case-title");
  titleEl.textContent = study.modal_title || "";

  // Sections
  const sectionsEl = modal.querySelector("#case-sections");
  sectionsEl.innerHTML = "";
  if (study.sections) {
    study.sections.forEach(section => {
      sectionsEl.innerHTML += `
        <div class="mb-3">
          <h5><strong>${section.heading}</strong></h5>
          <p>${section.content}</p>
        </div>`;
    });
  }

  // Images (grid display styled like Framer cards)
const imagesDiv = modal.querySelector("#case-images");
imagesDiv.innerHTML = "";

if (study.images && study.images.length > 0) {
  study.images.forEach((img, index) => {
    imagesDiv.innerHTML += `
      <div class="case-modal-card card-${index + 1}">
        <img src="${img.url}" alt="${img.caption}">
      </div>`;
  });
}



  // Show modal
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

// Close modal
function closeCaseModal() {
  const modal = document.getElementById("case-modal");
  if (!modal) return;
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Init
document.addEventListener("DOMContentLoaded", async () => {
  await loadCaseStudies();

  // Attach click events to buttons
  document.querySelectorAll(".view-case").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      const study = caseStudiesMap[id];
      if (study) openCaseModal(study);
    });
  });

  // Close modal
  document.getElementById("case-modal-close").addEventListener("click", closeCaseModal);
  document.getElementById("case-modal").addEventListener("click", (e) => {
    if (e.target.id === "case-modal") closeCaseModal();
  });
});
