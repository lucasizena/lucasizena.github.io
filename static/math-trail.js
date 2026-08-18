(() => {
  const layer = document.querySelector(".math-trail");
  const finePointer = window.matchMedia(
    "(pointer: fine) and (hover: hover)",
  );
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  if (
    !layer ||
    !finePointer.matches ||
    reducedMotion.matches ||
    typeof katex === "undefined"
  ) {
    return;
  }

  const expressions = [
    String.raw`F(n) \coloneqq \displaystyle\max_{\substack{m < n \\ m \textrm{ composite}}} m + p(m)`,
    String.raw`e^{i\pi}+1=0`,
    String.raw`\mathbb{E}[X_1 + \cdots + X_n] = \mathbb{E}[X_1] + \cdots + \mathbb{E}[X_n]`,
    String.raw`a^p \equiv a \pmod p`,
    String.raw`\displaystyle\binom{n}{k} = \displaystyle\binom{n - 1}{k} + \displaystyle\binom{n - 1}{k - 1}`,
    String.raw`a^2 + b^2 = c^2`,
    String.raw`\zeta (s) = \displaystyle\sum_{n = 1}^\infty \displaystyle\frac{1}{n^s}`,
  ];

  const renderedExpressions = expressions.map((expression) => {
    const holder = document.createElement("span");

    katex.render(expression, holder, {
      throwOnError: false,
      displayMode: false,
      strict: "ignore",
    });

    const template = document.createElement("template");
    template.content.append(...holder.childNodes);

    return template;
  });

  const pointer = {
    x: 0,
    y: 0,
    active: false,
  };

  let frameId = null;
  let lastEmission = 0;

  const randomBetween = (minimum, maximum) =>
    minimum + Math.random() * (maximum - minimum);

  const clamp = (value, minimum, maximum) =>
    Math.max(minimum, Math.min(maximum, value));

  const gutterAt = (x) => {
    const wrapper = document.querySelector(".wrapper");
    if (!wrapper) return null;

    const bounds = wrapper.getBoundingClientRect();

    if (x < bounds.left) {
      return { side: "left", edge: bounds.left };
    }

    if (x > bounds.right) {
      return { side: "right", edge: bounds.right };
    }

    return null;
  };

const mathPalette = [
  { red: 79, green: 174, blue: 200 },  // blue
  { red: 86, green: 139, blue: 214 },  // blue-violet
  { red: 142, green: 115, blue: 199 }, // purple
  { red: 191, green: 127, blue: 189 }, // mauve
  { red: 220, green: 143, blue: 120 }, // peach
  { red: 230, green: 170, blue: 95 },  // orange
  { red: 214, green: 185, blue: 79 },  // golden yellow
];

let palettePosition = 0;
let paletteDirection = 1;

const nextMathColor = () => {
  const lowerIndex = Math.floor(palettePosition);
  const upperIndex = Math.min(
    lowerIndex + 1,
    mathPalette.length - 1,
  );

  const progress = palettePosition - lowerIndex;
  const lowerColor = mathPalette[lowerIndex];
  const upperColor = mathPalette[upperIndex];

  const mix = (lower, upper) =>
    Math.round(lower + (upper - lower) * progress);

  const color = `rgb(
    ${mix(lowerColor.red, upperColor.red)}
    ${mix(lowerColor.green, upperColor.green)}
    ${mix(lowerColor.blue, upperColor.blue)}
  )`;

  palettePosition += 0.14 * paletteDirection;

  const lastPosition = mathPalette.length - 1;

  if (palettePosition >= lastPosition) {
    palettePosition = lastPosition;
    paletteDirection = -1;
  } else if (palettePosition <= 0) {
    palettePosition = 0;
    paletteDirection = 1;
  }

  return color;
};

  const emit = () => {
    const gutter = gutterAt(pointer.x);

    if (!gutter) {
      pointer.active = false;
      return;
    }

    const angle = randomBetween(0, Math.PI * 2);
    const radius = randomBetween(12, 100);
    const margin = 8;

    let x = pointer.x + Math.cos(angle) * radius;
    let y = pointer.y + Math.sin(angle) * radius;

    const particle = document.createElement("span");
    particle.className = "math-particle";
    particle.style.fontSize = `${randomBetween(11, 16)}px`;
    particle.style.visibility = "hidden";
    particle.style.opacity = "0";

    const renderedExpression =
      renderedExpressions[
        Math.floor(Math.random() * renderedExpressions.length)
      ];

    particle.append(
      renderedExpression.content.cloneNode(true)
    );

    layer.appendChild(particle);

    const particleWidth = particle.offsetWidth;
    const particleHeight = particle.offsetHeight;
    const halfWidth = particleWidth / 2;
    const halfHeight = particleHeight / 2;

    if (gutter.side === "left") {
      const minimumX = margin + halfWidth;
      const maximumX = gutter.edge - margin - halfWidth;

      if (maximumX < minimumX) {
        particle.remove();
        return;
      }

      x = clamp(x, minimumX, maximumX);
    } else {
      const minimumX = gutter.edge + margin + halfWidth;
      const maximumX =
        window.innerWidth - margin - halfWidth;

      if (maximumX < minimumX) {
        particle.remove();
        return;
      }

      x = clamp(x, minimumX, maximumX);
    }

    y = clamp(
      y,
      margin + halfHeight,
      window.innerHeight - margin - halfHeight,
    );

    particle.style.visibility = "visible";
    particle.style.color = nextMathColor();

    const rotation = randomBetween(-0.12, 0.12);
    const driftX = randomBetween(-7, 7);
    const driftY = randomBetween(-14, -4);
    const maximumOpacity = randomBetween(0.16, 0.5);
    const duration = randomBetween(1500, 2400);

    const positionAt = (particleX, particleY) =>
      `translate3d(${particleX}px, ${particleY}px, 0)
       translate(-50%, -50%)
       rotate(${rotation}rad)`;

    const animation = particle.animate(
      [
        {
          opacity: 0,
          transform: positionAt(x, y),
        },
        {
          opacity: maximumOpacity,
          transform: positionAt(
            x + driftX * 0.5,
            y + driftY * 0.5,
          ),
          offset: 0.5,
        },
        {
          opacity: 0,
          transform: positionAt(
            x + driftX,
            y + driftY,
          ),
        },
      ],
      {
        duration,
        easing: "ease-in-out",
        fill: "forwards",
      },
    );

    animation.finished
      .catch(() => {})
      .finally(() => particle.remove());

    while (layer.childElementCount > 42) {
      layer.firstElementChild?.remove();
    }
  };

  const render = (time) => {
    frameId = null;

    if (!pointer.active) return;

    if (time - lastEmission > 105) {
      emit();
      lastEmission = time;
    }

    frameId = requestAnimationFrame(render);
  };

  const requestRender = () => {
    if (frameId === null) {
      frameId = requestAnimationFrame(render);
    }
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      if (
        event.pointerType &&
        event.pointerType !== "mouse"
      ) {
        return;
      }

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = Boolean(gutterAt(pointer.x));

      if (pointer.active) {
        const now = performance.now();

        if (now - lastEmission > 35) {
          emit();
          lastEmission = now;
        }

        requestRender();
      }
    },
    { passive: true },
  );

  document.documentElement.addEventListener(
    "mouseleave",
    () => {
      pointer.active = false;
    },
  );

  window.addEventListener("blur", () => {
    pointer.active = false;
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) return;

    pointer.active = false;
    layer.replaceChildren();
  });
})();
