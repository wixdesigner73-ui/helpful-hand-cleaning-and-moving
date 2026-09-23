/* The Helpful Hand Cleaning and Moving Services — site scripts */
(function () {
  "use strict";

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header shadow on scroll
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Contact form
  var form = document.getElementById("contact-form");
  if (!form) return;

  // Pre-select a service when arriving from contact.html?service=...
  var params = new URLSearchParams(window.location.search);
  var preset = params.get("service");
  var select = form.querySelector("#service");
  if (preset && select) {
    Array.prototype.forEach.call(select.options, function (opt) {
      if (opt.value === preset) select.value = preset;
    });
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(field) {
    var input = field.querySelector("input, select, textarea");
    var value = input.value.trim();
    var valid = true;
    if (input.required && !value) valid = false;
    if (valid && input.type === "email" && value && !emailPattern.test(value)) valid = false;
    field.classList.toggle("invalid", !valid);
    return valid;
  }

  form.querySelectorAll(".field").forEach(function (field) {
    var input = field.querySelector("input, select, textarea");
    input.addEventListener("blur", function () { validateField(field); });
    input.addEventListener("input", function () {
      if (field.classList.contains("invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var allValid = true;
    form.querySelectorAll(".field").forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });
    if (!allValid) {
      var firstInvalid = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = new FormData(form);
    var name = (data.get("firstName") + " " + data.get("lastName")).trim();
    var subject = "Service Request: " + data.get("service") + " — " + name;
    var body =
      "Name: " + name + "\n" +
      "Email: " + data.get("email") + "\n" +
      "Phone: " + (data.get("phone") || "Not provided") + "\n" +
      "Service Needed: " + data.get("service") + "\n\n" +
      "Message:\n" + data.get("message");

    window.location.href =
      "mailto:helpfulhand814@gmail.com?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    var status = document.getElementById("form-status");
    if (status) {
      status.classList.add("show");
      status.focus();
    }
  });
})();
