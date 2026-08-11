document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a[data-nav]").forEach((link) => {
    if (link.dataset.nav === path) link.classList.add("active");
  });

  // Scroll-reveal animations
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Slower, eased in-page scrolling (native smooth-scroll feels abrupt)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function smoothScrollTo(targetY, duration = 700) {
    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
      return;
    }
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const header = document.querySelector(".site-header");
  const headerOffset = (header ? header.offsetHeight : 76) + 12;

  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    const probe = document.createElement("a");
    probe.href = link.getAttribute("href");
    if (probe.pathname !== window.location.pathname || !probe.hash) return;

    const target = document.querySelector(probe.hash);
    if (!target) return;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      smoothScrollTo(Math.max(targetY, 0));
      history.pushState(null, "", probe.hash);
    });
  });
});
