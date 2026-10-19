/**
 * Reflects the shared, same-origin session into the docs navbar "Sign in"
 * item. The docs are served from the same origin as the API, so the session
 * cookie set by the Cloud app is available here.
 */
(function () {
  "use strict";

  var labels = {"en": "Console", "zh-CN": "控制台", "zh-TW": "主控台", "ja-JP": "コンソール", "ko-KR": "콘솔", "fr-FR": "Console", "de-DE": "Konsole", "es-ES": "Consola", "pt-BR": "Console", "ar-SA": "لوحة التحكم", "it-IT": "Console", "ru-RU": "Консоль", "hi-IN": "कंसोल", "id-ID": "Konsol", "vi-VN": "Bảng điều khiển", "tr-TR": "Konsol"};

  function applyState(targetHref, label) {
    document.querySelectorAll(".header-signin-link").forEach(function (el) {
      el.setAttribute("href", targetHref);
      if (label) el.textContent = label;
    });
  }

  function reflect() {
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then(function (response) {
        return response.ok ? response.json() : null;
      })
      .then(function (data) {
        if (data && data.user) {
          applyState("/console", labels[document.documentElement.lang] || "Console");
        } else {
          // Docusaurus prefixes root-relative hrefs with baseUrl; reset it to
          // the real origin-root sign-in route.
          applyState("/signin");
        }
      })
      .catch(function () {
        applyState("/signin");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reflect);
  } else {
    reflect();
  }
})();
