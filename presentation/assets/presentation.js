document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const prev = body.dataset.prev;
  const next = body.dataset.next;
  const home = body.dataset.home || "index.html";
  const last = body.dataset.last || next || prev || home;
  let carouselApi = null;

  const initAppendixCarousel = () => {
    const root = document.querySelector("[data-appendix-carousel]");
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const dataScript = root.querySelector("[data-carousel-items]");
    const rawItems = root.dataset.items || (dataScript instanceof HTMLScriptElement ? dataScript.textContent : "");
    if (!rawItems) {
      return;
    }

    let items;
    try {
      items = JSON.parse(rawItems);
    } catch {
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    const image = root.querySelector("[data-carousel-image]");
    const caption = root.querySelector("[data-carousel-caption]");
    const eyebrow = root.querySelector("[data-carousel-eyebrow]");
    const title = root.querySelector("[data-carousel-title]");
    const lead = root.querySelector("[data-carousel-lead]");
    const pointList = root.querySelector("[data-carousel-points]");
    const tabs = Array.from(root.querySelectorAll("[data-carousel-tab]"));
    const prevButton = root.querySelector("[data-carousel-prev]");
    const nextButton = root.querySelector("[data-carousel-next]");

    if (
      !(image instanceof HTMLImageElement) ||
      !(caption instanceof HTMLElement) ||
      !(eyebrow instanceof HTMLElement) ||
      !(title instanceof HTMLElement) ||
      !(lead instanceof HTMLElement) ||
      !(pointList instanceof HTMLElement)
    ) {
      return;
    }

    let index = 0;

    const render = () => {
      const item = items[index];
      image.src = item.image;
      image.alt = item.alt;
      caption.textContent = item.caption;
      eyebrow.textContent = item.eyebrow;
      title.textContent = item.title;
      lead.textContent = item.lead;
      pointList.innerHTML = item.points.map((point) => `
        <div class="carousel-point-card">
          <strong>${point.title}</strong>
          <p>${point.copy}</p>
        </div>
      `).join("");

      tabs.forEach((tab, tabIndex) => {
        tab.classList.toggle("is-active", tabIndex === index);
        tab.setAttribute("aria-pressed", tabIndex === index ? "true" : "false");
      });
    };

    const goTo = (nextIndex) => {
      index = (nextIndex + items.length) % items.length;
      render();
    };

    tabs.forEach((tab, tabIndex) => {
      tab.addEventListener("click", () => {
        goTo(tabIndex);
      });
    });

    if (prevButton instanceof HTMLElement) {
      prevButton.addEventListener("click", () => {
        goTo(index - 1);
      });
    }

    if (nextButton instanceof HTMLElement) {
      nextButton.addEventListener("click", () => {
        goTo(index + 1);
      });
    }

    carouselApi = {
      hasItems: true,
      next: () => goTo(index + 1),
      prev: () => goTo(index - 1),
    };

    render();
  };

  document.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLElement) {
      const tag = event.target.tagName;
      const editable = event.target.isContentEditable;
      if (editable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return;
      }
    }

    if (event.key === "ArrowRight") {
      if (next) {
        event.preventDefault();
        window.location.href = next;
        return;
      }

      if (carouselApi?.hasItems) {
        event.preventDefault();
        carouselApi.next();
        return;
      }
    }

    if (event.key === "ArrowLeft") {
      if (prev) {
        event.preventDefault();
        window.location.href = prev;
        return;
      }

      if (carouselApi?.hasItems) {
        event.preventDefault();
        carouselApi.prev();
        return;
      }
    }

    if ((event.key === "PageDown" || event.key === " ") && next) {
      event.preventDefault();
      window.location.href = next;
    }

    if (event.key === "PageUp" && prev) {
      event.preventDefault();
      window.location.href = prev;
    }

    if (event.key === "Home") {
      event.preventDefault();
      window.location.href = home;
    }

    if (event.key === "End") {
      event.preventDefault();
      window.location.href = last;
    }
  });

  initAppendixCarousel();
});
