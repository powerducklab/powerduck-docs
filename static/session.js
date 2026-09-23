/**
 * Reflects the shared, same-origin session into the docs navbar "Sign in"
 * item. The docs are served from the same origin as the API, so the session
 * cookie set by the Cloud app is available here.
 */
(function () {
  "use strict";

  function applyState(targetHref, label) {
    document.querySelectorAll(".header-signin-link").forEach(function (el) {
      el.setAttribute("href", targetHref);
      el.textContent = label;
    });
  }

  function reflect() {
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then(function (response) {
        return response.ok ? response.json() : null;
      })
      .then(function (data) {
        if (data && data.user) {
          applyState("/console", "Console");
        } else {
          // Docusaurus prefixes root-relative hrefs with baseUrl; reset it to
          // the real origin-root sign-in route.
          applyState("/signin", "Sign in");
        }
      })
      .catch(function () {
        applyState("/signin", "Sign in");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reflect);
  } else {
    reflect();
  }
})();
