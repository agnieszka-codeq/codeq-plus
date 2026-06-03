/* =====================================================
   CODEQ PLUS — Main JavaScript
   ===================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------
     STATE
     -------------------------------------------------- */
  const state = {
    billing: 'monthly',   // 'monthly' | 'yearly'
    platform: 'wordpress' // 'wordpress' | 'woocommerce' | 'shopify'
  };

  const PRICES = {
    monthly: { amount: '399', label: 'PLN', period: '/mies.' },
    yearly:  { amount: '349', label: 'PLN', period: '/mies.', orig: '399 PLN/mies.' }
  };

  /* --------------------------------------------------
     NAV — scroll & mobile
     -------------------------------------------------- */
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger && hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
  });

  // close mobile menu on link click
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* --------------------------------------------------
     PLATFORM SWITCH (hero)
     -------------------------------------------------- */
  const platformBtns = document.querySelectorAll('.platform-btn');
  const platformCopies = document.querySelectorAll('[data-platform]');

  function setHeroPlatform(platform) {
    state.platform = platform;
    platformBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.platform === platform));
    platformCopies.forEach(el => {
      el.style.display = el.dataset.platform === platform ? '' : 'none';
    });
  }

  platformBtns.forEach(btn => {
    btn.addEventListener('click', () => setHeroPlatform(btn.dataset.platform));
  });

  /* --------------------------------------------------
     BILLING TOGGLE (hero)
     -------------------------------------------------- */
  const heroBillingInput  = document.getElementById('heroBilling');
  const heroBillingLabels = document.querySelectorAll('.hero-billing-lbl');
  const heroPriceMain     = document.getElementById('heroPriceMain');
  const heroPricePeriod   = document.getElementById('heroPricePeriod');
  const heroPriceOrig     = document.getElementById('heroPriceOrig');

  function updateHeroPrice() {
    const p = PRICES[state.billing];
    if (heroPriceMain)   heroPriceMain.textContent   = p.amount + ' ' + p.label;
    if (heroPricePeriod) heroPricePeriod.textContent = p.period;
    if (heroPriceOrig)   heroPriceOrig.textContent   = p.orig || '';
    heroBillingLabels.forEach(lbl => {
      lbl.classList.toggle('active', lbl.dataset.billing === state.billing);
    });
  }

  heroBillingInput && heroBillingInput.addEventListener('change', () => {
    state.billing = heroBillingInput.checked ? 'yearly' : 'monthly';
    updateHeroPrice();
    syncPricingBilling();
  });

  heroBillingLabels.forEach(lbl => {
    lbl.addEventListener('click', () => {
      const target = lbl.dataset.billing;
      if (target === state.billing) return;
      state.billing = target;
      if (heroBillingInput) heroBillingInput.checked = (target === 'yearly');
      updateHeroPrice();
      syncPricingBilling();
    });
  });

  /* --------------------------------------------------
     PRICING TABS
     -------------------------------------------------- */
  const pricingTabs  = document.querySelectorAll('.pricing-tab');
  const pricingCards = document.querySelectorAll('.pricing-card');

  function setPricingTab(platform) {
    pricingTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.platform === platform));
    pricingCards.forEach(card => {
      if (!card.dataset.platform) return;
      card.style.display = (card.dataset.platform === platform || card.dataset.platform === 'all') ? '' : 'none';
    });
    // show all 3 cards (they're all same price, just different platform badge)
    pricingCards.forEach(card => { card.style.display = ''; });
  }

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => setPricingTab(tab.dataset.platform));
  });

  /* --------------------------------------------------
     BILLING TOGGLE (pricing)
     -------------------------------------------------- */
  const pricingBillingInput  = document.getElementById('pricingBilling');
  const pricingBillingLabels = document.querySelectorAll('.pricing-billing-lbl');
  const priceAmounts         = document.querySelectorAll('[data-price]');
  const priceOrigs           = document.querySelectorAll('[data-price-orig]');

  function updatePricingCards() {
    const isYearly = state.billing === 'yearly';
    priceAmounts.forEach(el => {
      el.textContent = isYearly ? '349 PLN' : '399 PLN';
    });
    priceOrigs.forEach(el => {
      el.style.display = isYearly ? 'block' : 'none';
    });
    pricingBillingLabels.forEach(lbl => {
      lbl.classList.toggle('active', lbl.dataset.billing === state.billing);
    });
    if (pricingBillingInput) pricingBillingInput.checked = isYearly;
  }

  function syncPricingBilling() { updatePricingCards(); }

  pricingBillingInput && pricingBillingInput.addEventListener('change', () => {
    state.billing = pricingBillingInput.checked ? 'yearly' : 'monthly';
    updateHeroPrice();
    updatePricingCards();
  });

  pricingBillingLabels.forEach(lbl => {
    lbl.addEventListener('click', () => {
      const target = lbl.dataset.billing;
      if (target === state.billing) return;
      state.billing = target;
      if (pricingBillingInput) pricingBillingInput.checked = (target === 'yearly');
      updateHeroPrice();
      updatePricingCards();
    });
  });

  /* --------------------------------------------------
     FAQ ACCORDION
     -------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const body    = item.querySelector('.faq-body');

    trigger && trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.faq-body');
        if (b) b.style.height = '0';
      });

      // open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('open');
        if (body) body.style.height = body.scrollHeight + 'px';
      }
    });
  });

  /* --------------------------------------------------
     SCROLL ANIMATIONS — Intersection Observer
     -------------------------------------------------- */
  const animEls = document.querySelectorAll('[data-anim]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animEls.forEach(el => observer.observe(el));
  } else {
    // fallback — show all
    animEls.forEach(el => el.classList.add('visible'));
  }

  /* --------------------------------------------------
     SMOOTH SCROLL for anchor links
     -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --------------------------------------------------
     INIT
     -------------------------------------------------- */
  setHeroPlatform('wordpress');
  updateHeroPrice();
  updatePricingCards();

}());
