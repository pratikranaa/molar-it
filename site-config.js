// Shared site flags — load before nav.jsx on any page that uses the React nav.
window.MOLAR_SITE = window.MOLAR_SITE || {
  showPricing: false,
};

if (!window.MOLAR_SITE.showPricing) {
  document.documentElement.classList.add('pricing-off');
}
