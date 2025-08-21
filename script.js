// ===== Año dinámico =====
(function () {
  var y = document.getElementById("y");
  if (y) y.textContent = String(new Date().getFullYear());
})();

// ===== Menú móvil (limpio) =====
(function () {
  var btn = document.getElementById("btnHamb");
  var panel = document.getElementById("mobilePanel");
  var closeBtn = document.getElementById("btnClose");
  var overlay = document.getElementById("mobileOverlay");

  if (!btn || !panel || !overlay) return;

  function openPanel() {
    panel.classList.add("open");
    overlay.hidden = false;
    document.body.classList.add("no-scroll");
    btn.setAttribute("aria-expanded", "true");
    // foco accesible
    (closeBtn || panel).focus?.();
  }

  function closePanel() {
    panel.classList.remove("open");
    overlay.hidden = true;
    document.body.classList.remove("no-scroll");
    btn.setAttribute("aria-expanded", "false");
    btn.focus?.();
  }

  function togglePanel() {
    if (panel.classList.contains("open")) closePanel();
    else openPanel();
  }

  // Abrir/cerrar
  btn.addEventListener("click", function (e) { e.preventDefault(); togglePanel(); });
  closeBtn?.addEventListener("click", function () { closePanel(); });
  overlay.addEventListener("click", function () { closePanel(); });

  // Cerrar con ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
  });

  // Cerrar al pulsar un link del panel
  panel.addEventListener("click", function (e) {
    var a = e.target.closest("a"); if (!a) return;
    closePanel();
  });
})();

// ===== FAQ acordeón =====
(function () {
  var items = document.querySelectorAll(".faq-item");
  for (var i = 0; i < items.length; i++) {
    (function (item) {
      var q = item.querySelector(".faq-q");
      if (q) q.addEventListener("click", function () {
        item.classList.toggle("open");
      });
    })(items[i]);
  }
})();

// ===== Scroll suave =====
(function () {
  var anchors = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        if (el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else location.hash = id;
      }
    });
  }
})();

// ===== WhatsApp auto-msg =====
(function () {
  var form = document.getElementById("leadForm");
  var wa = document.getElementById("ctaWhats");
  var waBase = "https://wa.me/5215555555555?text="; // <-- cambia a tu número real

  function val(name) {
    var el = form && form.elements ? form.elements[name] : null;
    return el && typeof el.value === "string" ? el.value.trim() : "";
  }
  function buildMsg() {
    var n = val("nombre");
    var t = val("telefono");
    var e = val("email");
    var m = val("mensaje");
    return waBase + encodeURIComponent(
      "Hola, soy " + n + ". Mi tel " + t + ". Mi correo " + e + ". Quiero info: " + m
    );
  }
  function updateWA() { if (wa) wa.setAttribute("href", buildMsg()); }

  if (form && wa) {
    form.addEventListener("input", updateWA);
    form.addEventListener("change", updateWA);
    updateWA();
  }

  // Validación simple
  if (form) {
    form.addEventListener("submit", function (e) {
      var telInput = form.elements ? form.elements["telefono"] : null;
      var tel = telInput && telInput.value ? String(telInput.value).trim() : "";
      var regex = /^\+?52?\s?\d{10}$/;
      if (!regex.test(tel)) {
        e.preventDefault();
        alert("Por favor ingresa un número válido de 10 dígitos (ej. 5512345678).");
      }
    });
  }
})();

// ===== Aparición con IO =====
(function () {
  if (!("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      var ent = entries[i];
      if (ent.isIntersecting) {
        if (ent.target && ent.target.animate) {
          ent.target.animate(
            [{ opacity: 0, transform: "translateY(10px)" },
             { opacity: 1, transform: "none" }],
            { duration: 450, easing: "ease-out" }
          );
        }
        io.unobserve(ent.target);
      }
    }
  }, { threshold: 0.1 });

  var els = document.querySelectorAll(".feat, .testi, .plan, .card, .axis-card");
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
})();

