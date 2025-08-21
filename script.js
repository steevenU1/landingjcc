// ===== Año dinámico =====
(function () {
  var y = document.getElementById("y");
  if (y) y.textContent = String(new Date().getFullYear());
})();

/* ======================================================================
   Menú móvil (accesible)
====================================================================== */
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

  btn.addEventListener("click", function (e) { e.preventDefault(); togglePanel(); });
  closeBtn?.addEventListener("click", function () { closePanel(); });
  overlay.addEventListener("click", function () { closePanel(); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
  });

  panel.addEventListener("click", function (e) {
    var a = e.target.closest("a"); if (!a) return;
    closePanel();
  });
})();

/* ======================================================================
   FAQ acordeón
====================================================================== */
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

/* ======================================================================
   Scroll suave
====================================================================== */
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

/* ======================================================================
   WhatsApp auto-msg + Envío AJAX a Formspree (sin redirección)
====================================================================== */
(function () {
  var form = document.getElementById("leadForm");
  var wa = document.getElementById("ctaWhats");
  var statusEl = document.getElementById("formStatus");

  // ⚠️ Cambia a tu número real (formato wa.me sin +)
  // Ejemplo MX: 52155XXXXXXXX   | Ejemplo US: 1XXXXXXXXXX
  var waBase = "https://wa.me/5215555555555?text=";

  function val(name) {
    var el = form && form.elements ? form.elements[name] : null;
    return el && typeof el.value === "string" ? el.value.trim() : "";
  }

  function buildMsg() {
    var n = val("nombre");
    var t = val("telefono");
    var e = val("email");
    var m = val("mensaje");
    var texto = "Hola, soy " + n + ". Mi tel " + t + ". Mi correo " + e + ". Quiero info: " + m;
    return waBase + encodeURIComponent(texto);
  }

  function updateWA() {
    if (wa) wa.setAttribute("href", buildMsg());
  }

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "form-status" + (type ? " " + type : "");
    // Accesibilidad: anunciar cambios a lectores de pantalla
    statusEl.setAttribute("aria-live", "polite");
  }

  if (!form) return;

  // Actualiza el enlace de WhatsApp con los datos del formulario
  if (wa) {
    form.addEventListener("input", updateWA);
    form.addEventListener("change", updateWA);
    updateWA();
  }

  // Submit con fetch hacia Formspree (no redirección)
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validación de teléfono (10 dígitos mexicanos, con o sin +52)
    var telInput = form.elements["telefono"];
    var tel = telInput && telInput.value ? String(telInput.value).trim() : "";
    var regex = /^\+?52?\s?\d{10}$/;
    if (!regex.test(tel)) {
      setStatus("Por favor ingresa un número válido de 10 dígitos (ej. 5512345678).", "error");
      telInput && telInput.focus();
      return;
    }

    // Evitar doble envío
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Enviando…"; }
    setStatus("Enviando…");

    try {
      var res = await fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });

      if (res.ok) {
        form.reset();
        updateWA();
        setStatus("Recibimos tus datos, estaremos en contacto contigo pronto", "ok");
      } else {
        var data = await res.json().catch(function(){ return {}; });
        var msg = (data && data.errors && data.errors.map(function(e){ return e.message; }).join(", "))
                  || "No se pudo enviar el formulario. Intenta de nuevo.";
        setStatus(msg, "error");
      }
    } catch (err) {
      setStatus("Hubo un error de conexión. Inténtalo más tarde.", "error");
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
    }
  });
})();

/* ======================================================================
   Aparición con IntersectionObserver
====================================================================== */
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

