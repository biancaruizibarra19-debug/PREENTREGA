const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navCourseToggles = [...document.querySelectorAll("[data-nav-course-toggle]")];
const detailPageLinks = [...document.querySelectorAll("[data-detail-page-link]")];
const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']:not(.search-link)")];
const hero = document.querySelector(".hero");
const heroTitle = document.querySelector("[data-hero-title]");
const heroForeground = document.querySelector("[data-hero-foreground]");
const ctaImage = document.querySelector("[data-cta-image]");
const ctaSection = document.querySelector(".cta");
const aboutGalleryImages = [...document.querySelectorAll("[data-about-gallery]")];
const aboutMobileGallery = document.querySelector("[data-about-mobile-gallery]");
const detailHeroGallery = document.querySelector("[data-detail-hero-gallery]");
const animatedItems = document.querySelectorAll("[data-animate]");
const counters = document.querySelectorAll("[data-count]");
const cursorFollower = document.querySelector(".cursor-follower");
const coachTrack = document.querySelector("[data-coach-track]");
const coachDots = [...document.querySelectorAll("[data-coach-dot]")];
const detailTeamTrack = document.querySelector("[data-detail-team-track]");
const detailTeamDots = [...document.querySelectorAll("[data-detail-team-dot]")];
const coachCards = [...document.querySelectorAll(".coach-card")];
const profileActions = [...document.querySelectorAll(".profile-action")];
const testimonialTrack = document.querySelector("[data-testimonial-track]");
const testimonialDots = [...document.querySelectorAll("[data-testimonial-dot]")];
const weekCarousel = document.querySelector("[data-week-carousel]");
const summitCarousel = document.querySelector("[data-summit-carousel]");
const courseToggles = [...document.querySelectorAll("[data-course-toggle]")];
const planStack = document.querySelector("[data-plan-stack]");
const contactForm = document.querySelector("[data-contact-form]");
const root = document.documentElement;

let cursorFrame = null;
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let followerFrame = null;
let followerX = cursorX;
let followerY = cursorY;
let coachPressedCard = null;
let coachPressX = 0;
let coachPressY = 0;

detailPageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.assign(link.href);
  }, { capture: true });
});

aboutGalleryImages.forEach((image) => {
  const images = [...image.querySelectorAll("img")];
  const caption = image.querySelector("[data-about-caption]");
  let index = 0;
  let timer = null;

  const setImage = (nextIndex) => {
    images[index].classList.remove("is-active");
    index = nextIndex;
    images[index].classList.add("is-active");
    if (caption) {
      caption.textContent = images[index].dataset.caption || "";
    }
  };

  const stopGallery = () => {
    clearInterval(timer);
    timer = null;
    images[index]?.classList.remove("is-active");
    index = 0;
    images[index]?.classList.add("is-active");
    if (caption) {
      caption.textContent = images[index]?.dataset.caption || "";
    }
  };

  image.addEventListener("pointerenter", () => {
    if (images.length < 2 || timer) return;

    timer = setInterval(() => {
      setImage((index + 1) % images.length);
    }, 1500);
  });

  image.addEventListener("pointerleave", stopGallery);
  image.addEventListener("blur", stopGallery);
});

if (aboutMobileGallery) {
  const images = [...aboutMobileGallery.querySelectorAll("img")];
  let index = 0;

  if (images.length > 1) {
    setInterval(() => {
      images[index].classList.remove("is-active");
      index = (index + 1) % images.length;
      images[index].classList.add("is-active");
    }, 1800);
  }
}

if (detailHeroGallery) {
  const detailHeroImages = [...detailHeroGallery.querySelectorAll("img")];
  let detailHeroIndex = 0;

  if (detailHeroImages.length > 1) {
    setInterval(() => {
      detailHeroImages[detailHeroIndex].classList.remove("is-active");
      detailHeroIndex = (detailHeroIndex + 1) % detailHeroImages.length;
      detailHeroImages[detailHeroIndex].classList.add("is-active");
    }, 2500);
  }
}

const updateCoachCarouselPause = () => {
  coachCarousel?.setPaused([...coachTrack?.querySelectorAll(".coach-card") || []].some((coachCard) => coachCard.classList.contains("is-flipped")));
};

const toggleCoachCard = (card) => {
  if (!card) return;

  card.classList.toggle("is-flipped");
  updateCoachCarouselPause();
};

const closeCoachCard = (card) => {
  if (!card) return;

  card.classList.remove("is-flipped");
  updateCoachCarouselPause();
};

const toggleProfileAction = (button) => {
  const isFollowing = button.classList.toggle("is-following");
  button.textContent = isFollowing ? "siguiendo" : "seguir";
  button.setAttribute("aria-pressed", String(isFollowing));
};

const activateProfileAction = (button) => {
  if (!button) return;

  toggleProfileAction(button);
  window.setTimeout(() => {
    closeCoachCard(button.closest(".coach-card"));
  }, 320);
};

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
};

const setActiveNavLink = () => {
  const currentPosition = window.scrollY + window.innerHeight * 0.38;
  let activeId = "home";

  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);

    if (target && target.getBoundingClientRect().top + window.scrollY <= currentPosition) {
      activeId = targetId;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
};

const setHeroDepth = () => {
  if (!hero || !heroTitle || !heroForeground) return;

  const heroRect = hero.getBoundingClientRect();
  const progress = Math.min(Math.max(-heroRect.top / (hero.offsetHeight * 0.62), 0), 1);
  const titleShift = progress * 330;
  const foregroundShift = progress * 4;
  const foregroundScale = 1.015 + progress * 0.003;

  heroTitle.style.setProperty("--hero-title-shift", `${titleShift}px`);
  heroForeground.style.transform = `translate3d(0, ${foregroundShift}px, 0) scale(${foregroundScale})`;
};

const setCtaDepth = () => {
  if (!ctaImage) return;

  const rect = ctaImage.parentElement.getBoundingClientRect();
  const start = window.innerHeight * 0.58;
  const end = Math.max(window.innerHeight * 0.15, rect.height * 0.25);
  const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
  const imageY = 8 + progress * 48;

  ctaImage.style.setProperty("--cta-image-y", `${imageY}%`);
};

const setupCtaVideo = () => {
  if (!(ctaImage instanceof HTMLVideoElement) || !ctaSection) return;

  ctaImage.muted = true;

  const playVideo = () => {
    ctaImage.play().catch(() => {});
  };

  const pauseVideo = () => {
    ctaImage.pause();
  };

  if (!("IntersectionObserver" in window)) {
    playVideo();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playVideo();
        } else {
          pauseVideo();
        }
      });
    },
    { threshold: 0.42 }
  );

  observer.observe(ctaSection);
};

const setCursorLight = () => {
  cursorFrame = null;
  root.style.setProperty("--cursor-x", `${cursorX}px`);
  root.style.setProperty("--cursor-y", `${cursorY}px`);
};

const moveCursorLight = (event) => {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  cursorX = event.clientX;
  cursorY = event.clientY;
  document.body.classList.add("has-cursor-light");
  cursorFollower?.classList.add("is-visible");

  if (!cursorFrame) {
    cursorFrame = requestAnimationFrame(setCursorLight);
  }

  if (!followerFrame) {
    followerFrame = requestAnimationFrame(moveCursorFollower);
  }
};

const moveCursorFollower = () => {
  if (!cursorFollower) return;

  followerX += (cursorX - followerX) * 0.32;
  followerY += (cursorY - followerY) * 0.32;
  cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

  if (Math.abs(cursorX - followerX) > 0.1 || Math.abs(cursorY - followerY) > 0.1) {
    followerFrame = requestAnimationFrame(moveCursorFollower);
  } else {
    followerFrame = null;
  }
};

const setCursorTarget = (event) => {
  const target = event.target.closest("a, button, .coach-card, .course-marker, .testimonial, .benefit, .week-track article");
  cursorFollower?.classList.toggle("is-active", Boolean(target));
};

const createCarousel = ({ track, dots, shiftProperty, dragProperty, interval = 4200, mobileItemsSelector = null, dotLabel = "items" }) => {
  if (!track || !dots.length) return null;

  let page = 0;
  let timer = null;
  let dotButtons = [...dots];
  const mobileQuery = window.matchMedia("(max-width: 620px)");
  let startX = 0;
  let dragX = 0;
  let dragging = false;
  let dragged = false;
  let paused = false;

  const getPageCount = () => {
    if (mobileItemsSelector && mobileQuery.matches) {
      return track.querySelectorAll(mobileItemsSelector).length;
    }

    return track.children.length;
  };

  const syncDots = (pageCount) => {
    const dotWrap = dotButtons[0]?.parentElement;

    while (dotWrap && dotButtons.length < pageCount) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Ver ${dotLabel} ${dotButtons.length + 1}`);
      dot.addEventListener("click", () => {
        setPage(dotButtons.indexOf(dot));
        start();
      });
      dotWrap.appendChild(dot);
      dotButtons.push(dot);
    }
  };

  const setPage = (nextPage) => {
    const pageCount = getPageCount();
    const pageWidth = track.parentElement.clientWidth;

    syncDots(pageCount);
    page = (nextPage + pageCount) % pageCount;
    track.style.setProperty(shiftProperty, `${page * pageWidth}px`);
    track.style.setProperty(dragProperty, "0px");
    dotButtons.forEach((dot, index) => {
      dot.hidden = index >= pageCount;
      dot.classList.toggle("on", index === page);
    });
  };

  const start = () => {
    clearInterval(timer);
    if (paused) return;
    timer = setInterval(() => setPage(page + 1), interval);
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  const dragStart = (event) => {
    if (event.target.closest(".profile-action")) return;

    dragging = true;
    dragged = false;
    startX = event.clientX;
    dragX = 0;
    clearInterval(timer);
    track.classList.add("is-dragging");
    track.setPointerCapture?.(event.pointerId);
  };

  const dragMove = (event) => {
    if (!dragging) return;

    dragX = event.clientX - startX;
    dragged = Math.abs(dragX) > 8;
    track.style.setProperty(dragProperty, `${dragX}px`);
  };

  const dragEnd = () => {
    if (!dragging) return;

    const pageWidth = track.parentElement.clientWidth;
    const shouldSlide = Math.abs(dragX) > Math.min(pageWidth * 0.22, 120);
    const direction = dragX < 0 ? 1 : -1;

    dragging = false;
    track.classList.remove("is-dragging");
    track.dataset.wasDragged = dragged ? "true" : "false";
    window.setTimeout(() => {
      track.dataset.wasDragged = "false";
    }, 0);
    setPage(shouldSlide ? page + direction : page);
    start();
  };

  dotButtons.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setPage(index);
      start();
    });
  });

  track.addEventListener("pointerdown", dragStart);
  track.addEventListener("pointermove", dragMove);
  track.addEventListener("pointerup", dragEnd);
  track.addEventListener("pointercancel", dragEnd);
  track.addEventListener("lostpointercapture", dragEnd);

  setPage(0);
  start();

  return {
    refresh: () => setPage(page),
    setPaused: (isPaused) => {
      paused = isPaused;
      if (isPaused) {
        stop();
      } else {
        start();
      }
    }
  };
};

const coachCarousel = createCarousel({
  track: coachTrack,
  dots: coachDots,
  shiftProperty: "--coach-shift",
  dragProperty: "--coach-drag",
  mobileItemsSelector: ".coach-card",
  dotLabel: "instructores"
});

const detailTeamCarousel = createCarousel({
  track: detailTeamTrack,
  dots: detailTeamDots,
  shiftProperty: "--detail-team-shift",
  dragProperty: "--detail-team-drag",
  mobileItemsSelector: ".coach-card",
  dotLabel: "instructores"
});

const testimonialCarousel = createCarousel({
  track: testimonialTrack,
  dots: testimonialDots,
  shiftProperty: "--testimonial-shift",
  dragProperty: "--testimonial-drag",
  interval: 4600,
  mobileItemsSelector: ".testimonial",
  dotLabel: "testimonios"
});

const createDepthCarousel = (carousel) => {
  if (!carousel) return null;

  const track = carousel.querySelector(".week-track");
  const cards = [...carousel.querySelectorAll(".week-track article")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = 0;
  let timer = null;
  let startX = 0;
  let dragX = 0;
  let isDragging = false;
  let pressedCard = null;

  const signedOffset = (index) => {
    const total = cards.length;
    const raw = (index - active + total) % total;
    return raw > total / 2 ? raw - total : raw;
  };

  const setActive = (nextIndex) => {
    active = (nextIndex + cards.length) % cards.length;

    cards.forEach((card, index) => {
      const offset = signedOffset(index);
      const visibleOffset = Math.max(-3, Math.min(3, offset));

      card.style.setProperty("--slot", visibleOffset);
      card.classList.toggle("is-active", offset === 0);
      card.classList.toggle("is-near", Math.abs(offset) === 1);
      card.classList.toggle("is-far", Math.abs(offset) === 2);
      card.classList.toggle("is-hidden", Math.abs(offset) > 2);
      card.setAttribute("aria-hidden", String(Math.abs(offset) > 2));
      card.setAttribute("aria-current", offset === 0 ? "true" : "false");
      card.tabIndex = Math.abs(offset) <= 2 ? 0 : -1;
    });
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (reducedMotion.matches) return;
    timer = setInterval(() => setActive(active + 1), 3200);
  };

  const goTo = (index) => {
    setActive(index);
    start();
  };

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (index !== active) goTo(index);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goTo(index);
      }
    });
  });

  track.addEventListener("pointerdown", (event) => {
    isDragging = true;
    pressedCard = event.target.closest(".week-track article");
    startX = event.clientX;
    dragX = 0;
    stop();
    track.setPointerCapture?.(event.pointerId);
  });

  track.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    dragX = event.clientX - startX;
  });

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;

    if (Math.abs(dragX) <= 10 && pressedCard) {
      const cardIndex = cards.indexOf(pressedCard);
      if (cardIndex >= 0 && cardIndex !== active) {
        setActive(cardIndex);
      }
    } else if (Math.abs(dragX) > 45) {
      setActive(active + (dragX < 0 ? 1 : -1));
    }

    pressedCard = null;
    start();
  };

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("lostpointercapture", endDrag);
  carousel.addEventListener("pointerenter", stop);
  carousel.addEventListener("pointerleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  setActive(0);
  start();

  return {
    refresh: () => setActive(active)
  };
};

const createSummitCarousel = (carousel) => {
  if (!carousel) return null;

  const slides = [
    {
      number: "01",
      title: "Monte Everest",
      copy: "Escalable, pero extrema: requiere expedición, permisos, aclimatación, experiencia y normalmente oxígeno suplementario. Tiene rutas principales por Nepal y Tíbet.",
      meta: "Nepal / Tíbet - 8.849 m",
      image: "assets/images/montana1.png",
      alt: "Montañista avanzando por una arista nevada"
    },
    {
      number: "02",
      title: "Mont Blanc",
      copy: "Muy famoso y escalable por rutas clásicas alpinas, pero no es “trekking”: requiere equipo, aclimatación y manejo en nieve/hielo. Chamonix es uno de los centros históricos del alpinismo.",
      meta: "Francia / Italia - 4.808–4.810",
      image: "assets/images/montaña2.png",
      alt: "Paisaje de alta montaña con nieve y roca"
    },
    {
      number: "03",
      title: "Matterhorn",
      copy: "Escalable, pero muy técnico y peligroso. La ruta normal por Hörnligrat exige experiencia en roca, hielo, crampones y guía.",
      meta: "Suiza / Italia - 4.478 m",
      image: "assets/images/montaña3.png",
      alt: "Alpinistas atravesando terreno nevado"
    },
    {
      number: "04",
      title: "Denali",
      copy: "Escalable por rutas como West Buttress, pero es una expedición seria sobre nieve, hielo, glaciares, frío extremo y altura.",
      meta: "Alaska - 6.190 m",
      image: "assets/images/montaña4.png",
      alt: "Montaña nevada bajo cielo abierto"
    },
    {
      number: "05",
      title: "Kilimanjaro",
      copy: "Es de las más accesibles de esta lista: no suele requerir escalada técnica en la ruta normal, pero sí buena condición física y aclimatación por la altura.",
      meta: "Tanzania - 5.895 m",
      image: "assets/images/montaña5.png",
      alt: "Alpinistas subiendo una pared rocosa nevada"
    },
    {
      number: "06",
      title: "Monte Fuji",
      copy: "Muy famoso y escalable en temporada oficial. Aunque se sube caminando, en la cumbre puede hacer mucho frío incluso en verano.",
      meta: "Japón - 3.776 m",
      image: "assets/images/montaña6.png",
      alt: "Cordada en terreno de montaña"
    }
  ];

  const number = carousel.querySelector("[data-summit-number]");
  const copyWindow = carousel.querySelector(".summit-text-window");
  const currentCopy = carousel.querySelector("[data-summit-copy]");
  const imageWindow = carousel.querySelector(".summit-image-window");
  const currentImage = carousel.querySelector("[data-summit-image]");
  const dots = [...carousel.querySelectorAll("[data-summit-dot]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = 0;
  let timer = null;
  let dragStartY = 0;
  let dragY = 0;
  let isDragging = false;
  let isSwitching = false;
  let pendingIndex = null;
  let transitionTimer = null;

  const buildCopy = (slide) => {
    const node = currentCopy.cloneNode(true);
    node.querySelector("h2").textContent = slide.title;
    node.querySelector("p").textContent = slide.copy;
    node.querySelector("small").textContent = slide.meta;
    node.classList.remove("is-leaving");
    return node;
  };

  const buildImage = (slide) => {
    const node = currentImage.cloneNode(true);
    node.src = slide.image;
    node.alt = slide.alt;
    node.draggable = false;
    node.classList.remove("is-leaving");
    return node;
  };

  const setActive = (nextIndex) => {
    const next = (nextIndex + slides.length) % slides.length;
    if (next === active && copyWindow.querySelectorAll(".summit-text-slide").length > 0) return;
    if (isSwitching) {
      pendingIndex = next;
      return;
    }

    isSwitching = true;
    clearTimeout(transitionTimer);
    copyWindow.querySelectorAll(".summit-text-slide.is-leaving").forEach((node) => node.remove());
    imageWindow.querySelectorAll("img.is-leaving").forEach((node) => node.remove());

    const slide = slides[next];
    const leavingCopy = copyWindow.querySelector(".summit-text-slide.is-active");
    const leavingImage = imageWindow.querySelector("img.is-active");
    const nextCopy = buildCopy(slide);
    const nextImage = buildImage(slide);

    nextCopy.classList.remove("is-active");
    nextImage.classList.remove("is-active");
    copyWindow.appendChild(nextCopy);
    imageWindow.appendChild(nextImage);
    carousel.classList.add("is-switching");

    requestAnimationFrame(() => {
      number.textContent = slide.number;
      carousel.classList.remove("is-switching");
      leavingCopy?.classList.remove("is-active");
      leavingCopy?.classList.add("is-leaving");
      leavingImage?.classList.remove("is-active");
      leavingImage?.classList.add("is-leaving");
      nextCopy.classList.add("is-active");
      nextImage.classList.add("is-active");
    });

    transitionTimer = window.setTimeout(() => {
      leavingCopy?.remove();
      leavingImage?.remove();
      isSwitching = false;

      if (pendingIndex !== null && pendingIndex !== active) {
        const queuedIndex = pendingIndex;
        pendingIndex = null;
        setActive(queuedIndex);
      } else {
        pendingIndex = null;
      }
    }, 620);

    active = next;
    dots.forEach((dot, index) => {
      dot.classList.toggle("on", index === active);
      dot.setAttribute("aria-current", index === active ? "true" : "false");
    });
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (reducedMotion.matches) return;
    timer = setInterval(() => setActive(active + 1), 3600);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActive(index);
      start();
    });
  });

  imageWindow.querySelectorAll("img").forEach((image) => {
    image.draggable = false;
  });

  imageWindow.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  imageWindow.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    isDragging = true;
    dragStartY = event.clientY;
    dragY = 0;
    stop();
    imageWindow.classList.add("is-dragging");
    imageWindow.setPointerCapture?.(event.pointerId);
  });

  imageWindow.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    event.preventDefault();
    dragY = event.clientY - dragStartY;
  });

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    imageWindow.classList.remove("is-dragging");

    if (Math.abs(dragY) > 42) {
      setActive(active + (dragY < 0 ? 1 : -1));
    }

    start();
  };

  imageWindow.addEventListener("pointerup", endDrag);
  imageWindow.addEventListener("pointercancel", endDrag);
  imageWindow.addEventListener("lostpointercapture", endDrag);
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  carousel.addEventListener("pointerenter", stop);
  carousel.addEventListener("pointerleave", () => {
    if (!isDragging) start();
  });
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  dots[0]?.setAttribute("aria-current", "true");
  start();

  return {
    refresh: () => setActive(active)
  };
};

const weekDepthCarousel = createDepthCarousel(weekCarousel);
const summitShowcaseCarousel = createSummitCarousel(summitCarousel);

coachTrack?.addEventListener(
  "pointerdown",
  (event) => {
    if (event.target.closest(".profile-action")) {
      coachPressedCard = null;
      return;
    }

    coachPressedCard = event.target.closest(".coach-card");
    coachPressX = event.clientX;
    coachPressY = event.clientY;
  },
  true
);

coachCards
  .filter((card) => !card.closest("[data-coach-track]"))
  .forEach((card) => {
    card.addEventListener(
      "pointerdown",
      (event) => {
        if (event.target.closest(".profile-action")) {
          coachPressedCard = null;
          return;
        }

        coachPressedCard = card;
        coachPressX = event.clientX;
        coachPressY = event.clientY;
      },
      true
    );
  });

window.addEventListener(
  "pointerup",
  (event) => {
    if (event.target.closest(".profile-action")) {
      coachPressedCard = null;
      return;
    }

    if (!coachPressedCard) return;

    const moved = Math.hypot(event.clientX - coachPressX, event.clientY - coachPressY);
    const card = coachPressedCard;
    coachPressedCard = null;

    if (moved <= 10) {
      toggleCoachCard(card);
    }
  },
  true
);

window.addEventListener("pointercancel", () => {
  coachPressedCard = null;
});

document.addEventListener(
  "pointerdown",
  (event) => {
    if (!event.target.closest(".profile-action")) return;

    event.stopPropagation();
    coachPressedCard = null;
  },
  true
);

document.addEventListener(
  "pointerup",
  (event) => {
    if (!event.target.closest(".profile-action")) return;

    event.stopPropagation();
    coachPressedCard = null;
  },
  true
);

document.addEventListener(
  "click",
  (event) => {
    const button = event.target.closest(".profile-action");
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();
    coachPressedCard = null;
    activateProfileAction(button);
  },
  true
);

setHeaderState();
setActiveNavLink();
setHeroDepth();
setCtaDepth();
setupCtaVideo();
window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("scroll", setActiveNavLink, { passive: true });
window.addEventListener("scroll", setHeroDepth, { passive: true });
window.addEventListener("scroll", setCtaDepth, { passive: true });
window.addEventListener("resize", setHeroDepth);
window.addEventListener("resize", setCtaDepth);
window.addEventListener("resize", setActiveNavLink);
window.addEventListener("resize", () => {
  coachCarousel?.refresh();
  detailTeamCarousel?.refresh();
  testimonialCarousel?.refresh();
  weekDepthCarousel?.refresh();
  summitShowcaseCarousel?.refresh();
});
window.addEventListener("pointermove", moveCursorLight, { passive: true });
window.addEventListener("pointerover", setCursorTarget);
window.addEventListener("pointerout", setCursorTarget);
window.addEventListener("pointerleave", () => {
  document.body.classList.remove("has-cursor-light");
  cursorFollower?.classList.remove("is-visible", "is-active");
});

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));

  if (!isOpen) {
    navCourseToggles.forEach((toggle) => {
      toggle.closest(".nav-course-menu")?.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }
});

navCourseToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const menu = toggle.closest(".nav-course-menu");
    const isOpen = menu?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });
});

nav.addEventListener("click", (event) => {
  const link = event.target.closest("a");

  if (link) {
    const href = link.getAttribute("href") || "";
    const isMobileNav = window.matchMedia("(max-width: 960px)").matches;
    const isCoursePageLink = Boolean(link.closest(".nav-course-dropdown")) && href && !href.startsWith("#");

    if (isMobileNav && isCoursePageLink) {
      event.preventDefault();
    }

    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    navCourseToggles.forEach((toggle) => {
      toggle.closest(".nav-course-menu")?.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });

    if (isMobileNav && isCoursePageLink) {
      window.location.href = link.href;
    }
  }
});

courseToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const point = toggle.closest(".course-point");
    const pointRect = point?.getBoundingClientRect();
    const isOpen = point.classList.toggle("is-open");

    if (pointRect) {
      point.style.setProperty("--course-point-x", `${pointRect.left}px`);
    }

    toggle.setAttribute("aria-expanded", String(isOpen));
  });
});

if (planStack) {
  const planCards = [...planStack.querySelectorAll("[data-plan-card]")];

  const setActivePlan = (activeCard) => {
    planCards.forEach((card) => {
      const isActive = card === activeCard;

      card.classList.toggle("is-active", isActive);
      card.classList.toggle("is-behind", !isActive);
      card.setAttribute("aria-selected", String(isActive));
    });
  };

  planCards.forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("aria-selected", String(card.classList.contains("is-active")));

    card.addEventListener("click", (event) => {
      if (card.classList.contains("is-active") && event.target.closest("a")) return;

      event.preventDefault();
      setActivePlan(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      setActivePlan(card);
    });
  });
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");
  if (!button) return;

  button.textContent = "Mensaje enviado";
  setTimeout(() => {
    button.textContent = "Enviar";
  }, 2200);
});

const runCounter = (counter) => {
  if (counter.dataset.done) return;
  counter.dataset.done = "true";

  const target = Number(counter.dataset.count);
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = `+${Math.round(target * eased)}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      entry.target.querySelectorAll("[data-count]").forEach(runCounter);
      if (entry.target.matches("[data-count]")) runCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  {
    rootMargin: "0px 0px -18% 0px",
    threshold: 0.35
  }
);

animatedItems.forEach((item) => {
  const section = item.closest("section, footer") || document.body;
  const sectionItems = [...section.querySelectorAll("[data-animate]")];
  const staggerIndex = sectionItems.indexOf(item);
  const delay = Math.min(Math.max(staggerIndex, 0), 6) * 90;

  item.style.setProperty("--reveal-delay", `${delay}ms`);
  observer.observe(item);
});

counters.forEach((counter) => observer.observe(counter));
