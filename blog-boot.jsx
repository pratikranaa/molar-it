// Mounts the shared marketing nav/footer around static blog article HTML.
(function () {
  const chrome = window.MolarMarketingChrome;
  if (!chrome || !ReactDOM || !React) return;
  ReactDOM.createRoot(document.getElementById("chrome-nav")).render(
    React.createElement(chrome.MarketingNav),
  );
  ReactDOM.createRoot(document.getElementById("chrome-footer")).render(
    React.createElement(chrome.MarketingFooter),
  );
})();
