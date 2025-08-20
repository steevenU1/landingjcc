// ===== Año dinámico en el footer =====
const yearEl = document.getElementById("y");
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

// ===== Menú móvil =====
const btnHamb = document.getElementById("btnHamb");
const panel = document.getElementById("mobilePanel");
btnHamb?.addEventListener("click", () => panel?.classList.toggle("open"));
panel
  ?.querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => panel?.classList.remove("open"))
  );

// ===== FAQ acordeón =====
const faqs = document.querySelectorAll(".faq-item");
faqs.forEach((item) => {
  item
    .querySelector(".faq-q")
    ?.addEventListener("click", () => item.classList.toggle("open"));
});

// ===== Scroll suave =====
const anchors = document.querySelectorAll('a[href^="#"]');
anchors.forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== WhatsApp auto-msg dinámico =====
const form = document.getElementById("leadForm");
const wa = document.getElementById("ctaWhats");
const waBase = "https://wa.me/5215555555555?text="; // <-- cambia este número a tu WhatsApp real

function buildMsg() {
  const n = form?.nombre?.value?.trim() || "";
  const t = form?.telefono?.value?.trim() || "";
  const e = form?.email?.value?.trim() || "";
  const m = form?.mensaje?.value?.trim() || "";
  return (
    waBase +
    encodeURIComponent(
      `Hola, soy ${n}. Mi tel ${t}. Mi correo ${e}. Quiero info: ${m}`
    )
  );
}

// Actualiza el enlace mientras escriben y al cargar
["input", "change"].forEach((evt) =>
  form?.addEventListener(evt, () => wa?.setAttribute("href", buildMsg()))
);
if (form && wa) wa.setAttribute("href", buildMsg());

// ===== Validación básica del formulario =====
if (form) {
  form.addEventListener("submit", (e) => {
    const tel = form.telefono.value.trim();
    const regex = /^\+?52?\s?\d{10}$/;
    if (!regex.test(tel)) {
      e.preventDefault();
      alert(
        "Por favor ingresa un número válido de 10 dígitos (ej. 5512345678)."
      );
    }
  });
}

// ===== Animaciones de aparición (IntersectionObserver) =====
if ("IntersectionObserver" in window) {
  const appear = new IntersectionObserver(
    (entries) => {
      for (const ent of entries) {
        if (ent.isIntersecting) {
          ent.target.animate(
            [
              { opacity: 0, transform: "translateY(10px)" },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: 450,
              easing: "ease-out",
            }
          );
          appear.unobserve(ent.target);
        }
      }
    },
    { threshold: 0.1 }
  );

  // Incluimos las tarjetas nuevas de los ejes
  document
    .querySelectorAll(".feat, .testi, .plan, .card, .axis-card")
    .forEach((el) => appear.observe(el));
}