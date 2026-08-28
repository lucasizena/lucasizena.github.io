(() => {
  const wideScreen = window.matchMedia("(min-width: 1250px)");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const jumpToElement = (element) => {
    const startY = window.scrollY;
    const maximumY = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const destinationY = Math.max(
      0,
      Math.min(
        element.getBoundingClientRect().top + startY - 64,
        maximumY
      )
    );

    window.scrollTo({
      top: destinationY,
      left: 0,
      behavior: "instant"
    });
  };

  const playFadeIn = () => {
    const surface =
      document.querySelector(".wrapper") || document.body;

    if (
      reducedMotion.matches ||
      typeof surface.animate !== "function"
    ) {
      return;
    }

    const animation = surface.animate(
      [{ opacity: 0.05 }, { opacity: 1 }],
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

  const playFallbackFade = async (update) => {
    const surface =
      document.querySelector(".wrapper") || document.body;

    if (
      reducedMotion.matches ||
      typeof surface.animate !== "function"
    ) {
      update();
      return;
    }

    const fadeOut = surface.animate(
      [{ opacity: 1 }, { opacity: 0.05 }],
      {
        duration: 140,
        easing: "ease-out",
        fill: "both"
      }
    );

    await fadeOut.finished.catch(() => {});
    update();
    fadeOut.cancel();
    playFadeIn();
  };

  const fadeToElement = (element, href, beforeJump) => {
    const update = () => {
      beforeJump?.();
      jumpToElement(element);
      history.replaceState(null, "", href);
    };

    if (reducedMotion.matches) {
      update();
      return;
    }

    if (typeof document.startViewTransition === "function") {
      try {
        const transition = document.startViewTransition(update);

        transition.ready.catch(playFadeIn);
        return;
      } catch {
        /* Fall through to the Web Animations fallback. */
      }
    }

    void playFallbackFade(update);
  };

  const revealPost = (post) => {
    if (!post.classList.contains("is-collapsed")) {
      return;
    }

    post.classList.remove(
      "is-collapsed",
      "is-expanding",
      "is-collapsing"
    );
    post.style.removeProperty("overflow");

    const button = document.getElementById(
      post.dataset.collapseButton
    );

    if (button) {
      button.hidden = false;
      button.setAttribute("aria-expanded", "true");

      const label = button.querySelector(".read-more-label");

      if (label) {
        label.textContent = "Show less";
      }
    }
  };

  const createSidenotes = () => {
    const contentColumn = document.querySelector(".content");
    const posts = [...document.querySelectorAll(".post-body")];

    if (!contentColumn || posts.length === 0) {
      return;
    }

    const sidenotes = [];

    posts.forEach((post, postIndex) => {
      if (post.dataset.sidenotesReady === "true") {
        return;
      }

      const content = post.querySelector(".post-body-content");

      if (!content) {
        return;
      }

      let createdSidenote = false;

      content
        .querySelectorAll(".footnote-reference")
        .forEach((reference, referenceIndex) => {
          const link = reference.querySelector('a[href*="#fn-"]');

          if (!link) {
            return;
          }

          const destination = new URL(
            link.href,
            window.location.href
          );

          const definitionId = decodeURIComponent(
            destination.hash.slice(1)
          );

          /*
           * Footnote IDs can repeat when several posts are rendered on
           * the Wall, so find the definition inside this particular post.
           */
          const definition = [...post.querySelectorAll("[id]")]
            .find((element) => element.id === definitionId);

          if (!definition) {
            return;
          }

          const number = link.textContent
            .replace(/[\[\]]/g, "")
            .trim();

          /* Remove Zola's square brackets around the number. */
          link.textContent = number;

          const sidenote = document.createElement("span");

          sidenote.className = "sidenote";
          sidenote.id = `sidenote-${postIndex + 1}-${
            referenceIndex + 1
          }`;
          sidenote.dataset.number = number;
          sidenote.setAttribute("role", "note");
          sidenote.setAttribute(
            "aria-label",
            `Footnote ${number}`
          );

          const paragraphs = [
            ...definition.querySelectorAll(":scope > p")
          ];

          const sourceBlocks =
            paragraphs.length > 0
              ? paragraphs
              : [definition];

          sourceBlocks.forEach((source) => {
            const copy = source.cloneNode(true);

            /* Do not copy Zola's return arrows into the sidenote. */
            copy
              .querySelectorAll('a[href*="#fr-"]')
              .forEach((backLink) => backLink.remove());

            const block = document.createElement("span");
            block.className = "sidenote-block";

            while (copy.firstChild) {
              block.append(copy.firstChild);
            }

            sidenote.append(block);
          });

          /*
           * Keep the note outside .post-body so a collapsed Wall post
           * cannot clip it, then position it beside its reference below.
           */
          contentColumn.append(sidenote);

          const postKey = post.id || `post-${postIndex + 1}`;
          const localDefinitionId =
            `${postKey}-fn-${referenceIndex + 1}`;
          const localReferenceId =
            `fr-${postKey}-${referenceIndex + 1}`;

          definition.id = localDefinitionId;
          reference.id = localReferenceId;

          /* Keep the return arrow on the current Wall page too. */
          definition
            .querySelectorAll('a[href*="#fr-"]')
            .forEach((backLink) => {
              backLink.setAttribute(
                "href",
                `#${localReferenceId}`
              );

              backLink.addEventListener("click", (event) => {
                event.preventDefault();
                fadeToElement(
                  reference,
                  `#${localReferenceId}`
                );
              });
            });

          const bottomHref = `#${localDefinitionId}`;

          const updateTarget = () => {
            link.setAttribute(
              "href",
              wideScreen.matches
                ? `#${sidenote.id}`
                : bottomHref
            );
          };

          link.addEventListener("click", (event) => {
            event.preventDefault();

            const useSidenote = wideScreen.matches;

            fadeToElement(
              useSidenote ? sidenote : definition,
              useSidenote ? `#${sidenote.id}` : bottomHref,
              useSidenote ? null : () => revealPost(post)
            );
          });

          wideScreen.addEventListener("change", updateTarget);
          updateTarget();

          sidenotes.push({ post, reference, sidenote });
          createdSidenote = true;
        });

      if (createdSidenote) {
        post.classList.add("has-sidenotes");
      }

      post.dataset.sidenotesReady = "true";
    });

    if (sidenotes.length === 0) {
      return;
    }

    let layoutFrame = null;

    const layoutSidenotes = () => {
      layoutFrame = null;

      if (!wideScreen.matches) {
        sidenotes.forEach(({ sidenote }) => {
          sidenote.hidden = true;
        });
        return;
      }

      const contentTop =
        contentColumn.getBoundingClientRect().top;
      let nextAvailableTop = 0;

      sidenotes.forEach(({ post, reference, sidenote }) => {
        const postRect = post.getBoundingClientRect();
        const referenceRect = reference.getBoundingClientRect();
        const overflowY = getComputedStyle(post).overflowY;
        const clipsContent =
          overflowY === "hidden" || overflowY === "clip";
        const referenceIsVisible =
          !clipsContent ||
          (referenceRect.top >= postRect.top - 1 &&
            referenceRect.bottom <= postRect.bottom + 1);

        sidenote.hidden = !referenceIsVisible;

        if (!referenceIsVisible) {
          return;
        }

        const preferredTop = referenceRect.top - contentTop;
        const top = Math.max(preferredTop, nextAvailableTop);

        sidenote.style.top = `${top}px`;
        nextAvailableTop = top + sidenote.offsetHeight + 12;
      });
    };

    const scheduleLayout = () => {
      if (layoutFrame !== null) {
        return;
      }

      layoutFrame = requestAnimationFrame(layoutSidenotes);
    };

    wideScreen.addEventListener("change", scheduleLayout);
    window.addEventListener("resize", scheduleLayout);
    window.addEventListener("load", scheduleLayout, {
      once: true
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleLayout);
    }

    if ("ResizeObserver" in window) {
      const postObserver = new ResizeObserver(scheduleLayout);

      posts.forEach((post) => postObserver.observe(post));
    }

    scheduleLayout();
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      createSidenotes,
      { once: true }
    );
  } else {
    createSidenotes();
  }
})();
