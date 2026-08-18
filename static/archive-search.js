(() => {
  const archiveTagLinks = [
    ...document.querySelectorAll("[data-archive-link-tag]"),
  ];

  archiveTagLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const url = new URL(link.href, window.location.href);
      url.searchParams.set(
        "tag",
        link.dataset.archiveLinkTag,
      );

      window.location.href = url.toString();
    });
  });
  const input = document.querySelector("#archive-search-input");
  const status = document.querySelector(".archive-search-status");
  const empty = document.querySelector(".archive-search-empty");

  if (!input || !status || !empty) return;

  const normalise = (value) =>
    value.trim().toLocaleLowerCase();

  const tagButtons = [
    ...document.querySelectorAll("[data-archive-tag]"),
  ];

  const selectedTags = new Set();
  const availableTags = new Set(
    tagButtons.map((button) =>
      normalise(button.dataset.archiveTag)
    ),
  );

  const initialTags = new URLSearchParams(
    window.location.search,
  ).getAll("tag");

  initialTags.forEach((tag) => {
    const normalisedTag = normalise(tag);

    if (availableTags.has(normalisedTag)) {
      selectedTags.add(normalisedTag);
    }
  });

  const entries = [
    ...document.querySelectorAll(".archive-entry"),
  ].map((element) => {
    const tags = new Set(
      [...element.querySelectorAll(".post-tags .tag-chip")]
        .map((chip) =>
          normalise(chip.dataset.archiveTag || chip.textContent)
        )
        .filter(Boolean),
    );

    return {
      element,
      tags,
      text: normalise(element.textContent),
    };
  });

  const updateTagButtons = () => {
    tagButtons.forEach((button) => {
      const tag = normalise(button.dataset.archiveTag);
      const selected = selectedTags.has(tag);

      button.setAttribute("aria-pressed", String(selected));
    });
  };

  const updateUrl = () => {
    const url = new URL(window.location.href);

    url.searchParams.delete("tag");

    selectedTags.forEach((tag) => {
      url.searchParams.append("tag", tag);
    });

    history.replaceState(
      history.state,
      "",
      url.toString()
    );
  };

  const filterEntries = () => {
    const query = normalise(input.value);
    const requiredTags = [...selectedTags];
    let visibleCount = 0;

    entries.forEach(({ element, tags, text }) => {
      const matchesSearch = !query || text.includes(query);
      const matchesTags = requiredTags.every((tag) =>
        tags.has(tag)
      );

      const matches = matchesSearch && matchesTags;

      element.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    const filtersActive =
      Boolean(query) || selectedTags.size > 0;

    empty.hidden = visibleCount !== 0;

    status.textContent = filtersActive
      ? `${visibleCount} ${visibleCount === 1 ? "post" : "posts"} found`
      : "";
  };

  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tag = normalise(button.dataset.archiveTag);
      if (!tag) return;

      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
      } else {
        selectedTags.add(tag);
      }

      updateUrl();
      updateTagButtons();
      filterEntries();
    });
  });

  input.addEventListener("input", filterEntries);

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    input.value = "";
    selectedTags.clear();

    updateUrl();
    updateTagButtons();
    filterEntries();
    input.blur();
  });
  updateTagButtons();
  filterEntries();
})();
