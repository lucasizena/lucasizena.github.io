(() => {
  if (window.__readMoreInstalled) {
    return;
  }

  window.__readMoreInstalled = true;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const getCollapsedHeight = () =>
    Number.parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--post-collapse-height")
    ) || 540;

  const runningAnimations = new WeakMap();
  const runningBlurAnimations = new WeakMap();

  const animatePost = async (body, expanding) => {
    const blur = body.nextElementSibling?.matches(
      ".post-collapse-blur"
    )
      ? body.nextElementSibling
      : null;

    const startHeight = body.getBoundingClientRect().height;

    runningAnimations.get(body)?.cancel();
    runningAnimations.delete(body);

    if (blur) {
      runningBlurAnimations.get(blur)?.cancel();
      runningBlurAnimations.delete(blur);
    }

    if (
      reducedMotion.matches ||
      typeof body.animate !== "function"
    ) {
      body.classList.remove("is-expanding", "is-collapsing");
      body.classList.toggle("is-collapsed", !expanding);
      body.style.removeProperty("overflow");

      if (blur) {
        blur.style.removeProperty("display");
        blur.style.removeProperty("opacity");
      }

      return true;
    }

    body.classList.remove(
      "is-collapsed",
      "is-expanding",
      "is-collapsing"
    );

    body.classList.add(
      expanding ? "is-expanding" : "is-collapsing"
    );

    body.style.overflow = "hidden";

    const endHeight = expanding
      ? body.scrollHeight
      : Math.min(getCollapsedHeight(), body.scrollHeight);

    const distance = Math.abs(endHeight - startHeight);
    const duration = Math.min(
      580,
      Math.max(340, distance * 0.18)
    );

    let bodyAnimation = body.animate(
      [
        { height: `${startHeight}px` },
        { height: `${endHeight}px` },
      ],
      {
        duration,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "both",
      }
    );

    runningAnimations.set(body, bodyAnimation);

    let blurAnimation = null;

    if (blur) {
      blur.style.display = "block";
      blur.style.opacity = expanding ? "0.82" : "0";

      const blurDuration = expanding ? duration : 140;

      blurAnimation = blur.animate(
        expanding
          ? [{ opacity: 0.82 }, { opacity: 0 }]
          : [{ opacity: 0 }, { opacity: 0.82 }],
        {
          duration: blurDuration,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "both",
        }
      );

      runningBlurAnimations.set(blur, blurAnimation);
    }

    try {
      await bodyAnimation.finished;
    } catch {
      // A second click interrupted this animation.
    }

    if (runningAnimations.get(body) !== bodyAnimation) {
      return false;
    }

    // Smoothly correct any small height change that occurred
    // while the post was expanding.
    if (expanding) {
      const settledHeight = body.scrollHeight;
      const correction = Math.abs(settledHeight - endHeight);

      if (correction > 1) {
        const previousAnimation = bodyAnimation;

        bodyAnimation = body.animate(
          [
            { height: `${endHeight}px` },
            { height: `${settledHeight}px` },
          ],
          {
            duration: Math.min(
              160,
              Math.max(90, correction * 0.2)
            ),
            easing: "ease-out",
            fill: "both",
          }
        );

        runningAnimations.set(body, bodyAnimation);
        previousAnimation.cancel();

        try {
          await bodyAnimation.finished;
        } catch {
          // A second click interrupted the correction.
        }

        if (runningAnimations.get(body) !== bodyAnimation) {
          return false;
        }
      }
    }

    runningAnimations.delete(body);

    if (blur) {
      runningBlurAnimations.delete(blur);
    }

    body.classList.remove("is-expanding", "is-collapsing");
    body.classList.toggle("is-collapsed", !expanding);

    bodyAnimation.cancel();
    body.style.removeProperty("overflow");

    if (blur) {
      blurAnimation?.cancel();
      blur.style.removeProperty("display");
      blur.style.removeProperty("opacity");
    }

    return true;
  };

  const measureBody = (body) => {
    if (runningAnimations.has(body)) {
      return;
    }
    const button = document.getElementById(
      body.dataset.collapseButton
    );

    if (!button) {
      return;
    }

    // Preserve posts the user has already expanded.
    if (button.getAttribute("aria-expanded") === "true") {
      button.hidden = false;
      return;
    }

    const shouldCollapse =
      body.scrollHeight > getCollapsedHeight() + 1;

    body.classList.toggle("is-collapsed", shouldCollapse);
    button.hidden = !shouldCollapse;
  };

  const measureAll = () => {
    document
      .querySelectorAll("[data-collapsible]")
      .forEach(measureBody);
  };

  let measurementFrame = null;

  const scheduleMeasurements = () => {
    if (measurementFrame !== null) {
      return;
    }

    measurementFrame = requestAnimationFrame(() => {
      measurementFrame = null;
      measureAll();
    });
  };

  const initializePosts = () => {
    measureAll();
    scheduleMeasurements();
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.(".read-more");

    if (!button) {
      return;
    }

    const body = document.getElementById(
      button.getAttribute("aria-controls")
    );

    if (!body) {
      return;
    }

    const expanding =
      button.getAttribute("aria-expanded") !== "true";

    button.setAttribute("aria-expanded", String(expanding));

    const label = button.querySelector(".read-more-label");

    if (label) {
      label.textContent = expanding ? "Show less" : "Show more";

      if (!reducedMotion.matches) {
        const labelAnimation = label.animate(
          [
            { opacity: 0.4 },
            { opacity: 1 },
          ],
          {
            duration: 220,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            fill: "both",
          }
        );

        labelAnimation.finished
          .then(() => labelAnimation.cancel())
          .catch(() => {});
      }
    }

    void animatePost(body, expanding);
  });

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializePosts,
      { once: true }
    );
  } else {
    initializePosts();
  }

  window.addEventListener("resize", scheduleMeasurements);
  document.fonts?.ready?.then(scheduleMeasurements);
})();
