(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const pageKey = (value) => {
    const url = new URL(value, window.location.href);
    let pathname = url.pathname.replace(/\/index\.html$/, "/");

    if (pathname.length > 1) {
      pathname = pathname.replace(/\/+$/, "");
    }

    return `${url.origin}${pathname}${url.search}${url.hash}`;
  };

  const cameFromThisWebsite = () => {
    const activation = window.navigation?.activation;

    // Do not animate a browser reload.
    if (activation?.navigationType === "reload") {
      return false;
    }

    const previousUrl =
      activation?.from?.url ||
      document.referrer;

    if (!previousUrl) {
      return false;
    }

    try {
      return (
        new URL(previousUrl).origin ===
        window.location.origin
      );
    } catch {
      return false;
    }
  };

  const playFallbackTransition = () => {
    if (reducedMotion.matches) {
      return;
    }

    const target =
      document.querySelector(".wrapper") ||
      document.body;

    if (!target || typeof target.animate !== "function") {
      return;
    }

    const animation = target.animate(
      [
        {
          opacity: 0.05
        },
        {
          opacity: 1
        }
      ],
      {
        duration: 320,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both"
      }
    );

    animation.finished
      .catch(() => {})
      .then(() => animation.cancel());
  };

  window.addEventListener("pagereveal", (event) => {
    if (!cameFromThisWebsite()) {
      return;
    }

    // The browser decided not to create a native transition.
    if (!event.viewTransition) {
      playFallbackTransition();
      return;
    }

    // A native transition was created but subsequently skipped.
    event.viewTransition.ready.catch(() => {
      playFallbackTransition();
    });
  });

  // Fallback for browsers without the pagereveal event.
  if (!("onpagereveal" in window)) {
    window.addEventListener(
      "DOMContentLoaded",
      () => {
        if (cameFromThisWebsite()) {
          playFallbackTransition();
        }
      },
      { once: true }
    );
  }

  // Avoid reloading or animating the page already open.
  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const link = event.target.closest?.("a[href]");

    if (
      !link ||
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self")
    ) {
      return;
    }

    const destination = new URL(
      link.href,
      window.location.href
    );

    if (destination.origin !== window.location.origin) {
      return;
    }

    if (
      pageKey(destination) ===
      pageKey(window.location.href)
    ) {
      event.preventDefault();
    }
  });
})();