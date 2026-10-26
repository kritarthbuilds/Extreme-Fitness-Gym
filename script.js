/*
  EXTREME FITNESS GYM — DEMO CONFIGURATION
  Before launch, replace the placeholders below with details verified by the gym owner.
*/
const GYM_CONFIG = {
  // Use the gym's official email address. Until then, the enquiry form shows a demo message.
  email: "",
  // Use full profile URLs, e.g. "https://www.instagram.com/officialhandle/"
  socials: {
    instagram: "",
    facebook: "",
    youtube: "",
    whatsapp: "" // Prefer a click-to-chat URL, e.g. https://wa.me/91XXXXXXXXXX
  }
};

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function closeMenu() {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("menu-open", isOpen);
});

mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => { if (window.innerWidth > 800) closeMenu(); });

document.getElementById("year").textContent = new Date().getFullYear();

// Highlight the current section in the desktop/mobile navigation.
const navLinks = [...document.querySelectorAll(".nav-link")];
const observedSections = navLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  observedSections.forEach(section => observer.observe(section));
}

// Membership buttons select a topic in the enquiry form.
document.querySelectorAll("[data-plan]").forEach(button => {
  button.addEventListener("click", () => {
    const interest = document.getElementById("interest");
    const plan = button.dataset.plan;
    interest.value = plan === "Personal Training" ? "Personal training" : "Membership";
    const message = document.getElementById("message");
    if (!message.value.trim()) message.value = `I'm interested in the ${plan} option. Please share the current fees and details.`;
  });
});

// Configure only verified official social links. Empty URLs remain non-clickable placeholders.
document.querySelectorAll("[data-social]").forEach(link => {
  const network = link.dataset.social;
  const url = GYM_CONFIG.socials[network];
  if (url && /^https:\/\/\S+/i.test(url)) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.classList.remove("social-placeholder");
  } else {
    link.addEventListener("click", event => {
      event.preventDefault();
      const status = document.getElementById("formStatus");
      status.textContent = `The gym's official ${network} link needs to be added before launch.`;
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    });
  }
});

// Demo form: uses mailto only after an official email is configured; no data is sent to a server.
document.getElementById("enquiryForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("formStatus");
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const interest = String(data.get("interest") || "General enquiry");
  const message = String(data.get("message") || "").trim();

  if (!name) {
    status.textContent = "Please enter your name.";
    document.getElementById("fullName").focus();
    return;
  }

  if (!GYM_CONFIG.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(GYM_CONFIG.email)) {
    status.textContent = "Demo mode: add the gym's verified email in script.js to enable enquiry emails.";
    return;
  }

  const subject = encodeURIComponent(`Website enquiry — ${interest}`);
  const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone || "Not provided"}\nInterest: ${interest}\nMessage: ${message || "No message provided"}\n\nSent from the Extreme Fitness Gym demo website.`);
  status.textContent = "Opening your email app…";
  window.location.href = `mailto:${GYM_CONFIG.email}?subject=${subject}&body=${body}`;
});
