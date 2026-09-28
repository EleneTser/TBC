/**
 * Apex Landing Page - Client-Side JavaScript
 * Pure Vanilla JavaScript (No Frameworks/Libraries)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. Theme Toggle (Dark / Light Mode)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlRoot = document.documentElement;
  const THEME_STORAGE_KEY = 'apex_preferred_theme';

  // Initialize theme based on local storage or system preference
  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      htmlRoot.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlRoot.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  };

  const toggleTheme = () => {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  initTheme();

  // Listen to system changes if user hasn't explicitly set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      htmlRoot.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });

  // ==========================================================================
  // 2. Sticky Header & Back to Top Scroll Behavior
  // ==========================================================================
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header blur/shadow on scroll
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // 3. Mobile Navigation Menu Toggle
  // ==========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  const toggleMobileNav = (forceClose = false) => {
    if (!hamburgerBtn || !mobileNav) return;

    const shouldOpen = forceClose ? false : !mobileNav.classList.contains('is-open');

    if (shouldOpen) {
      mobileNav.classList.add('is-open');
      hamburgerBtn.classList.add('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
    } else {
      mobileNav.classList.remove('is-open');
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileNav());
  }

  // Close mobile nav when clicking any nav link
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileNav(true);
    });
  });

  // Close mobile menu if clicked outside
  document.addEventListener('click', (event) => {
    if (mobileNav && mobileNav.classList.contains('is-open')) {
      if (!mobileNav.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        toggleMobileNav(true);
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
      toggleMobileNav(true);
    }
  });

  // ==========================================================================
  // 4. Scroll Spy - Active Navigation Link Highlighting
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // ==========================================================================
  // 5. Toast Notification System
  // ==========================================================================
  const toast = document.getElementById('toast-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');
  const toastCloseBtn = document.getElementById('toast-close-btn');
  let toastTimeoutId = null;

  const showToast = (title, message, isError = false) => {
    if (!toast) return;

    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    if (isError) {
      toast.classList.add('toast-error');
      document.getElementById('toast-icon').textContent = '✕';
    } else {
      toast.classList.remove('toast-error');
      document.getElementById('toast-icon').textContent = '✓';
    }

    toast.classList.add('is-visible');
    toast.setAttribute('aria-hidden', 'false');

    // Auto dismiss after 5 seconds
    toastTimeoutId = setTimeout(() => {
      hideToast();
    }, 5000);
  };

  const hideToast = () => {
    if (!toast) return;
    toast.classList.remove('is-visible');
    toast.setAttribute('aria-hidden', 'true');
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
      toastTimeoutId = null;
    }
  };

  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', hideToast);
  }

  // ==========================================================================
  // 6. Contact Form Validation & Submission
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');
  const charCount = document.getElementById('char-count');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const nameGroup = document.getElementById('name-group');
  const emailGroup = document.getElementById('email-group');
  const messageGroup = document.getElementById('message-group');

  let hasSubmittedOnce = false;

  // Real-time character counter for message textarea
  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      const currentLength = messageInput.value.length;
      charCount.textContent = `${currentLength} / 500`;
      if (hasSubmittedOnce) {
        validateMessage();
      }
    });
  }

  // Validation functions
  const validateName = () => {
    const value = nameInput.value.trim();

    if (!value) {
      setFieldError(nameGroup, nameInput, nameError, 'Full name is required.');
      return false;
    }

    if (value.length < 2) {
      setFieldError(nameGroup, nameInput, nameError, 'Name must be at least 2 characters long.');
      return false;
    }

    // Name regex: allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(value)) {
      setFieldError(nameGroup, nameInput, nameError, 'Name can only contain letters, spaces, and hyphens.');
      return false;
    }

    setFieldSuccess(nameGroup, nameInput, nameError);
    return true;
  };

  const validateEmail = () => {
    const value = emailInput.value.trim();

    if (!value) {
      setFieldError(emailGroup, emailInput, emailError, 'Email address is required.');
      return false;
    }

    // Standard RFC compliant email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(value)) {
      setFieldError(emailGroup, emailInput, emailError, 'Please enter a valid email address (e.g. name@domain.com).');
      return false;
    }

    setFieldSuccess(emailGroup, emailInput, emailError);
    return true;
  };

  const validateMessage = () => {
    const value = messageInput.value.trim();

    if (!value) {
      setFieldError(messageGroup, messageInput, messageError, 'Message is required.');
      return false;
    }

    if (value.length < 10) {
      setFieldError(messageGroup, messageInput, messageError, `Message must be at least 10 characters (currently ${value.length}).`);
      return false;
    }

    setFieldSuccess(messageGroup, messageInput, messageError);
    return true;
  };

  const setFieldError = (group, input, errorEl, message) => {
    group.classList.add('has-error');
    group.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    errorEl.textContent = message;
  };

  const setFieldSuccess = (group, input, errorEl) => {
    group.classList.remove('has-error');
    group.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
    errorEl.textContent = '';
  };

  const clearFieldStatus = (group, input, errorEl) => {
    group.classList.remove('has-error', 'is-valid');
    input.removeAttribute('aria-invalid');
    errorEl.textContent = '';
  };

  // Blur events for real-time validation after user leaves input
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      if (hasSubmittedOnce || nameInput.value.trim().length > 0) {
        validateName();
      }
    });
    nameInput.addEventListener('input', () => {
      if (hasSubmittedOnce) validateName();
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      if (hasSubmittedOnce || emailInput.value.trim().length > 0) {
        validateEmail();
      }
    });
    emailInput.addEventListener('input', () => {
      if (hasSubmittedOnce) validateEmail();
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      if (hasSubmittedOnce || messageInput.value.trim().length > 0) {
        validateMessage();
      }
    });
  }

  // Form submission handling
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hasSubmittedOnce = true;

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        // Focus on the first invalid field
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else messageInput.focus();

        showToast('Incomplete Form', 'Please review the highlighted fields and correct any errors.', true);
        return;
      }

      // Simulate network request with loading state
      const senderName = nameInput.value.trim();
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        // Reset submit button state
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;

        // Reset the form
        contactForm.reset();
        hasSubmittedOnce = false;

        clearFieldStatus(nameGroup, nameInput, nameError);
        clearFieldStatus(emailGroup, emailInput, emailError);
        clearFieldStatus(messageGroup, messageInput, messageError);

        if (charCount) {
          charCount.textContent = '0 / 500';
        }

        // Show success confirmation toast
        showToast(
          'Message Sent Successfully!',
          `Thank you, ${senderName}! We've received your note and will be in touch shortly.`
        );
      }, 950);
    });
  }

  // ==========================================================================
  // 7. Footer Dynamic Year
  // ==========================================================================
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
