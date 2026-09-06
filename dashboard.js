/**
 * Kamesh Aether Dashboard - Main JavaScript Module
 * Handles animations, interactions, and accessibility features
 */

// ============================================
// Configuration
// ============================================
const CONFIG = {
  magneticStrength: 0.15,
  magneticLerp: 0.15,
  orbSpeed: { min: 0.2, max: 0.5 },
  orbAmplitude: { min: 20, max: 50 },
  revealDelay: 80,
  scrollThreshold: 400,
  cursorThrottle: true,
};

// ============================================
// State
// ============================================
const state = {
  prefersReducedMotion: false,
  magneticData: new Map(),
  orbData: [],
  cursorRafId: null,
  backTopRafId: null,
  parallaxRafId: null,
};

// ============================================
// Utility Functions
// ============================================
const lerp = (current, target, factor) => current + (target - current) * factor;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// ============================================
// Ambient Orbs Animation
// ============================================
function initAmbientOrbs() {
  const orbs = document.querySelectorAll(".ambient-orb");
  state.orbData = Array.from(orbs).map((orb) => ({
    el: orb,
    angle: Math.random() * Math.PI * 2,
    speed:
      CONFIG.orbSpeed.min +
      Math.random() * (CONFIG.orbSpeed.max - CONFIG.orbSpeed.min),
    amp:
      CONFIG.orbAmplitude.min +
      Math.random() * (CONFIG.orbAmplitude.max - CONFIG.orbAmplitude.min),
  }));

  let orbRafId = null;
  function animateOrbs() {
    if (state.prefersReducedMotion) return;

    state.orbData.forEach((orb) => {
      orb.angle += 0.01 * orb.speed;
      const dx = Math.cos(orb.angle) * orb.amp;
      const dy = Math.sin(orb.angle) * orb.amp;
      orb.el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${1 + Math.sin(orb.angle) * 0.05})`;
    });
    state.orbRafId = requestAnimationFrame(animateOrbs);
  }
  state.orbRafId = requestAnimationFrame(animateOrbs);
}

// ============================================
// Body Cursor Spotlight
// ============================================
function initBodySpotlight() {
  if (state.prefersReducedMotion) return;

  document.addEventListener(
    "mousemove",
    (e) => {
      if (state.cursorRafId) return;
      state.cursorRafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--cursor-x",
          e.clientX + "px",
        );
        document.documentElement.style.setProperty(
          "--cursor-y",
          e.clientY + "px",
        );
        state.cursorRafId = null;
      });
    },
    { passive: true },
  );
}

// ============================================
// Card Cursor Spotlight
// ============================================
function initCardSpotlight() {
  if (state.prefersReducedMotion) return;

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", e.clientX - rect.left + "px");
      card.style.setProperty("--spot-y", e.clientY - rect.top + "px");
    }, { passive: true });
  });
}

// ============================================
// Button Light Sweep
// ============================================
function initButtonSweep() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty("--btn-x", x + "%");
      btn.style.setProperty("--btn-y", y + "%");
    }, { passive: true });
  });
}

// ============================================
// Magnetic Hover (Lerp-based) with Optimized Debounce
// ============================================
function initMagneticHover() {
  if (state.prefersReducedMotion) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const magneticElements = document.querySelectorAll(".card, .btn");

  magneticElements.forEach((el) => {
    state.magneticData.set(el, {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      isHovering: false,
    });

    // Apply will-change ONLY during active hover + animation
    el.addEventListener(
      "mouseenter",
      () => {
        const data = state.magneticData.get(el);
        if (data) {
          data.isHovering = true;
          el.style.willChange = "transform";
        }
      },
      { passive: true },
    );

    el.addEventListener(
      "mouseleave",
      () => {
        const data = state.magneticData.get(el);
        if (data) {
          data.isHovering = false;
          data.targetX = 0;
          data.targetY = 0;
        }
        // Remove will-change after animation settles
        setTimeout(() => {
          const d = state.magneticData.get(el);
          if (
            d &&
            !d.isHovering &&
            Math.abs(d.x) < 0.01 &&
            Math.abs(d.y) < 0.01
          ) {
            el.style.willChange = "auto";
          }
        }, 400);
      },
      { passive: true },
    );
  });

  function animateMagnetic() {
    if (state.prefersReducedMotion) return;

    magneticElements.forEach((el) => {
      const data = state.magneticData.get(el);
      if (!data) return;

      data.x = lerp(data.x, data.targetX, CONFIG.magneticLerp);
      data.y = lerp(data.y, data.targetY, CONFIG.magneticLerp);

      if (Math.abs(data.x) > 0.01 || Math.abs(data.y) > 0.01) {
        el.style.transform = `translate3d(${data.x}px, ${data.y}px, 0)`;
      } else if (data.x !== 0 || data.y !== 0) {
        el.style.transform = "";
        data.x = 0;
        data.y = 0;
        // Clean up will-change when settled and not hovering
        if (!data.isHovering) {
          el.style.willChange = "auto";
        }
      }
    });
    requestAnimationFrame(animateMagnetic);
  }

  // Throttled mousemove using rAF (better than debounce for smooth animation)
  const throttledMousemove = (el, e) => {
    const data = state.magneticData.get(el);
    if (!data || !data.isHovering) return;

    if (data.rafPending) return;
    data.rafPending = true;

    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * CONFIG.magneticStrength;
      const deltaY = (e.clientY - centerY) * CONFIG.magneticStrength;
      data.targetX = deltaX;
      data.targetY = deltaY;
      data.rafPending = false;
    });
  };

  magneticElements.forEach((el) => {
    el.addEventListener("mousemove", (e) => throttledMousemove(el, e), {
      passive: true,
    });
  });
}

// ============================================
// Scroll Reveal (IntersectionObserver)
// ============================================
function initScrollReveal() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(
            () => entry.target.classList.add("visible"),
            i * CONFIG.revealDelay,
          );
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
  );

  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));
}

// ============================================
// Back to Top Visibility
// ============================================
function initBackToTop() {
  const backTop = document.querySelector(".back-top");
  if (!backTop) return;

  window.addEventListener(
    "scroll",
    () => {
      if (state.backTopRafId) return;
      state.backTopRafId = requestAnimationFrame(() => {
        backTop.classList.toggle(
          "visible",
          window.scrollY > CONFIG.scrollThreshold,
        );
        state.backTopRafId = null;
      });
    },
    { passive: true },
  );

  // Smooth scroll to top
  backTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ============================================
// Scroll Progress Indicator
// ============================================
function initScrollProgress() {
  const progressBar = document.querySelector(".scroll-progress");
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = clamp(scrollTop / docHeight, 0, 1);
    progressBar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress(); // Initial call
}

// ============================================
// Hero Image Parallax
// ============================================
function initHeroParallax() {
  if (state.prefersReducedMotion) return;

  const heroImages = document.querySelectorAll(".card-hero .card-img img");
  if (heroImages.length === 0) return;

  window.addEventListener(
    "scroll",
    () => {
      if (state.parallaxRafId) return;
      state.parallaxRafId = requestAnimationFrame(() => {
        heroImages.forEach((img) => {
          const rect = img.getBoundingClientRect();
          const viewportCenter = window.innerHeight / 2;
          const distanceFromCenter =
            rect.top + rect.height / 2 - viewportCenter;
          const parallaxOffset = distanceFromCenter * 0.15;
          img.style.transform = `translateY(${parallaxOffset}px)`;
        });
        state.parallaxRafId = null;
      });
    },
    { passive: true },
  );
}

// ============================================
// Dynamic Year
// ============================================
function initDynamicYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ============================================
// Touch Support Fallbacks
// ============================================
function initTouchSupport() {
  // Add active states for touch devices
  document.querySelectorAll(".card, .btn").forEach((el) => {
    el.addEventListener(
      "touchstart",
      () => {
        el.classList.add("touch-active");
      },
      { passive: true },
    );

    el.addEventListener(
      "touchend",
      () => {
        setTimeout(() => el.classList.remove("touch-active"), 300);
      },
      { passive: true },
    );
  });
}

// ============================================
// Focus Trap Alignment for Magnetic Elements
// ============================================
function initFocusAlignment() {
  document.querySelectorAll(".card, .btn").forEach((el) => {
    el.addEventListener("focusin", () => {
      const data = state.magneticData.get(el);
      if (data) {
        data._storedTargetX = data.targetX;
        data._storedTargetY = data.targetY;
        data.targetX = 0;
        data.targetY = 0;
      }
    });
    el.addEventListener("focusout", () => {
      const data = state.magneticData.get(el);
      if (data && data._storedTargetX !== undefined) {
        data.targetX = data._storedTargetX;
        data.targetY = data._storedTargetY;
        delete data._storedTargetX;
        delete data._storedTargetY;
      }
    });
  });
}

// ============================================
// Page Visibility API - Pause Animations
// ============================================
function initPageVisibility() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Cancel all RAF loops to save battery
      if (state.cursorRafId) cancelAnimationFrame(state.cursorRafId);
      if (state.parallaxRafId) cancelAnimationFrame(state.parallaxRafId);
      if (state.backTopRafId) cancelAnimationFrame(state.backTopRafId);
      if (state.orbRafId) cancelAnimationFrame(state.orbRafId);
    }
  });
}

// ============================================
// Initialization
// ============================================
function init() {
  state.prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  initDynamicYear();
  initAmbientOrbs();
  initBodySpotlight();
  initCardSpotlight();
  initButtonSweep();
  initMagneticHover();
  initScrollReveal();
  initBackToTop();
  initScrollProgress();
  initHeroParallax();
  initTouchSupport();
  initFocusAlignment();
  initPageVisibility();
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Export for potential module usage
export { init, state, CONFIG };
