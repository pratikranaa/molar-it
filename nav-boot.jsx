const navEl = document.getElementById('nav-root');
if (navEl && window.Nav) {
  ReactDOM.createRoot(navEl).render(React.createElement(window.Nav));
}
