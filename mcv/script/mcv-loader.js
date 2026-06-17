(function initMcvLoader() {
  const startedAt = Date.now();
  const minimumTime = 650;
  let closed = false;

  function closeLoader() {
    if (closed || !document.body) return;
    closed = true;

    const delay = Math.max(0, minimumTime - (Date.now() - startedAt));

    window.setTimeout(() => {
      document.body.classList.add("mcv-loader-ready");

      window.setTimeout(() => {
        document.querySelectorAll("[data-mcv-loader]").forEach(loader => {
          loader.remove();
        });
      }, 450);
    }, delay);
  }

  if (document.readyState === "complete") {
    closeLoader();
  } else {
    window.addEventListener("load", closeLoader, { once: true });
  }

  window.setTimeout(closeLoader, 4500);
})();
