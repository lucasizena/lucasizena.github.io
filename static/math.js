(() => {
  const render = () => {
    const content = document.querySelector(".content");

    if (
      !content ||
      content.dataset.mathRendered === "true" ||
      typeof window.renderMathInElement !== "function"
    ) {
      return;
    }

    window.renderMathInElement(content, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      throwOnError: false,
      strict: "warn",
      macros: {
        "\\msub": "_",
      },
    });

    content.dataset.mathRendered = "true";
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, {
      once: true,
    });
  } else {
    render();
  }
})();
