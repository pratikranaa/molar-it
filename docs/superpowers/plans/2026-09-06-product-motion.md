# Product motion implementation

Keep the existing Molar identity, product truth, native scrolling, and demo controls. Motion explains how the browser, services, release check, and debugging record connect.

1. Replace the homepage product tabs with four readable chapters and a pinned, scroll-selected illustration deck. Mobile, reduced-motion, and JavaScript-free visitors get each illustration beside its chapter. Verify forward/back scrolling, direct chapter links, resize, zoom, and keyboard navigation.
2. Add a bounded hero assembly, selected illustration reveals, and a scroll-drawn platform output connector. Use CSS and Web Animations without dependencies; content starts visible. Verify cancellation on hidden documents and dynamic reduced-motion changes.
3. Add brief navigation opacity and icon feedback while keeping menu text at final coordinates. Verify hover, focus, Escape, copying, and the existing interactive examples.
4. Build and inspect desktop/mobile captures, exercise motion and fallback states, measure scroll frame pacing, and run existing navigation/conversion checks. Publish to the existing Cloudflare Pages project and compare deployed files with the release output.

Ownership: root owns `product-process.mjs`, `motion.css`, `motion.js`, build integration, verification, and deployment. One bounded implementation agent owns only `motion-feedback.css`.

References: MDN Web Animations API and animation-timeline documentation, web.dev high-performance animations guide, Framer scroll animation guidance, and Molar's earlier `animations.jsx`. This implementation uses native APIs and does not port competitor code. No scroll hijacking, artificial preloaders, cursor replacement, or continuous pointer/particle loops.
