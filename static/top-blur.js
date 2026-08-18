(() => {
  if (window.__topBlurInstalled) {
    return;
  }

  window.__topBlurInstalled = true;

  let frameId = null;

  const update = () => {
    frameId = null;

    const blur = document.querySelector(".content-top-blur");
    const sentinel = document.querySelector(
      ".content-blur-sentinel"
    );

    if (!blur || !sentinel) {
      return;
    }

    blur.classList.toggle(
      "is-stuck",
      sentinel.getBoundingClientRect().top < 0
    );
  };

  const scheduleUpdate = () => {
    if (frameId === null) {
      frameId = requestAnimationFrame(update);
    }
  };

  scheduleUpdate();

  window.addEventListener("scroll", scheduleUpdate, {
    passive: true,
  });

  window.addEventListener("resize", scheduleUpdate);
})();
